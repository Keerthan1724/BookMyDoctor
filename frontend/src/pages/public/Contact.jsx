import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { toast } from "../../components/CustomToast";
import { contactInfo, formFields } from "../../data/contactData";
import axios from "axios";

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
      await axios.post("/api/contact/", form);
      toast("Message sent successfully", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast("Failed to send message", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <p className="mt-4 text-textLight dark:text-textDark">
            Have questions or need help? Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-cardLight dark:bg-cardDark p-8 rounded-xl shadow-lg">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>

            <p className="text-textLight dark:text-textDark">
              We’re here to help you with booking appointments, finding the
              right doctors, and resolving any issues.
            </p>

            <div className="space-y-4">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    {Icon && <Icon className="text-primary text-xl" />}
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p
                        className={
                          item.isPrimary
                            ? "text-primary"
                            : "text-textLight dark:text-textDark"
                        }
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formFields.map((field) => (
              <div key={field.name}>
                <label className="block mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg bg-transparent"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div>
              <label className="block mb-1">Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg bg-transparent resize-none"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-3 rounded-lg mt-2"
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
