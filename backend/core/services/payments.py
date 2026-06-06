from django.conf import settings
from rest_framework import serializers
import stripe

from core.models import Appointment, Payment


stripe.api_key = settings.STRIPE_SECRET_KEY


def create_stripe_checkout_session(appointment):
    PLATFORM_FEE = 100

    total_amount = appointment.fee + PLATFORM_FEE

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "inr",
                "product_data": {
                    "name": f"{appointment.slot.doctor.user.username} Appointment",
                    "description": f"Includes â‚¹{PLATFORM_FEE} platform fee",
                },
                "unit_amount": int(total_amount * 100),
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url="http://localhost:5174/payment-success",
        cancel_url="http://localhost:5174/appointmenthistory",
        metadata={
            "appointment_id": appointment.id,
            "platform_fee": PLATFORM_FEE,
        }
    )

    Payment.objects.create(
        appointment=appointment,
        stripe_session_id=session.id,
        amount=appointment.fee,
        status="INITIATED"
    )

    return {
        "session_id": session.id,
        "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
    }


def construct_stripe_webhook_event(payload, sig_header):
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    return stripe.Webhook.construct_event(
        payload, sig_header, endpoint_secret
    )


def is_signature_verification_error(error):
    return isinstance(error, stripe.error.SignatureVerificationError)


def handle_checkout_completed(event):
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        session_id = session["id"]
        appointment_id = session.get("metadata", {}).get("appointment_id")

        try:
            payment = Payment.objects.get(stripe_session_id=session_id)
            payment.status = "SUCCESS"
            payment.save()

            appointment = Appointment.objects.get(id=appointment_id)
            appointment.payment_status = "PAID"
            appointment.save()

        except Exception as e:
            print("Webhook error:", e)


def validate_stripe_checkout_data(user, appointment_id):
    try:
        appointment = Appointment.objects.get(
            id=appointment_id
        )
    except Appointment.DoesNotExist:
        raise serializers.ValidationError("Invalid appointment.")

    if appointment.patient != user:
        raise serializers.ValidationError("Not your appointment.")

    if appointment.status != "APPROVED":
        raise serializers.ValidationError("Appointment not approved.")

    if appointment.payment_status == "PAID":
        raise serializers.ValidationError("Already paid.")

    return appointment
