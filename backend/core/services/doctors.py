from django.contrib.auth.hashers import make_password
from django.db.models import Avg, Count
from rest_framework.exceptions import PermissionDenied
import random
from utils.email_service import send_html_email

from core.models import DoctorProfile, User


def get_doctor_queryset(user, user_id=None):
    queryset = DoctorProfile.objects.annotate(
        actual_average_rating=Avg("availabilities__appointment__review__rating"),
        actual_total_reviews=Count("availabilities__appointment__review")
    ).select_related("user")

    if user.is_authenticated and user.role == "DOCTOR":
        return queryset.filter(user=user)

    if user_id:
        return queryset.filter(user__id=user_id)

    return queryset


def ensure_doctor_update_allowed(doctor, user):
    if user.role == "ADMIN":
        return

    if user.role == "DOCTOR" and doctor.user == user:
        return

    raise PermissionDenied("You cannot update this profile")


def create_doctor_profile(validated_data):
    username = validated_data.pop("username")
    email = validated_data.pop("email")
    password = validated_data.pop("password")
    profile_image = validated_data.pop("profile_image", None)

    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password),
        role="DOCTOR",
        profile_image=profile_image
    )

    doctor_profile = DoctorProfile.objects.create(
        user=user,
        is_active=True,
        **validated_data
    )

    send_html_email(
        "Welcome to BookMyDoctor - Your Professional Account is Ready",
        "emails/doctor_account_created.html",
        {
            "username": username,
            "email": email,
            "password": password,
            "specialization": validated_data["specialization"],
            "qualification": validated_data["qualification"],
            "experience": validated_data["experience"],
            "consultation_fee": validated_data["consultation_fee"],
            "clinic_name": validated_data["clinic_name"],
            "clinic_address": validated_data["clinic_address"],
            "city": validated_data["city"],
            "contact_no": validated_data["contact_no"],
            "about": validated_data["about"],
        },
        email
    )

    return doctor_profile


def get_seed_reviews(doctor):
    seeded_random = random.Random((doctor.id or 0) * 7919 + (doctor.user_id or 0) * 104729)
    seed_count = seeded_random.randint(12, 40)
    seed_average = round(seeded_random.uniform(3.6, 4.8), 1)
    return seed_average, seed_count


def get_average_rating(doctor):
    seed_average, seed_count = get_seed_reviews(doctor)
    actual_average = getattr(doctor, "actual_average_rating", None)
    actual_count = getattr(doctor, "actual_total_reviews", 0) or 0

    if actual_count == 0 or actual_average is None:
        return seed_average

    combined_total = (seed_average * seed_count) + (float(actual_average) * actual_count)
    combined_count = seed_count + actual_count
    return round(combined_total / combined_count, 1)


def get_total_reviews(doctor):
    _, seed_count = get_seed_reviews(doctor)
    actual_count = getattr(doctor, "actual_total_reviews", 0) or 0
    return seed_count + actual_count


def update_doctor_profile(instance, validated_data, request=None):
    validated_data.pop("user", None)

    for attr, value in validated_data.items():
        setattr(instance, attr, value)

    instance.save()

    if request and request.data.get("delete_image") == "true":
        if instance.user.profile_image:
            instance.user.profile_image.delete(save=False)
            instance.user.profile_image = None
            instance.user.save()

    if request and request.FILES.get("profile_image"):
        if instance.user.profile_image:
            instance.user.profile_image.delete(save=False)
        instance.user.profile_image = request.FILES.get("profile_image")
        instance.user.save()

    return instance
