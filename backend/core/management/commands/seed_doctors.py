import json
import os
from django.conf import settings
from django.core.management.base import BaseCommand
from core.models import User, DoctorProfile
from django.core.files import File


class Command(BaseCommand):
    help = "Seed doctors into User and DoctorProfile"

    def handle(self, *args, **kwargs):
        json_path = os.path.join(settings.BASE_DIR, "doctors.json")

        with open(json_path, "r") as file:
            doctors = json.load(file)

        created_count = 0
        updated_count = 0

        for doc in doctors:
            user, user_created = User.objects.get_or_create(
                email=doc["email"],
                defaults={
                    "username": doc["username"],
                    "role": "DOCTOR",
                    "is_active": doc["is_active"],
                }
            )
            
            if not user_created:
                # Update existing user
                user.username = doc["username"]
                user.role = "DOCTOR"
                user.is_active = doc["is_active"]
                updated_count += 1
            else:
                created_count += 1
            
            if doc.get("profile_image"):
                image_path = doc["profile_image"]

                if os.path.exists(image_path):
                    with open(image_path, "rb") as img_file:
                        user.profile_image.save(
                            os.path.basename(image_path),  # doc1m.png
                            File(img_file),
                            save=False
                        )
            
            # Extract password from email: rahul.sharma@gmail.com -> rahulsharma
            email_prefix = doc["email"].split("@")[0].replace(".", "")
            user.set_password(email_prefix)
            user.save()

            doctor_profile, profile_created = DoctorProfile.objects.get_or_create(
                user=user,
                defaults={
                    "experience": doc["experience"],
                    "specialization": doc["specialization"],
                    "qualification": doc["qualification"],
                    "about": doc["about"],
                    "consultation_fee": doc["consultation_fee"],
                    "clinic_name": doc["clinic_name"],
                    "clinic_address": doc["clinic_address"],
                    "city": doc["city"],
                    "contact_no": doc["contact_no"],
                    "is_active": doc["is_active"],
                }
            )
            
            if not profile_created:
                # Update existing doctor profile
                doctor_profile.experience = doc["experience"]
                doctor_profile.specialization = doc["specialization"]
                doctor_profile.qualification = doc["qualification"]
                doctor_profile.about = doc["about"]
                doctor_profile.consultation_fee = doc["consultation_fee"]
                doctor_profile.clinic_name = doc["clinic_name"]
                doctor_profile.clinic_address = doc["clinic_address"]
                doctor_profile.city = doc["city"]
                doctor_profile.contact_no = doc["contact_no"]
                doctor_profile.is_active = doc["is_active"]
                doctor_profile.save()

        self.stdout.write(self.style.SUCCESS(f"✅ {created_count} doctors created, {updated_count} doctors updated"))