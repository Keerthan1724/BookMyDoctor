from utils.email_service import send_html_email
from rest_framework import serializers


def validate_contact_name(value):
    if len(value.strip()) < 3:
        raise serializers.ValidationError("Name must be at least 3 characters")
    return value


def validate_contact_message(value):
    if len(value.strip()) < 10:
        raise serializers.ValidationError("Message too short")
    return value


def send_contact_messages(data):
    send_html_email(
        "New Contact Message",
        "emails/contact_admin.html",
        data,
        "bookmydoctor.app2026@gmail.com"
    )

    send_html_email(
        subject="We received your message - BookMyDoctor",
        template="emails/contact_user_reply.html",
        context={
            "name": data["name"],
            "message": data["message"],
        },
        to_email=data["email"],
    )
