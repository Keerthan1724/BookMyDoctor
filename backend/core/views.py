from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .serializers import (
    AppointmentSerializer, AvailabilitySerializer, ContactSerializer,
    DoctorCreateSerializer, DoctorSerializer, ResetPasswordSerializer,
    ReviewSerializer, SendOTPSerializer, StripeCheckoutSerializer,
    UserLoginSerializer, UserProfileSerializer, UserRegisterSerializer,
    VerifyOTPSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAdmin, IsDoctor
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .services.appointments import (
    cancel_appointment_for_user,
    ensure_appointment_create_allowed,
    get_appointment_queryset,
    update_appointment_for_user,
)
from .services.availability import (
    create_availability_for_user,
    delete_availability_for_user,
    get_availability_queryset,
    update_availability_for_user,
)
from .services.contact import send_contact_messages
from .services.doctors import ensure_doctor_update_allowed, get_doctor_queryset
from .services.payments import (
    construct_stripe_webhook_event,
    create_stripe_checkout_session,
    handle_checkout_completed,
    is_signature_verification_error,
)
from .services.reviews import create_review, get_review_queryset
from .services.users import (
    delete_profile_image,
    delete_user_account,
    get_user_queryset,
    send_user_welcome_email,
)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            send_user_welcome_email(user)

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
            delete_profile_image(request.user)

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
        delete_user_account(request.user)
        return Response({
            "message": "Account deleted successfully"
        }, status=status.HTTP_200_OK)


class UserViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return get_user_queryset()


class DoctorViewSet(ModelViewSet):

    def get_queryset(self):
        return get_doctor_queryset(
            self.request.user,
            self.request.query_params.get("user")
        )

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
        ensure_doctor_update_allowed(doctor, user)
        serializer.save()


class AvailabilityViewSet(ModelViewSet):
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        return get_availability_queryset(
            self.request.user,
            self.request.query_params.get("doctor")
        )

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsDoctor()]
        return [AllowAny()]

    def perform_create(self, serializer):
        create_availability_for_user(serializer, self.request.user)

    def perform_update(self, serializer):
        update_availability_for_user(serializer, self.request.user)

    def perform_destroy(self, instance):
        delete_availability_for_user(instance, self.request.user)


class AppointmentViewSet(ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get_queryset(self):
        return get_appointment_queryset(self.request.user)

    def perform_create(self, serializer):
        ensure_appointment_create_allowed(self.request.user)
        serializer.save(
            patient=self.request.user,
            status="PENDING"
        )

    def perform_update(self, serializer):
        return update_appointment_for_user(
            serializer.instance,
            self.request.user,
            serializer
        )

    def perform_destroy(self, instance):
        cancel_appointment_for_user(instance, self.request.user)


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_review_queryset(self.request.user)

    def perform_create(self, serializer):
        create_review(serializer)


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
            serializer.save()
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
            data = create_stripe_checkout_session(appointment)
            return Response(data, status=status.HTTP_200_OK)

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
            send_contact_messages(data)

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

    try:
        event = construct_stripe_webhook_event(payload, sig_header)
    except Exception as e:
        if not is_signature_verification_error(e):
            raise
        return HttpResponse(status=400)

    handle_checkout_completed(event)

    return HttpResponse(status=200)
