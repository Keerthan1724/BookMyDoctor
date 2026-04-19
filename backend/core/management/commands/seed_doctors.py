import json
import os
from django.conf import settings
from django.core.management.base import BaseCommand
from core.models import User, DoctorProfile


class Command(BaseCommand):
    help = "Seed doctors into User and DoctorProfile"

    def handle(self, *args, **kwargs):
        json_path = os.path.join(settings.BASE_DIR, "doctors.json")

        with open(json_path, "r") as file:
            doctors = json.load(file)

        created_count = 0

        for doc in doctors:
            if User.objects.filter(email=doc["email"]).exists():
                continue

            user = User.objects.create(
                email=doc["email"],
                username=doc["username"],
                role="DOCTOR",
                is_active=doc["is_active"],
            )
            user.set_password("doctor123")
            user.save()

            DoctorProfile.objects.create(
                user=user,
                experience=doc["experience"],
                specialization=doc["specialization"],
                qualification=doc["qualification"],
                about=doc["about"],
                consultation_fee=doc["consultation_fee"],
                clinic_name=doc["clinic_name"],
                clinic_address=doc["clinic_address"],
                city=doc["city"],
                contact_no=doc["contact_no"],
                is_active=doc["is_active"],
            )

            created_count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {created_count} doctors seeded"))