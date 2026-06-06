from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from utils.email_service import send_html_email

from core.models import Appointment, Availability


def get_appointment_queryset(user):
    queryset = Appointment.objects.select_related(
        "slot",
        "slot__doctor",
        "slot__doctor__user"
    )

    if user.role == "USER":
        return queryset.filter(patient=user)

    if user.role == "DOCTOR":
        return queryset.filter(
            slot__doctor__user=user
        )

    if user.role == "ADMIN":
        return queryset

    return Appointment.objects.none()


def validate_appointment_slot(data):
    slot = data.get("slot")

    if not slot:
        return data

    from django.utils import timezone

    if not slot.is_available:
        raise serializers.ValidationError("This slot is not available.")

    if slot.date < timezone.now().date():
        raise serializers.ValidationError("Cannot book past date.")

    if slot.date == timezone.now().date() and slot.start_time <= timezone.now().time():
        raise serializers.ValidationError("Cannot book past time.")

    if not slot.doctor.is_active:
        raise serializers.ValidationError("Doctor is currently inactive.")

    return data


def create_appointment(user, validated_data):
    slot = validated_data["slot"]
    booking_date = slot.date

    with transaction.atomic():
        slot = Availability.objects.select_for_update().get(id=slot.id)

        if not slot.is_available:
            raise serializers.ValidationError("Slot already booked")

        existing_appointment = Appointment.objects.filter(
            patient=user,
            slot__date=booking_date,
            status__in=["PENDING", "APPROVED", "COMPLETED"]
        ).exists()

        if existing_appointment:
            raise serializers.ValidationError(
                "You already have an active appointment on this day. "
                "You can book another only if the previous one is cancelled or rejected."
            )

        appointment = Appointment.objects.create(
            patient=user,
            slot=slot,
            payment_type=validated_data["payment_type"],
            description=validated_data.get("description", ""),
            fee=slot.doctor.consultation_fee,
            status="PENDING",
            payment_status="UNPAID",
        )

        slot.is_available = False
        slot.save()

        send_html_email(
            "Appointment Confirmed - BookMyDoctor",
            "emails/appointment_booked.html",
            {
                "username": user.username,
                "doctor": slot.doctor.user.username,
                "specialization": slot.doctor.specialization,
                "date": slot.date,
                "time": slot.start_time,
                "clinic": slot.doctor.clinic_name,
                "fee": slot.doctor.consultation_fee,
            },
            user.email
        )

    return appointment


def ensure_appointment_create_allowed(user):
    if user.role != "USER":
        raise PermissionDenied("Only users can book appointments")


def update_appointment_for_user(appointment, user, serializer):
    if user.role == "DOCTOR":
        if appointment.slot.doctor.user != user:
            raise PermissionDenied("Not your appointment")

        updated = serializer.save()

        if serializer.validated_data.get("status") == "REJECTED":
            release_slot_for_rejected_appointment(appointment)

        return updated

    if user.role == "USER":
        raise PermissionDenied("Users cannot modify appointment")

    return serializer.save()


def cancel_appointment_for_user(instance, user):
    if user.role == "USER" and instance.patient == user:
        cancel_appointment(instance)
        return

    raise PermissionDenied("Not allowed to cancel appointment")


def release_slot_for_rejected_appointment(appointment):
    appointment.slot.is_available = True
    appointment.slot.save()


def cancel_appointment(instance):
    instance.status = "CANCELLED"
    instance.save()

    slot = instance.slot
    slot.is_available = True
    slot.save()


def mark_appointment_rated(appointment):
    appointment.is_rated = True
    appointment.save()


def get_appointment_rating(appointment):
    review = appointment.review if hasattr(appointment, "review") else None
    return review.rating if review else None
