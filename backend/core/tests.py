from django.test import TestCase
from unittest.mock import patch
from django.utils import timezone
from datetime import timedelta, time

from core.models import User, DoctorProfile, Availability, Appointment, OTP
from core.services.users import create_registered_user
from core.services.doctors import create_doctor_profile, get_seed_reviews, get_average_rating
from core.services.otp import send_otp
from core.services.appointments import (
	validate_appointment_slot,
	create_appointment,
)


class CoreServicesTestCase(TestCase):
	def test_create_registered_user(self):
		data = {"username": "u1", "email": "u1@example.com", "password": "pass123"}

		user = create_registered_user(data)

		self.assertIsInstance(user, User)
		self.assertEqual(user.email, "u1@example.com")
		self.assertTrue(user.check_password("pass123"))

	@patch("utils.email_service.send_html_email")
	def test_create_doctor_profile(self, mock_send_email):
		validated = {
			"username": "doc1",
			"email": "doc1@example.com",
			"password": "docpass",
			"experience": 5,
			"specialization": "Cardiology",
			"qualification": "MBBS",
			"about": "Experienced",
			"consultation_fee": "200.00",
			"clinic_name": "Health Clinic",
			"clinic_address": "123 Street",
			"city": "Metro",
			"contact_no": "9999999999",
		}

		doctor = create_doctor_profile(validated)

		self.assertIsInstance(doctor, DoctorProfile)
		self.assertEqual(doctor.user.email, "doc1@example.com")
		self.assertEqual(doctor.specialization, "Cardiology")
		self.assertEqual(doctor.user.role, "DOCTOR")

	@patch("utils.email_service.send_html_email")
	def test_send_otp_and_expiry(self, mock_send_email):
		user = create_registered_user({"username": "u2", "email": "u2@example.com", "password": "p"})

		result = send_otp(user)

		self.assertEqual(result["message"], "OTP sent successfully.")

		otp_instance = OTP.objects.filter(user=user).order_by("-created_at").first()

		self.assertIsNotNone(otp_instance)
		self.assertEqual(len(otp_instance.otp), 6)
		self.assertFalse(otp_instance.is_used)

		# simulate expiry
		otp_instance.expires_at = timezone.now() - timedelta(minutes=2)
		otp_instance.save()

		self.assertTrue(otp_instance.is_expired())

	@patch("utils.email_service.send_html_email")
	def test_validate_availability_and_create_appointment(self, mock_send_email):
		# create doctor
		doc_validated = {
			"username": "doc2",
			"email": "doc2@example.com",
			"password": "docpass",
			"experience": 3,
			"specialization": "Dermatology",
			"qualification": "MD",
			"about": "Skin specialist",
			"consultation_fee": "150.00",
			"clinic_name": "Skin Care",
			"clinic_address": "45 Road",
			"city": "Town",
			"contact_no": "8888888888",
		}

		doctor = create_doctor_profile(doc_validated)

		# create availability for tomorrow
		slot_date = timezone.now().date() + timedelta(days=1)
		slot_time = (timezone.now() + timedelta(hours=2)).time()

		slot = Availability.objects.create(
			doctor=doctor,
			date=slot_date,
			start_time=slot_time,
			is_available=True,
		)

		# validate slot (should pass)
		validated = validate_appointment_slot({"slot": slot})
		self.assertIn("slot", validated)

		# create patient
		patient = create_registered_user({"username": "p1", "email": "p1@example.com", "password": "pw"})

		appointment = create_appointment(patient, {"slot": slot, "payment_type": "OFFLINE"})

		self.assertIsInstance(appointment, Appointment)
		# slot should be marked unavailable
		slot.refresh_from_db()
		self.assertFalse(slot.is_available)
		self.assertEqual(appointment.patient, patient)

	def test_get_average_rating_seed(self):
		# create minimal user and doctor without reviews
		user = User.objects.create_user(username="da", email="da@example.com", password="x", role="DOCTOR")
		doctor = DoctorProfile.objects.create(
			user=user,
			experience=1,
			specialization="Test",
			qualification="Q",
			about="a",
			consultation_fee="10.00",
			clinic_name="c",
			clinic_address="a",
			city="c",
			contact_no="7777777777",
		)

		seed_avg, seed_count = get_seed_reviews(doctor)
		avg = get_average_rating(doctor)

		self.assertEqual(avg, seed_avg)
