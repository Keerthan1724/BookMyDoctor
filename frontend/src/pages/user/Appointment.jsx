import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createAppointment } from "../../services/appointmentService";

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

  // autofill from user
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

  // guard
  if (!doctor || !slot) {
    return <div className="text-center mt-20">Invalid booking request</div>;
  }

  const formatTime = (time) => {
    let [h, m] = time.split(":");
    h = parseInt(h);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (loading) return; // ✅ prevent double click

    if (!formData.patient_name.trim()) {
      alert("Patient name is required");
      return;
    }

    if (!formData.age || formData.age <= 0) {
      alert("Enter valid age");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    if (!formData.address.trim()) {
      alert("Address is required");
      return;
    }

    if (!formData.issue.trim() || formData.issue.length < 5) {
      alert("Issue must be at least 5 characters");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        slot: slot.id,
        description: formData.issue, // ✅ IMPORTANT (match backend)
        payment_type: "OFFLINE", // or ONLINE if needed
      };

      await createAppointment(payload);

      alert("Appointment booked successfully");

      navigate("/appointmenthistory");
    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        const msg =
          typeof err.response.data === "string"
            ? err.response.data
            : Object.values(err.response.data).join(", ");

        console.log(msg);
      } else {
        alert("Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg relative">
        {/* close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>

        {/* patient name */}
        <label className="text-sm font-medium">Patient Name</label>
        <input
          type="text"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="text-sm font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />
          </div>

          <div className="w-1/2">
            <label className="text-sm font-medium">Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />
          </div>
        </div>

        {/* address */}
        <label className="text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        {/* issue */}
        <label className="text-sm font-medium">Health Issue Description</label>
        <textarea
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded resize-none"
          rows={4}
        />

        {/* summary */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-4 text-sm">
          <p>
            <span className="font-medium text-gray-600">Date:</span> {date}
          </p>
          <p>
            <span className="font-medium text-gray-600">Time:</span>{" "}
            {formatTime(slot.start_time)}
          </p>
          <p>
            <span className="font-medium text-gray-600">Consultation Fee:</span>{" "}
            ₹{doctor.consultation_fee}
          </p>
        </div>

        {/* submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </div>
  );
};

export default Appointment;
