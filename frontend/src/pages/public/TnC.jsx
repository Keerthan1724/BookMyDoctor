import MainLayout from "../../layouts/MainLayout";
import { FaFileContract } from "react-icons/fa";

function TnC() {
  const terms = [
    { title: "User Responsibility", desc: "Users must provide accurate details while booking appointments." },
    { title: "Appointment Approval", desc: "All appointments are subject to doctor approval and not guaranteed instantly." },
    { title: "Payments", desc: "Online payments are processed securely via Stripe or Razorpay." },
    { title: "Cancellation", desc: "Appointments can be cancelled before scheduled time. Refund depends on payment method." },
    { title: "Limitation of Liability", desc: "BookMyDoctor is not responsible for medical advice provided by doctors." }
  ];

  return (
    <MainLayout>
      <div className="bg-bgLight dark:bg-bgDark min-h-screen py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4">

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-800 dark:text-white">
            Terms & Conditions
          </h1>

          <div className="space-y-4 sm:space-y-6">
            {terms.map((item, index) => (
              <div
                key={index}
                className="bg-cardLight dark:bg-cardDark p-4 sm:p-6 rounded-xl border border-borderLight dark:border-borderDark"
              >
                <div className="flex gap-3">
                  <FaFileContract className="text-primary mt-1" />
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default TnC;