import MainLayout from "../../layouts/MainLayout";
import { FaQuestionCircle } from "react-icons/fa";

function FAQs() {
  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Browse doctors, select a doctor, choose available time, fill details and confirm booking."
    },
    {
      q: "Do I need to pay before booking?",
      a: "You can choose offline or online payment. Online payment is enabled after doctor approval."
    },
    {
      q: "Can I cancel my appointment?",
      a: "Yes, you can cancel an appointment before the scheduled time from your appointments page."
    },
    {
      q: "When can I make online payment?",
      a: "Online payment is available only after doctor approves your appointment."
    },
    {
      q: "Can I rate a doctor?",
      a: "Yes, rating is allowed only after completing the appointment."
    }
  ];

  return (
    <MainLayout>
      <div className="bg-bgLight dark:bg-bgDark min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4">

          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h1>

          <div className="space-y-6">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="bg-cardLight dark:bg-cardDark p-6 rounded-xl border border-borderLight dark:border-borderDark hover:shadow-md transition"
              >
                <div className="flex gap-3">
                  <FaQuestionCircle className="text-primary mt-1" />
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white">
                      {item.q}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {item.a}
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

export default FAQs;