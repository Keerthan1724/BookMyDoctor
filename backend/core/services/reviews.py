from rest_framework import serializers

from core.models import Review


def get_review_queryset(user):
    if user.role == "USER":
        return Review.objects.filter(appointment__patient=user)

    if user.role == "DOCTOR":
        return Review.objects.filter(
            appointment__slot__doctor__user=user
        )

    if user.role == "ADMIN":
        return Review.objects.all()

    return Review.objects.none()


def validate_review_text(value):
    if not value or not value.strip():
        raise serializers.ValidationError("Review text cannot be empty.")
    return value.strip()


def validate_review_data(data, user):
    appointment = data.get("appointment")

    if appointment.is_rated:
        raise serializers.ValidationError("Already reviewed.")

    if appointment.patient != user:
        raise serializers.ValidationError("You cannot review this appointment.")

    if appointment.status != "COMPLETED":
        raise serializers.ValidationError("You can review only after appointment is completed.")

    rating = data.get("rating")
    if rating < 1 or rating > 5:
        raise serializers.ValidationError("Rating must be between 1 and 5.")
    return data


def create_review(serializer):
    review = serializer.save()
    appointment = review.appointment
    appointment.is_rated = True
    appointment.save()
    return review
