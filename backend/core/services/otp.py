from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from utils.email_service import send_html_email

from core.models import OTP


def get_user_for_otp_email(user_model, email):
    try:
        return user_model.objects.get(email=email)
    except user_model.DoesNotExist:
        raise serializers.ValidationError("User with this email does not exist.")


def send_otp(user):
    if user.role != "USER":
        raise serializers.ValidationError({
            "role_restricted": True,
            "role": user.role,
            "message": f"{user.role} accounts cannot reset password via OTP."
        })
    OTP.objects.filter(user=user, is_used=False).update(is_used=True)

    otp_instance = OTP.objects.create(user=user)

    otp_code = otp_instance.generate_otp()
    print("OTP:", otp_code)

    send_html_email(
        "Your OTP Code",
        "emails/otp_email.html",
        {"otp": otp_code},
        user.email
    )

    return {"message": "OTP sent successfully."}


def mark_otp_used(otp_instance):
    otp_instance.is_used = True
    otp_instance.save()


def reset_password(user, otp_instance, new_password):
    user.password = make_password(new_password)
    user.save()

    otp_instance.is_used = True
    otp_instance.save()

    send_html_email(
        "Password Changed Successfully",
        "emails/password_reset_success.html",
        {"username": user.username},
        user.email
    )

    return {"message": "Password reset successful."}


def validate_otp_data(user_model, data):
    email = data.get("email")
    otp_value = data.get("otp")

    try:
        user = user_model.objects.get(email=email)
    except user_model.DoesNotExist:
        raise serializers.ValidationError("Invalid email.")

    otp_instance = OTP.objects.filter(
        user=user,
        otp=otp_value,
        is_used=False
    ).order_by("-created_at").first()

    if not otp_instance:
        raise serializers.ValidationError("Invalid OTP.")

    from django.utils import timezone

    if otp_instance.expires_at is None or timezone.now() > otp_instance.expires_at:
        raise serializers.ValidationError("OTP has expired.")

    return user, otp_instance


def get_user_for_password_reset(user_model, email):
    try:
        return user_model.objects.get(email=email)
    except user_model.DoesNotExist:
        raise serializers.ValidationError("User does not exist.")


def validate_password_reset_data(user, data):
    if data["new_password"] != data["confirm_password"]:
        raise serializers.ValidationError("Passwords do not match.")

    otp_instance = OTP.objects.filter(
        user=user,
        is_used=True
    ).order_by("-created_at").first()

    if not otp_instance:
        raise serializers.ValidationError("OTP verification required.")

    return otp_instance
