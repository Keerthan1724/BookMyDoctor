import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { addDoctor } from "../../services/doctorService";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import { toast } from "../../components/CustomToast";
import { adminSidebar } from "../../data/sidebarItems";
import { FiUpload } from "react-icons/fi";
import upload_area from "../../assets/upload_area.png";

const fields = [
  { label: "Doctor Name", name: "username", type: "text", half: true },
  { label: "Email", name: "email", type: "email", half: true },
  { label: "Password", name: "password", type: "password", half: true },
  { label: "Qualification", name: "qualification", type: "text", half: true },
  { label: "Specialization", name: "specialization", type: "text", half: true },
  { label: "Experience", name: "experience", type: "text", half: true },
  { label: "Contact No", name: "contact_no", type: "text", half: true },
  { label: "City", name: "city", type: "text", half: true },
  { label: "Consultation Fee", name: "consultation_fee", type: "text", half: true },
  { label: "Clinic Name", name: "clinic_name", type: "text", half: true },
  { label: "Clinic Address", name: "clinic_address", type: "text", full: true },
  { label: "About", name: "about", type: "textarea", full: true },
];

const AddDoctor = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Select valid image", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast("Image must be < 2MB", "error");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, profile_image: file }));
  };

  const handleDeleteImage = () => {
    setPreviewImage(null);
    setForm((prev) => ({ ...prev, profile_image: null }));
    setPreviewModal(false);
  };

  const validateForm = () => {
    for (let f of fields) {
      if (!form[f.name]) {
        toast(`Enter ${f.label}`, "error");
        return false;
      }
    }

    if (!/^[0-9]{10}$/.test(form.contact_no || "")) {
      toast("Invalid contact number", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      await addDoctor(data);

      toast("Doctor added successfully", "success");
      setForm({});
      setPreviewImage(null);
    } catch (err) {
      console.log(err.response?.data);
      toast("Failed to add doctor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <div className="p-3 sm:p-6 md:p-10">
        <div className="max-w-5xl mx-auto surface-card p-4 sm:p-6 md:p-8">
          
          <h2 className="text-lg sm:text-xl font-semibold mb-6">
            Add Doctor
          </h2>

          {/* Image Upload */}
          <div className="mb-8 flex flex-col items-start">
            <label className="label">Profile Picture</label>

            <div
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 theme-border border flex items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-900 overflow-hidden rounded-xl"
              onClick={() => previewImage && setPreviewModal(true)}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={upload_area}
                  className="w-full h-full object-cover opacity-80"
                />
              )}
            </div>

            <label className="flex items-center text-xs sm:text-sm theme-text-muted cursor-pointer mt-3">
              <FiUpload className="mr-2 sm:mr-3" />
              Upload Image
              <input type="file" hidden onChange={handleFileSelect} />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {fields.map((field) => {
              if (field.name === "about") {
                return (
                  <div key={field.name} className="col-span-1 sm:col-span-2 mt-2 sm:mt-4">
                    <label className="label">{field.label}</label>
                    <textarea
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      className="input resize-none h-24 sm:h-28"
                      placeholder={`Enter ${field.label}`}
                    />
                  </div>
                );
              }

              const colClass = field.full ? "col-span-1 sm:col-span-2" : "";

              return (
                <div key={field.name} className={colClass}>
                  <label className="label">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="input"
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-6 sm:mt-8 bg-primary hover:bg-primaryDark transition-colors text-white py-2.5 rounded-xl text-sm sm:text-base"
          >
            {loading ? "Adding..." : "Add Doctor"}
          </button>
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

export default AddDoctor;