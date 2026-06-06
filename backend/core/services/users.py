from utils.email_service import send_html_email
from rest_framework import serializers

from core.models import User


def create_registered_user(validated_data):
    return User.objects.create_user(
        username=validated_data["username"],
        email=validated_data["email"],
        password=validated_data["password"],
        role="USER"
    )


def authenticate_login(authenticate, data):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise serializers.ValidationError("Email and password are required")

    user = authenticate(email=email, password=password)

    if not user:
        raise serializers.ValidationError("Invalid email or password")

    if not user.is_active:
        raise serializers.ValidationError("Account is disabled")

    data["user"] = user
    return data


def get_user_queryset():
    return User.objects.filter(role="USER").order_by("-created_at")


def validate_unique_email(value):
    if User.objects.filter(email=value).exists():
        raise serializers.ValidationError("Email already registered")
    return value


def validate_age(value):
    if value is not None and value <= 0:
        raise serializers.ValidationError("Age must be greater than 0")
    return value


def validate_phone(value):
    if value:
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits")
    return value


def update_user_profile(instance, validated_data):
    new_image = validated_data.get("profile_image")

    if new_image and instance.profile_image:
        instance.profile_image.delete(save=False)

    for attr, value in validated_data.items():
        setattr(instance, attr, value)

    instance.save()
    return instance


def delete_user_account(user):
    user.delete()


def send_user_welcome_email(user):
    send_html_email(
        "Welcome to BookMyDoctor",
        "emails/user_welcome.html",
        {"username": user.username},
        user.email
    )


def delete_profile_image(user):
    if user.profile_image:
        user.profile_image.delete(save=False)
        user.profile_image = None
        user.save()
