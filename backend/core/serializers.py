from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password
from django.db import transaction
from .models import (User, 
                     DoctorProfile, 
                     Availability, 
                     Appointment, 
                     Review, 
                     OTP,
                    )


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role="USER"
        )
        return user
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
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
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "phone",
            "age",
            "address",
            "gender",
            "profile_image",
            "created_at",
        ]
        read_only_fields = ["email", "role", "created_at"]

    def validate_age(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Age must be greater than 0")
        return value
    
    def validate_phone(self, value):
        if value:
            if not value.isdigit():
                raise serializers.ValidationError("Phone number must contain only digits")
            if len(value) != 10:
                raise serializers.ValidationError("Phone number must be exactly 10 digits")
        return value
    
    def update(self, instance, validated_data):
        new_image = validated_data.get("profile_image")

        if new_image and instance.profile_image:
            instance.profile_image.delete(save=False)

        return super().update(instance, validated_data)
    
class DoctorCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    profile_image = serializers.ImageField(required=False)
    contact_no = serializers.CharField(max_length=10)

    class Meta:
        model = DoctorProfile
        fields = [
            "username",
            "email",
            "password",
            "profile_image",
            "experience",
            "specialization",
            "qualification",
            "about",
            "consultation_fee",
            "clinic_name",
            "clinic_address",
            "city",
            "contact_no",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate_contact_no(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Enter valid 10-digit phone number")
        return value

    def create(self, validated_data):
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        profile_image = validated_data.pop("profile_image", None)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role="DOCTOR",
            profile_image=profile_image
        )

        doctor_profile = DoctorProfile.objects.create(
            user=user,
            is_active=True,  
            **validated_data
        )

        return doctor_profile
    
class DoctorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    profile_image = serializers.ImageField(source="user.profile_image", read_only=True)

    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            "id",
            "username",
            "email",
            "profile_image",
            "experience",
            "specialization",
            "qualification",
            "about",
            "consultation_fee",
            "clinic_name",
            "clinic_address",
            "city",
            "contact_no",
            "is_active",
            "average_rating",
            "total_reviews",
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        request = self.context.get("request")
        if request and request.FILES.get("profile_image"):
            instance.user.profile_image = request.FILES.get("profile_image")
            instance.user.save()

        return instance

class AvailabilitySerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Availability
        fields = [
            "id",
            "doctor",
            "date",
            "start_time",
            "is_available",
            "is_held",
        ]
        read_only_fields = ["doctor"]

    def validate(self, data):
        request = self.context.get("request")
        doctor = request.user.doctor_profile

        if self.instance:
            date = data.get("date", self.instance.date)
            start = data.get("start_time", self.instance.start_time)
        else:
            date = data.get("date")
            start = data.get("start_time")

        if "date" not in data and "start_time" not in data:
            return data

        if date < timezone.now().date():
            raise serializers.ValidationError("Cannot set availability in the past.")

        if date == timezone.now().date():
            if start <= timezone.now().time():
                raise serializers.ValidationError("Cannot set past time.")

        if not self.instance:
            if Availability.objects.filter(
                doctor=doctor,
                date=date,
                start_time=start
            ).exists():
                raise serializers.ValidationError("This time slot already exists.")

        slots = Availability.objects.filter(
            doctor=doctor,
            date=date
        ).exclude(id=self.instance.id if self.instance else None)

        for s in slots:
            diff = abs(
                datetime.combine(date, s.start_time)
                - datetime.combine(date, start)
            )

            if diff < timedelta(minutes=30):
                raise serializers.ValidationError(
                    "Minimum 30 minutes gap required between slots."
                )

        return data

    def create(self, validated_data):
        validated_data["doctor"] = self.context["request"].user.doctor_profile
        return super().create(validated_data)
    
class AppointmentSerializer(serializers.ModelSerializer):
    slot = AvailabilitySerializer(read_only=True)
    patient = UserProfileSerializer(read_only=True)

    rating = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "slot",
            "status",
            "payment_type",
            "payment_status",
            "fee",
            "description",
            "is_rated",
            "rating",
            "created_at",
        ]
        read_only_fields = [
            "patient",
            "payment_status",
            "fee",
            "is_rated",
            "created_at",
        ]

    def validate(self, data):
        slot = data.get("slot")

        if not slot:
            return data

        if not slot.is_available:
            raise serializers.ValidationError("This slot is not available.")

        if slot.date < timezone.now().date():
            raise serializers.ValidationError("Cannot book past date.")

        if slot.date == timezone.now().date() and slot.start_time <= timezone.now().time():
            raise serializers.ValidationError("Cannot book past time.")

        if not slot.doctor.is_active:
            raise serializers.ValidationError("Doctor is currently inactive.")

        return data
    
    def get_rating(self, obj):
        review = Review.objects.filter(appointment=obj).first()
        return review.rating if review else None

    def create(self, validated_data):
        user = self.context["request"].user
        slot = validated_data["slot"]

        with transaction.atomic():
            # lock the slot
            slot = Availability.objects.select_for_update().get(id=slot.id)

            if not slot.is_available:
                raise serializers.ValidationError("Slot already booked")

            appointment = Appointment.objects.create(
                patient=user,
                slot=slot,
                payment_type=validated_data["payment_type"],
                description=validated_data.get("description", ""),
                fee=slot.doctor.consultation_fee,
                status="PENDING",
                payment_status="UNPAID",
            )

            slot.is_available = False
            slot.save()

        return appointment

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "appointment",
            "rating",
            "review_text",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def validate_review_text(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Review text cannot be empty.")
        return value.strip()

    def validate(self, data):
        request = self.context["request"]
        user = request.user
        appointment = data.get("appointment")

        if appointment.is_rated:
            raise serializers.ValidationError("Already reviewed.")

        if appointment.patient != user:
            raise serializers.ValidationError("You cannot review this appointment.")
        
        if appointment.status != "COMPLETED":
            raise serializers.ValidationError("You can review only after appointment is completed.")
        
        rating = data.get("rating")
        if rating < 1 or rating > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return data
    
class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        self.context["user"] = user
        return value

    def create(self, validated_data):
        user = self.context["user"]

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

        return {"message": "OTP sent successfully."}
    
class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get("email")
        otp_value = data.get("otp")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")

        otp_instance = OTP.objects.filter(
            user=user,
            otp=otp_value,
            is_used=False
        ).order_by("-created_at").first()

        if not otp_instance:
            raise serializers.ValidationError("Invalid OTP.")

        if otp_instance.expires_at is None or timezone.now() > otp_instance.expires_at:
            raise serializers.ValidationError("OTP has expired.")

        self.context["otp_instance"] = otp_instance
        self.context["user"] = user

        return data

    def create(self, validated_data):
        otp_instance = self.context["otp_instance"]

        otp_instance.is_used = True
        otp_instance.save()

        return {"message": "OTP verified successfully."}

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        
        self.context["user"] = user
        return value
    
    def validate(self, data):
        user = self.context["user"]

        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        
        otp_instance = OTP.objects.filter(
            user=user,
            is_used=True
        ).order_by("-created_at").first()

        if not otp_instance:
            raise serializers.ValidationError("OTP verification required.")

        self.context["otp_instance"] = otp_instance

        return data

    def validate_new_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters.")
        return value

    def save(self):
        user = self.context["user"]
        otp_instance = self.context["otp_instance"]

        new_password = self.validated_data["new_password"]

        user.password = make_password(new_password)
        user.save()

        otp_instance.is_used = True
        otp_instance.save()

        return {"message": "Password reset successful."}

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField()

    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters")
        return value

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message too short")
        return value
    
class StripeCheckoutSerializer(serializers.Serializer):
    appointment_id = serializers.IntegerField()

    def validate(self, data):
        user = self.context["request"].user

        try:
            appointment = Appointment.objects.get(
                id=data["appointment_id"]
            )
        except Appointment.DoesNotExist:
            raise serializers.ValidationError("Invalid appointment.")
        
        if appointment.patient != user:
            raise serializers.ValidationError("Not your appointment.")
        
        if appointment.status != "APPROVED":
            raise serializers.ValidationError("Appointment not approved.")
        
        if appointment.payment_status == "PAID":
            raise serializers.ValidationError("Already paid.")
        
        data["appointment"] = appointment
        return data