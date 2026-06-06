import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { toast } from "../../components/CustomToast";
import { contactInfo, contactFormFields } from "../../data/publicData";
import { sendContactMessage } from "../../services/contactService";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return toast("Name is required", "error");
    if (!form.email.trim()) return toast("Email is required", "error");
    if (!form.message.trim()) return toast("Message is required", "error");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await sendContactMessage(form);
      toast("Message sent successfully", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        const firstError = Object.values(err.response.data)[0][0];
        toast(firstError, "error");
      } else {
        toast("Something went wrong", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="text-center mb-8 sm:mb-12">
          <p className="mt-3 text-sm sm:text-base text-textLight dark:text-textDark">
            Have questions or need help? Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 bg-cardLight dark:bg-cardDark p-5 sm:p-8 rounded-xl shadow-lg">
          {/* LEFT */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
              Get in Touch
            </h2>

            <p className="text-sm sm:text-base text-textLight dark:text-textDark">
              We’re here to help you with booking appointments, finding the
              right doctors, and resolving any issues.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    {Icon && (
                      <Icon className="text-primary text-lg sm:text-xl mt-1" />
                    )}
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">
                        {item.title}
                      </p>
                      <p
                        className={`text-xs sm:text-sm ${
                          item.isPrimary
                            ? "text-primary"
                            : "text-textLight dark:text-textDark"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            {contactFormFields.map((field) => (
              <div key={field.name}>
                <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    rows="5"
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 dark:border-gray-700 p-2 sm:p-3 rounded-lg bg-transparent resize-none text-sm sm:text-base"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 dark:border-gray-700 p-2 sm:p-3 rounded-lg bg-transparent text-sm sm:text-base"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-2 sm:py-3 rounded-lg mt-2 text-sm sm:text-base"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
