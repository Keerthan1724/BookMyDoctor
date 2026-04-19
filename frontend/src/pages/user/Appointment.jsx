import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createAppointment } from "../../services/appointmentService";
import { toast } from "../../components/CustomToast";
import { formatTime12Hour } from "../../utils/formatters";

const Appointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const doctor = state?.doctor;
  const slot = state?.slot;
  const date = state?.date;

  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    phone: "",
    address: "",
    issue: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        patient_name: user.username || "",
        age: user.age || "",
        phone: user.phone || "",
        address: user.address || "",
        issue: "",
      });
    }
  }, [user]);

  if (!doctor || !slot) {
    return (
      <div className="text-center mt-20 text-gray-700 dark:text-gray-300">
        Invalid booking request
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!formData.patient_name.trim()) {
      toast("Patient name is required", "warning");
      return;
    }

    if (!formData.age || formData.age <= 0) {
      toast("Enter valid age", "warning");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast("Enter valid 10 digit phone number", "warning");
      return;
    }

    if (!formData.address.trim()) {
      toast("Address is required", "warning");
      return;
    }

    if (!formData.issue.trim() || formData.issue.length < 5) {
      toast("Issue must be at least 5 characters", "warning");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        slot: slot.id,
        description: formData.issue,
        payment_type: "OFFLINE",
      };

      await createAppointment(payload);

      toast("Appointment booked successfully", "success");
      navigate("/appointmenthistory");
    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        const msg =
          typeof err.response.data === "string"
            ? err.response.data
            : Object.values(err.response.data).join(", ");

        toast(msg, "error");
      } else {
        toast("Failed to book appointment", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 py-6">

      <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

        {/* close button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute right-3 top-3 text-gray-500 dark:text-slate-400 text-lg"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Appointment Details
        </h2>

        {/* Patient Name */}
        <label className="text-sm font-medium">Patient Name</label>
        <input
          type="text"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:p-3 mb-3 rounded text-sm sm:text-base"
        />

        {/* Age + Phone */}
        <div className="flex flex-col md:flex-row gap-3">

          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:p-3 mb-3 rounded text-sm sm:text-base"
            />
          </div>

          <div className="w-full md:w-1/2">
            <label className="text-sm font-medium">Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:p-3 mb-3 rounded text-sm sm:text-base"
            />
          </div>

        </div>

        {/* Address */}
        <label className="text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:p-3 mb-3 rounded text-sm sm:text-base"
        />

        {/* Issue */}
        <label className="text-sm font-medium">Health Issue Description</label>
        <textarea
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:p-3 mb-3 rounded resize-none text-sm sm:text-base"
          rows={4}
        />

        {/* Summary */}
        <div className="mb-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-3 sm:p-4 text-sm space-y-1">

          <p>
            <span className="font-medium text-gray-600 dark:text-slate-300">
              Date:
            </span>{" "}
            {date}
          </p>

          <p>
            <span className="font-medium text-gray-600 dark:text-slate-300">
              Time:
            </span>{" "}
            {formatTime12Hour(slot.start_time)}
          </p>

          <p>
            <span className="font-medium text-gray-600 dark:text-slate-300">
              Consultation Fee:
            </span>{" "}
            Rs. {doctor.consultation_fee}
          </p>

        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded text-sm sm:text-base disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

      </div>
    </div>
  );
};

export default Appointment;
