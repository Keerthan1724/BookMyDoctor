import { useState, useEffect, useContext } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { doctorSidebar } from "../../data/sidebarItems";

import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { updateDoctor } from "../../services/doctorService";
import { deleteAccount } from "../../services/authService";

import { FiEdit2, FiTrash2, FiCamera } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa";

import ImagePreviewModal from "../../components/ImagePreviewModal";
import Avatar from "../../components/Avatar";

import { toast } from "../../components/CustomToast";
import { customModal } from "../../services/modalService";
import { getImageUrl } from "../../utils/media";

const fields = [
  { label: "Doctor Name", name: "username", type: "text" },
  { label: "Email", name: "email", type: "email" },
  { label: "Qualification", name: "qualification", type: "text" },
  { label: "Specialization", name: "specialization", type: "text" },
  { label: "Experience", name: "experience", type: "text" },
  { label: "Contact No", name: "contact_no", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Consultation Fee", name: "consultation_fee", type: "text" },
  { label: "Clinic Name", name: "clinic_name", type: "text" },
  { label: "Clinic Address", name: "clinic_address", type: "text" },
  { label: "About", name: "about", type: "textarea", full: true },
];

const DoctorProfile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`doctors/?user=${user.id}`);
        const doctorData = res.data[0];

        setDoctor(doctorData);
        setForm(doctorData);

        if (doctorData?.profile_image) {
          setPreviewImage(
            getImageUrl(doctorData.profile_image, { bustCache: true }),
          );
        }
      } catch (err) {
        console.log(err);
        toast("Failed to load profile", "error");
      } finally {
        setLoadingPage(false);
      }
    };

    if (user) fetchDoctor();
  }, [user]);

  const validateForm = () => {
    if (!form.username?.trim()) return toast("Doctor name required", "error");
    if (!form.qualification?.trim()) {
      return toast("Qualification required", "error");
    }
    if (!form.specialization?.trim()) {
      return toast("Specialization required", "error");
    }

    if (!form.experience || isNaN(form.experience)) {
      return toast("Valid experience required", "error");
    }

    if (!/^[0-9]{10}$/.test(form.contact_no || "")) {
      return toast("Invalid contact number", "error");
    }

    if (!form.city?.trim()) return toast("City required", "error");

    if (!form.consultation_fee || isNaN(form.consultation_fee)) {
      return toast("Valid fee required", "error");
    }

    if (!form.clinic_name?.trim()) {
      return toast("Clinic name required", "error");
    }
    if (!form.clinic_address?.trim()) {
      return toast("Clinic address required", "error");
    }
    if (!form.about?.trim()) return toast("About required", "error");

    return true;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profile_image", file);

      const res = await updateDoctor(doctor.id, formData);

      setDoctor(res.data);

      if (res.data.profile_image) {
        setPreviewImage(getImageUrl(res.data.profile_image, { bustCache: true }));

        setUser((prev) => ({
          ...prev,
          profile_image: res.data.profile_image,
        }));
      }

      toast("Image updated", "success");
    } catch (err) {
      console.log(err);
      toast("Image update failed", "error");
    }
  };

  const handleDeleteImage = async () => {
    try {
      const formData = new FormData();
      formData.append("delete_image", "true");

      const res = await updateDoctor(doctor.id, formData);

      setDoctor(res.data);
      setForm(res.data);
      setPreviewImage(null);
      setPreviewModal(false);

      setUser((prev) => ({
        ...prev,
        profile_image: null,
      }));

      toast("Image deleted", "success");
    } catch (err) {
      console.log(err);
      toast("Image delete failed", "error");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await updateDoctor(doctor.id, form);
      setDoctor(res.data);
      setEditMode(false);
      toast("Profile updated", "success");
    } catch {
      toast("Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    customModal({
      type: "warning",
      title: "Delete Account Permanently",
      message: `
This action cannot be undone.

Deleting your account will permanently remove:
- Your doctor profile
- All availability slots
- All appointments
- All patient reviews
- All payment records

You will lose access completely.
      `,
      primaryBtnText: "Delete Forever",
      secondaryBtnText: "Cancel",
      onPrimary: async () => {
        try {
          await deleteAccount();
          toast("Account deleted", "success");
          window.location.href = "/";
        } catch {
          toast("Delete failed", "error");
        }
      },
    });
  };

  if (loadingPage) return <div className="p-6">Loading...</div>;
  if (!doctor) return <div className="p-6">No profile found</div>;

  return (
    <AdminLayout sidebarItems={doctorSidebar}>
      <div className="p-3 sm:p-5 md:p-6 space-y-6">
        <div className="surface-card p-4 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44">
              <div className="w-full h-full rounded-full border-4 border-primary overflow-hidden">
                <div
                  onClick={() => {
                    if (previewImage) {
                      setPreviewModal(true);
                    }
                  }}
                  className="w-full h-full cursor-pointer"
                >
                  <Avatar
                    name={doctor.username}
                    image={previewImage}
                    alt={doctor.username}
                    className="w-full h-full"
                    textClassName="text-4xl sm:text-5xl md:text-6xl font-semibold"
                  />
                </div>
              </div>

              <label className="absolute bottom-1 right-1 bg-primary p-2 sm:p-3 rounded-full text-white cursor-pointer shadow-lg border-2 border-white">
                <FiCamera />
                <input type="file" hidden onChange={handleFileSelect} />
              </label>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                {doctor.username}
              </h2>
              <p className="theme-text-muted text-sm sm:text-base">
                {doctor.specialization}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm theme-text-muted mt-1">
                <FaEnvelope />
                <span>{doctor.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
            <button
              onClick={() => setEditMode(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FiEdit2 /> Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-6 md:p-8 rounded-xl">
          <h2 className="text-lg sm:text-xl font-semibold mb-5">
            Doctor Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {fields.map((field) => {
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="sm:col-span-2">
                    <label className="label">{field.label}</label>
                    <textarea
                      value={form[field.name] || ""}
                      disabled={!editMode}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                      className="input resize-none h-28"
                    />
                  </div>
                );
              }

              return (
                <div key={field.name}>
                  <label className="label">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.name] || ""}
                    disabled={!editMode || field.name === "email"}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    className="input"
                  />
                </div>
              );
            })}
          </div>

          {editMode && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-primary text-white py-3 rounded-lg"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-slate-200 dark:bg-slate-700 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {previewModal && (
        <ImagePreviewModal
          previewImage={previewImage}
          onClose={() => setPreviewModal(false)}
          onDelete={handleDeleteImage}
        />
      )}
    </AdminLayout>
  );
};

export default DoctorProfile;
