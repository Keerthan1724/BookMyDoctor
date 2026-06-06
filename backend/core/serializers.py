from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import (User, 
                     DoctorProfile, 
                     Availability, 
                     Appointment, 
                     Review,
                    )
from .services.appointments import (
    create_appointment,
    get_appointment_rating,
    validate_appointment_slot,
)
from .services.availability import validate_availability_data
from .services.contact import validate_contact_message, validate_contact_name
from .services.doctors import (
    create_doctor_profile,
    get_average_rating,
    get_total_reviews,
    update_doctor_profile,
)
from .services.otp import (
    get_user_for_otp_email,
    get_user_for_password_reset,
    mark_otp_used,
    reset_password,
    send_otp,
    validate_otp_data,
    validate_password_reset_data,
)
from .services.payments import validate_stripe_checkout_data
from .services.reviews import validate_review_data, validate_review_text
from .services.users import (
    authenticate_login,
    create_registered_user,
    update_user_profile,
    validate_age,
    validate_phone,
    validate_unique_email,
)


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        return validate_unique_email(value)
    
    def create(self, validated_data):
        return create_registered_user(validated_data)
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        return authenticate_login(authenticate, data)
    
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
            "updated_at",
        ]
        read_only_fields = ["email", "role", "created_at", "updated_at"]

    def validate_age(self, value):
        return validate_age(value)
    
    def validate_phone(self, value):
        return validate_phone(value)
    
    def update(self, instance, validated_data):
        return update_user_profile(instance, validated_data)
    
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
        return validate_unique_email(value)

    def validate_contact_no(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Enter valid 10-digit phone number")
        return value

    def create(self, validated_data):
        return create_doctor_profile(validated_data)
    
class DoctorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    profile_image = serializers.ImageField(source="user.profile_image", read_only=True)
    created_at = serializers.DateTimeField(source="user.created_at", read_only=True)
    updated_at = serializers.DateTimeField(source="user.updated_at", read_only=True)

    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = [
            "id",
            "username",
            "email",
            "profile_image",
            "created_at",
            "updated_at",
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

    def get_average_rating(self, obj):
        return get_average_rating(obj)

    def get_total_reviews(self, obj):
        return get_total_reviews(obj)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        return update_doctor_profile(instance, validated_data, request)

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
        return validate_availability_data(self.instance, data, doctor)

    def create(self, validated_data):
        validated_data["doctor"] = self.context["request"].user.doctor_profile
        return super().create(validated_data)


class AppointmentSlotSerializer(serializers.ModelSerializer):
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
    
class AppointmentSerializer(serializers.ModelSerializer):
    slot = serializers.PrimaryKeyRelatedField(
        queryset=Availability.objects.all()
    )
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
        return validate_appointment_slot(data)
    
    def get_rating(self, obj):
        return get_appointment_rating(obj)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["slot"] = AppointmentSlotSerializer(instance.slot).data
        return data

    def create(self, validated_data):
        user = self.context["request"].user
        return create_appointment(user, validated_data)

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
        return validate_review_text(value)

    def validate(self, data):
        request = self.context["request"]
        user = request.user
        return validate_review_data(data, user)
    
class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        user = get_user_for_otp_email(User, value)
        self.context["user"] = user
        return value

    def create(self, validated_data):
        user = self.context["user"]
        return send_otp(user)
    
class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        user, otp_instance = validate_otp_data(User, data)
        self.context["otp_instance"] = otp_instance
        self.context["user"] = user
        return data

    def create(self, validated_data):
        otp_instance = self.context["otp_instance"]
        mark_otp_used(otp_instance)

        return {"message": "OTP verified successfully."}

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        user = get_user_for_password_reset(User, value)
        self.context["user"] = user
        return value
    
    def validate(self, data):
        user = self.context["user"]
        otp_instance = validate_password_reset_data(user, data)
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
        return reset_password(user, otp_instance, new_password)

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField()

    def validate_name(self, value):
        return validate_contact_name(value)

    def validate_message(self, value):
        return validate_contact_message(value)
    
class StripeCheckoutSerializer(serializers.Serializer):
    appointment_id = serializers.IntegerField()

    def validate(self, data):
        user = self.context["request"].user
        appointment = validate_stripe_checkout_data(user, data["appointment_id"])
        data["appointment"] = appointment
        return data
