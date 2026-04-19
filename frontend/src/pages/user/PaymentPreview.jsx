import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { createCheckoutSession } from "../../services/paymentService";
import Avatar from "../../components/Avatar";
import {
  formatDateLong,
  formatTime12Hour,
} from "../../utils/formatters";

const PLATFORM_FEE = 100;

const PaymentPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appt = state?.appointment;

  if (!appt) {
    return (
      <MainLayout>
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No appointment data found
        </div>
      </MainLayout>
    );
  }

  const slot = appt.slot;
  const doctor = slot?.doctor;

  const consultationFee = Number(appt.fee) || 0;
  const totalAmount = consultationFee + PLATFORM_FEE;

  const handlePayment = async () => {
    try {
      const res = await createCheckoutSession(appt.id);
      const { session_id, publishable_key } = res.data;

      const stripe = window.Stripe(publishable_key);

      await stripe.redirectToCheckout({
        sessionId: session_id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-gray-800 dark:text-gray-100">
          Checkout
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

          {/* LEFT - DETAILS */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm">

            {/* Doctor */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                name={doctor?.username}
                image={doctor?.profile_image}
                alt="doctor"
                className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-200 dark:border-slate-700"
                textClassName="text-base sm:text-lg font-semibold"
              />

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {doctor?.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {doctor?.specialization}
                </p>
              </div>
            </div>

            {/* Appointment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">

              <div>
                <p className="text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium">{formatDateLong(slot?.date)}</p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium">{formatTime12Hour(slot?.start_time)}</p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Clinic</p>
                <p className="font-medium">{doctor?.clinic_name || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">City</p>
                <p className="font-medium">{doctor?.city || "N/A"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium break-words">
                  {doctor?.clinic_address || "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT - PAYMENT SUMMARY */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-sm h-fit">

            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Payment Summary
            </h3>

            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">

              <div className="flex justify-between">
                <span>Consultation Fee</span>
                <span>₹{consultationFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{PLATFORM_FEE}</span>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between font-semibold text-base text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span className="text-green-600">₹{totalAmount}</span>
              </div>

            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-5 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-md text-sm font-medium"
            >
              Pay ₹{totalAmount}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 border border-gray-300 dark:border-slate-700 py-2.5 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              Back
            </button>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentPreview;
