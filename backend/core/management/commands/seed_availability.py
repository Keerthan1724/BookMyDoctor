import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from core.models import User, Availability


class Command(BaseCommand):
    help = "Generate random availability slots for all doctors between May 1-10, 2026"

    def handle(self, *args, **kwargs):
        start_date = datetime(2026, 5, 1).date()
        end_date = datetime(2026, 5, 10).date()

        start_times = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

        doctors = User.objects.filter(role="DOCTOR")

        created_count = 0
        skipped_count = 0

        for doctor in doctors:
            if not hasattr(doctor, "doctor_profile"):
                continue

            doctor_profile = doctor.doctor_profile

            for i in range(15):
                offset = random.randint(0, 9)
                slot_date = start_date + timedelta(days=offset)

                slot_time = random.choice(start_times)
                hour, minute = map(int, slot_time.split(":"))

                existing = Availability.objects.filter(
                    doctor=doctor_profile,
                    date=slot_date,
                    start_time=f"{hour:02d}:{minute:02d}:00",
                ).exists()

                if existing:
                    skipped_count += 1
                    continue

                Availability.objects.create(
                    doctor=doctor_profile,
                    date=slot_date,
                    start_time=f"{hour:02d}:{minute:02d}:00",
                    is_available=True,
                    is_held=False,
                )
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Created {created_count} availability slots"))
        self.stdout.write(self.style.WARNING(f"⏭️  Skipped {skipped_count} duplicate slots"))
