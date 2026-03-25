import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from dotenv import load_dotenv

load_dotenv()

User = get_user_model()

class Command(BaseCommand):
    help = "Create or update admin user from env"

    def handle(self, *args, **kwargs):
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")
        username = os.getenv("ADMIN_USERNAME", "admin")

        if not email or not password:
            self.stdout.write(self.style.ERROR("Missing ADMIN_EMAIL or ADMIN_PASSWORD"))
            return

        user, created = User.objects.get_or_create(email=email)

        user.username = username
        user.role = "ADMIN"
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS("Admin created successfully"))
        else:
            self.stdout.write(self.style.SUCCESS("Admin updated successfully"))