import json
import os
from django.conf import settings
from django.core.management.base import BaseCommand
from core.models import User, Availability, Appointment, Review


class Command(BaseCommand):
    help = "Seed demo users, availability slots, appointments, and reviews"

    def handle(self, *args, **kwargs):
        json_path = os.path.join(settings.BASE_DIR, "demo_data.json")

        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        created_users = 0
        updated_users = 0
        created_availabilities = 0
        created_appointments = 0
        created_reviews = 0

        for user_data in data.get("users", []):
            user, user_created = User.objects.get_or_create(
                email=user_data["email"],
                defaults={
                    "username": user_data["username"],
                    "role": "USER",
                    "phone": user_data.get("phone") or None,
                    "age": user_data.get("age"),
                    "address": user_data.get("address") or None,
                    "gender": user_data.get("gender") or None,
                    "is_active": user_data.get("is_active", True),
                }
            )
            
            if not user_created:
                # Update existing user
                user.username = user_data["username"]
                user.role = "USER"
                user.phone = user_data.get("phone") or None
                user.age = user_data.get("age")
                user.address = user_data.get("address") or None
                user.gender = user_data.get("gender") or None
                user.is_active = user_data.get("is_active", True)
                updated_users += 1
            else:
                created_users += 1
            
            user.set_password(user_data.get("password", "user123"))

            profile_image = user_data.get("profile_image")
            if profile_image:
                user.profile_image = profile_image

            user.save()

        for availability_data in data.get("availabilities", []):
            doctor_email = availability_data.get("doctor_email")
            doctor = User.objects.filter(email=doctor_email, role="DOCTOR").first()
            if not doctor or not hasattr(doctor, "doctor_profile"):
                self.stdout.write(self.style.WARNING(f"Doctor not found: {doctor_email}"))
                continue

            availability, created = Availability.objects.get_or_create(
                doctor=doctor.doctor_profile,
                date=availability_data["date"],
                start_time=availability_data["start_time"],
                defaults={
                    "is_available": availability_data.get("is_available", True),
                    "is_held": availability_data.get("is_held", False),
                },
            )
            if created:
                created_availabilities += 1

        for appointment_data in data.get("appointments", []):
            patient = User.objects.filter(email=appointment_data["patient_email"], role="USER").first()
            doctor = User.objects.filter(email=appointment_data["doctor_email"], role="DOCTOR").first()
            if not patient or not doctor or not hasattr(doctor, "doctor_profile"):
                self.stdout.write(
                    self.style.WARNING(
                        f"Missing patient or doctor for appointment: {appointment_data.get('patient_email')} / {appointment_data.get('doctor_email')}"
                    )
                )
                continue

            slot = Availability.objects.filter(
                doctor=doctor.doctor_profile,
                date=appointment_data["date"],
                start_time=appointment_data["start_time"],
            ).first()
            if not slot:
                self.stdout.write(
                    self.style.WARNING(
                        f"Missing availability slot for appointment: {doctor.email} {appointment_data['date']} {appointment_data['start_time']}"
                    )
                )
                continue

            if Appointment.objects.filter(slot=slot).exists():
                continue

            appointment = Appointment.objects.create(
                patient=patient,
                slot=slot,
                status=appointment_data.get("status", "PENDING"),
                payment_type=appointment_data.get("payment_type", "OFFLINE"),
                payment_status=appointment_data.get("payment_status", "UNPAID"),
                fee=appointment_data.get("fee", 0),
                description=appointment_data.get("description", ""),
                is_rated=appointment_data.get("is_rated", False),
            )
            created_appointments += 1

            review_data = appointment_data.get("review")
            if review_data and appointment.is_rated:
                Review.objects.create(
                    appointment=appointment,
                    rating=review_data.get("rating", 5),
                    review_text=review_data.get("review_text", ""),
                )
                created_reviews += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Created {created_users} users, updated {updated_users} users"))
        self.stdout.write(self.style.SUCCESS(f"✅ Created {created_availabilities} availabilities"))
        self.stdout.write(self.style.SUCCESS(f"✅ Created {created_appointments} appointments"))
        self.stdout.write(self.style.SUCCESS(f"✅ Created {created_reviews} reviews"))
