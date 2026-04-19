import MainLayout from "../../layouts/MainLayout";
import { FaShieldAlt } from "react-icons/fa";

function PrivacyPolicy() {
  const sections = [
    { title: "Information We Collect", desc: "We collect basic details such as name, email, phone number, age and appointment information." },
    { title: "How We Use Your Data", desc: "Your data is used to manage bookings, improve user experience and provide better services." },
    { title: "Data Sharing", desc: "We do not sell your data. Information is only shared with doctors for appointment purposes." },
    { title: "Data Security", desc: "We use secure systems to protect your data from unauthorized access." },
    { title: "Your Rights", desc: "You can update or delete your account anytime from your profile settings." }
  ];

  return (
    <MainLayout>
      <div className="bg-bgLight dark:bg-bgDark min-h-screen py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4">

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-800 dark:text-white">
            Privacy Policy
          </h1>

          <div className="space-y-4 sm:space-y-6">
            {sections.map((item, index) => (
              <div
                key={index}
                className="bg-cardLight dark:bg-cardDark p-4 sm:p-6 rounded-xl border border-borderLight dark:border-borderDark"
              >
                <div className="flex gap-3">
                  <FaShieldAlt className="text-primary mt-1" />
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

export default PrivacyPolicy;