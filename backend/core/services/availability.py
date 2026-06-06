from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from core.models import Availability


def get_availability_queryset(user, doctor_id=None):
    if doctor_id:
        return Availability.objects.filter(
            doctor_id=doctor_id,
            is_available=True,
            is_held=False,
        ).order_by("date", "start_time")

    if user.is_authenticated and user.role == "DOCTOR":
        return Availability.objects.filter(
            doctor__user=user
        ).order_by("date", "start_time")

    return Availability.objects.none()


def validate_availability_data(instance, data, doctor):
    if instance:
        date = data.get("date", instance.date)
        start = data.get("start_time", instance.start_time)
    else:
        date = data.get("date")
        start = data.get("start_time")

    if "date" not in data and "start_time" not in data:
        if instance and "is_held" in data and not instance.is_available:
            raise serializers.ValidationError("Booked slots cannot be held or released.")
        return data

    if date < timezone.now().date():
        raise serializers.ValidationError("Cannot set availability in the past.")

    if date == timezone.now().date():
        if start <= timezone.now().time():
            raise serializers.ValidationError("Cannot set past time.")

    if not instance:
        if Availability.objects.filter(
            doctor=doctor,
            date=date,
            start_time=start
        ).exists():
            raise serializers.ValidationError("This time slot already exists.")

    slots = Availability.objects.filter(
        doctor=doctor,
        date=date
    ).exclude(id=instance.id if instance else None)

    for slot in slots:
        diff = abs(
            datetime.combine(date, slot.start_time)
            - datetime.combine(date, start)
        )

        if diff < timedelta(minutes=30):
            raise serializers.ValidationError(
                "Minimum 30 minutes gap required between slots."
            )

    if instance and "is_held" in data and not instance.is_available:
        raise serializers.ValidationError("Booked slots cannot be held or released.")

    return data


def ensure_availability_owner(slot, user, message):
    if slot.doctor.user != user:
        raise PermissionDenied(message)


def create_availability_for_user(serializer, user):
    doctor_profile = user.doctor_profile
    serializer.save(doctor=doctor_profile)


def update_availability_for_user(serializer, user):
    ensure_availability_owner(serializer.instance, user, "You cannot edit this slot")
    serializer.save()


def delete_availability_for_user(instance, user):
    ensure_availability_owner(instance, user, "You cannot delete this slot")
    instance.delete()
