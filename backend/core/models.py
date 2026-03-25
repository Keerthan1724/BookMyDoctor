from django.db import models
from django.contrib.auth.models import AbstractUser
import random
from django.utils import timezone
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("DOCTOR", "Doctor"),
        ("USER", "User"),
    )

    GENDER_CHOICES = (
        ("MALE", "Male"),
        ("FEMALE", "Female"), 
        ("OTHER", "Other")
    )

    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="USER")
    phone = models.CharField(max_length=10, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
    
class DoctorProfile(models.Model):
    user = models.OneToOneField(
        "User",
        on_delete=models.CASCADE,
        related_name="doctor_profile"
    )

    experience = models.PositiveIntegerField()
    specialization = models.CharField(max_length=200)
    qualification = models.CharField(max_length=200)
    about = models.TextField()
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)

    clinic_name = models.CharField(max_length=200)
    clinic_address = models.TextField()
    city = models.CharField(max_length=100)
    contact_no  = models.CharField(max_length=10)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.specialization}"
    
class Availability(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name="availabilities"
    )

    date = models.DateField()
    start_time = models.TimeField()

    is_available = models.BooleanField(default=True)

    is_held = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("doctor", "date", "start_time")

    def __str__(self):
        return f"{self.doctor.user.email} - {self.date} {self.start_time}"
        
class Appointment(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    )

    PAYMENT_TYPE_CHOICES = (
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
    )

    PAYMENT_STATUS_CHOICES = (
        ("UNPAID", "Unpaid"),
        ("PAID", "Paid"),
    )

    patient = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    slot = models.OneToOneField(
        Availability,
        on_delete=models.CASCADE,
        related_name="appointment"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE_CHOICES)

    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default="UNPAID")

    fee = models.DecimalField(max_digits=10, decimal_places=2)

    description = models.TextField()

    is_rated = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.email} - {self.slot.doctor.user.email} - {self.slot.date}"

class Review(models.Model):
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="review"
    )

    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    review_text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.appointment.patient.email} - {self.rating}"
    
class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="email_otps")

    otp = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def generate_otp(self):
        code = str(random.randint(100000, 999999))
        self.otp = code
        self.expires_at = timezone.now() + timedelta(minutes=1)
        self.save()
        return code

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.otp}"
    
class Payment(models.Model):
    STATUS_CHOICES = (
        ("INITIATED", "Initiated"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    stripe_session_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="INITIATED"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.appointment.patient.email} - {self.status}"