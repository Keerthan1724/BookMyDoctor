from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied
from django.core.mail import send_mail
from .serializers import (UserRegisterSerializer,
                          UserLoginSerializer, 
                          UserProfileSerializer, 
                          DoctorSerializer, 
                          DoctorCreateSerializer, 
                          AvailabilitySerializer, 
                          AppointmentSerializer, 
                          StripeCheckoutSerializer, 
                          ReviewSerializer,
                          SendOTPSerializer,
                          VerifyOTPSerializer,
                          ResetPasswordSerializer,
                          ContactSerializer
                        )
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAdmin, IsDoctor
from .models import (DoctorProfile,
                     User,
                     Availability, 
                     Appointment, 
                     Payment, 
                     Review
                    )
from django.conf import settings
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Avg, Count
from utils.email_service import send_html_email


stripe.api_key = settings.STRIPE_SECRET_KEY

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            send_html_email(
                "Welcome to BookMyDoctor",
                "emails/user_welcome.html",
                {"username": user.username},
                user.email
            )

            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "email": user.email,
            "message": "Login successful"
        }, status=status.HTTP_200_OK)

class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        if request.data.get("delete_image") == "true":
            if request.user.profile_image:
                request.user.profile_image.delete(save=False)
                request.user.profile_image = None
                request.user.save()

            serializer = UserProfileSerializer(request.user)

            return Response({
                "message": "Profile image deleted",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Profile updated successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({
            "message": "Account deleted successfully"
        }, status=status.HTTP_200_OK)

class UserViewSet(ModelViewSet):
    queryset = User.objects.filter(role="USER").order_by("-created_at")
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class DoctorViewSet(ModelViewSet):

    def get_queryset(self):
        queryset = DoctorProfile.objects.annotate(
            actual_average_rating=Avg("availabilities__appointment__review__rating"),
            actual_total_reviews=Count("availabilities__appointment__review")
        ).select_related("user")

        user = self.request.user
        user_id = self.request.query_params.get("user")

        if user.is_authenticated and user.role == "DOCTOR":
            return queryset.filter(user=user)

        if user_id:
            return queryset.filter(user__id=user_id)

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return DoctorCreateSerializer
        return DoctorSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAdmin()]

        if self.action in ["update", "partial_update"]:
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_update(self, serializer):
        doctor = self.get_object()
        user = self.request.user

        if user.role == "ADMIN":
            serializer.save()
            return

        if user.role == "DOCTOR" and doctor.user == user:
            serializer.save()
            return

        raise PermissionDenied("You cannot update this profile")
        
class AvailabilityViewSet(ModelViewSet):
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        doctor_id = self.request.query_params.get("doctor")

        if doctor_id:
            return Availability.objects.filter(
                doctor_id=doctor_id,
                is_available=True,
                is_held=False,
            ).order_by("date", "start_time")
        
        if self.request.user.is_authenticated and self.request.user.role == "DOCTOR":
            return Availability.objects.filter(
                doctor__user=self.request.user
            ).order_by("date", "start_time")
        return Availability.objects.none()
    
    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsDoctor()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        doctor_profile = self.request.user.doctor_profile
        serializer.save(doctor=doctor_profile)

    def perform_update(self, serializer):
        if serializer.instance.doctor.user != self.request.user:
            raise PermissionDenied("You cannot edit this slot")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.doctor.user != self.request.user:
            raise PermissionDenied("You cannot delete this slot")
        instance.delete()

class AppointmentViewSet(ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get_queryset(self):
        user = self.request.user

        queryset = Appointment.objects.select_related(
            "slot",
            "slot__doctor",
            "slot__doctor__user"
        )

        if user.role == "USER":
            return queryset.filter(patient=user)

        if user.role == "DOCTOR":
            return queryset.filter(
                slot__doctor__user=user
            )

        if user.role == "ADMIN":
            return queryset

        return Appointment.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role != "USER":
            raise PermissionDenied("Only users can book appointments")

        serializer.save(
            patient=self.request.user,
            status="PENDING"
        )

    def perform_update(self, serializer):
        appointment = serializer.instance
        user = self.request.user

        if user.role == "DOCTOR":
            if appointment.slot.doctor.user != user:
                raise PermissionDenied("Not your appointment")

            updated = serializer.save()

            if serializer.validated_data.get("status") == "REJECTED":
                appointment.slot.is_available = True
                appointment.slot.save()

            return updated

        if user.role == "USER":
            raise PermissionDenied("Users cannot modify appointment")

        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user

        if user.role == "USER" and instance.patient == user:
            instance.status = "CANCELLED"
            instance.save()

            slot = instance.slot
            slot.is_available = True
            slot.save()
            return

        raise PermissionDenied("Not allowed to cancel appointment")
    
class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "USER":
            return Review.objects.filter(appointment__patient=user)

        elif user.role == "DOCTOR":
            return Review.objects.filter(
                appointment__slot__doctor__user=user
            )

        elif user.role == "ADMIN":
            return Review.objects.all()

        return Review.objects.none()
    
    def perform_create(self, serializer):
        review = serializer.save()

        appointment = review.appointment
        appointment.is_rated = True
        appointment.save()

class SendOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            data = serializer.save()
            return Response(data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VerifyOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            otp_instance = serializer.context["otp_instance"]

            otp_instance.is_used = True
            otp_instance.save()

            return Response(
                {"message": "OTP verified successfully."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            result = serializer.save()
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateStripeCheckoutSessionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StripeCheckoutSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        appointment = serializer.validated_data["appointment"]

        try:
            PLATFORM_FEE = 100

            total_amount = appointment.fee + PLATFORM_FEE

            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": f"{appointment.slot.doctor.user.username} Appointment",
                            "description": f"Includes ₹{PLATFORM_FEE} platform fee",
                        },
                        "unit_amount": int(total_amount * 100),
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url="http://localhost:5173/payment-success",
                cancel_url="http://localhost:5173/appointmenthistory",
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

            return Response({
                "session_id": session.id,
                "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class ContactAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
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

            return Response(
                {"message": "Message sent successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)
    
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

    return HttpResponse(status=200)
