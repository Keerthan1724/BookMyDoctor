from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterAPIView,
    LoginAPIView,
    ProfileAPIView,
    UserViewSet,
    DoctorViewSet,
    AvailabilityViewSet,
    AppointmentViewSet,
    ReviewViewSet,
    SendOTPAPIView,
    VerifyOTPAPIView,
    ResetPasswordAPIView,
    CreateStripeCheckoutSessionAPIView,
    ContactAPIView,
    stripe_webhook
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("doctors", DoctorViewSet, basename="doctors")
router.register("availability", AvailabilityViewSet, basename="availability")
router.register("appointments", AppointmentViewSet, basename="appointments")
router.register("reviews", ReviewViewSet, basename="reviews")

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view()),
    path("auth/login/", LoginAPIView.as_view()),

    path("profile/", ProfileAPIView.as_view()),

    path("auth/send-otp/", SendOTPAPIView.as_view()),
    path("auth/verify-otp/", VerifyOTPAPIView.as_view()),
    path("auth/reset-password/", ResetPasswordAPIView.as_view()),

    path("payments/create-checkout/", CreateStripeCheckoutSessionAPIView.as_view()),
    path("payments/webhook/", stripe_webhook),

    path("contact/", ContactAPIView.as_view()),
]

urlpatterns += router.urls
