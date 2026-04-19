import { useEffect, useMemo, useState } from "react";
import { deleteDoctor, updateDoctor } from "../../services/doctorService";
import { customModal } from "../../services/modalService";
import { toast } from "../../components/CustomToast";
import Avatar from "../../components/Avatar";
import { formatDateNumeric } from "../../utils/formatters";

const editableFields = [
  { label: "Experience", name: "experience", type: "number" },
  { label: "Specialization", name: "specialization", type: "text" },
  { label: "Qualification", name: "qualification", type: "text" },
  { label: "Consultation Fee", name: "consultation_fee", type: "number" },
  { label: "Clinic Name", name: "clinic_name", type: "text" },
  { label: "Contact No", name: "contact_no", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Clinic Address", name: "clinic_address", type: "textarea" },
  { label: "About", name: "about", type: "textarea" },
];

const DoctorDetailsModal = ({ doctor, onClose, onUpdated, onDeleted }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (doctor) {
      setForm({
        experience: doctor.experience || "",
        specialization: doctor.specialization || "",
        qualification: doctor.qualification || "",
        consultation_fee: doctor.consultation_fee || "",
        clinic_name: doctor.clinic_name || "",
        contact_no: doctor.contact_no || "",
        city: doctor.city || "",
        clinic_address: doctor.clinic_address || "",
        about: doctor.about || "",
      });
      setEditMode(false);
    }
  }, [doctor]);

  const createdAt = useMemo(
    () => {
      if (!doctor?.created_at) return "N/A";
      return formatDateNumeric(doctor.created_at);
    },
    [doctor],
  );

  const updatedAt = useMemo(
    () => {
      if (!doctor?.updated_at) return "N/A";
      return formatDateNumeric(doctor.updated_at);
    },
    [doctor],
  );

  if (!doctor) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!String(form.experience || "").trim()) {
      toast("Experience is required", "error");
      return false;
    }

    if (Number(form.experience) <= 0) {
      toast("Experience must be greater than 0", "error");
      return false;
    }

    if (!String(form.specialization || "").trim()) {
      toast("Specialization is required", "error");
      return false;
    }

    if (!String(form.qualification || "").trim()) {
      toast("Qualification is required", "error");
      return false;
    }

    if (!String(form.consultation_fee || "").trim()) {
      toast("Consultation fee is required", "error");
      return false;
    }

    if (Number(form.consultation_fee) <= 0) {
      toast("Consultation fee must be greater than 0", "error");
      return false;
    }

    if (!String(form.clinic_name || "").trim()) {
      toast("Clinic name is required", "error");
      return false;
    }

    if (!String(form.contact_no || "").trim()) {
      toast("Contact number is required", "error");
      return false;
    }

    if (!/^[0-9]{10}$/.test(String(form.contact_no || "").trim())) {
      toast("Contact number must be exactly 10 digits", "error");
      return false;
    }

    if (!String(form.city || "").trim()) {
      toast("City is required", "error");
      return false;
    }

    if (!String(form.clinic_address || "").trim()) {
      toast("Clinic address is required", "error");
      return false;
    }

    if (!String(form.about || "").trim()) {
      toast("About is required", "error");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await updateDoctor(doctor.id, data);
      toast("Doctor updated successfully", "success");
      onUpdated(res.data);
      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast("Failed to update doctor", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    customModal({
      type: "warning",
      title: "Delete Doctor Account?",
      message:
        "This doctor account will be permanently deleted along with connected profile data.\n\nDo you want to continue?",
      primaryBtnText: "Delete",
      secondaryBtnText: "Cancel",
      onPrimary: async () => {
        try {
          await deleteDoctor(doctor.id);
          toast("Doctor account deleted", "success");
          onDeleted(doctor.id);
        } catch (err) {
          console.log(err);
          toast("Failed to delete doctor", "error");
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-5 shadow-lg dark:bg-slate-900 dark:text-slate-100 sm:p-6">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 dark:text-slate-400"
        >
          X
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar
            name={doctor.username}
            image={doctor.profile_image}
            alt={doctor.username}
            className="h-24 w-24"
            textClassName="text-3xl font-semibold"
          />

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold">{doctor.username}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {doctor.email}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Created At
            </p>
            <p className="mt-1 text-sm font-medium">{createdAt}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Updated At
            </p>
            <p className="mt-1 text-sm font-medium">{updatedAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              value={doctor.username || ""}
              readOnly
              className="input cursor-not-allowed opacity-70"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              value={doctor.email || ""}
              readOnly
              className="input cursor-not-allowed opacity-70"
            />
          </div>

          {editableFields.map((field) => (
            <div
              key={field.name}
              className={field.type === "textarea" ? "sm:col-span-2" : ""}
            >
              <label className="mb-1 block text-sm font-medium">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  readOnly={!editMode}
                  className={`input min-h-24 resize-none ${!editMode ? "cursor-not-allowed opacity-70" : ""}`}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  readOnly={!editMode}
                  className={`input ${!editMode ? "cursor-not-allowed opacity-70" : ""}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 dark:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={setEditMode.bind(null, true)}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Delete Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsModal;
