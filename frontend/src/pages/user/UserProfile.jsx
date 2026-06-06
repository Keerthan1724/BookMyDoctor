import { useState, useEffect, useContext } from "react";
import MainLayout from "../../layouts/MainLayout";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile, deleteAccount } from "../../services/authService";
import { getAppointments } from "../../services/appointmentService";

import { FiEdit2, FiTrash2, FiLogOut, FiCamera } from "react-icons/fi";

import DashboardCard from "../../components/DashboardCard";
import { userDashboardItems } from "../../data/dashboardItems";

import ImagePreviewModal from "../../components/ImagePreviewModal";
import CropImageModal from "../../components/CropImageModal";

import { toast } from "../../components/CustomToast";
import { customModal } from "../../services/modalService";
import Avatar from "../../components/Avatar";
import { getImageUrl } from "../../utils/media";

import {
  buildFormDataFromObject,
  validateProfileForm,
  calculateDashboardStats,
} from "../../utils/profileHelpers";

import { getCroppedImageBlob } from "../../utils/imageCropHelpers";

const formFields = [
  { label: "Username", name: "username", type: "text", editable: true },
  { label: "Email", name: "email", type: "email", editable: false },
  { label: "Phone", name: "phone", type: "text", editable: true },
  { label: "Age", name: "age", type: "number", editable: true },
  {
    label: "Gender",
    name: "gender",
    type: "select",
    editable: true,
    options: ["MALE", "FEMALE", "OTHER"],
  },
  { label: "Address", name: "address", type: "textarea", editable: true },
];

const UserProfile = () => {
  const { user, setUser, logout } = useContext(AuthContext);

  const [form, setForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [previewModal, setPreviewModal] = useState(false);
  const [cropModal, setCropModal] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcoming: 0,
    completed: 0,
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || "",
        gender: user.gender || "",
        address: user.address || "",
      });

      if (user.profile_image) {
        const url = getImageUrl(user.profile_image, { bustCache: true });
        setPreviewImage(url);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getAppointments();
        setDashboardData(calculateDashboardStats(res.data || []));
      } catch (err) {
        console.log(err);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleAvatarClick = () => {
    if (!previewImage) return;
    setPreviewModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Please select an image", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast("Image must be smaller than 2MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels) return;

      const croppedBlob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels
      );

      const formData = new FormData();
      formData.append("profile_image", croppedBlob, "profile.jpg");

      const res = await updateProfile(formData);

      const url = getImageUrl(res.data.data.profile_image, {
        bustCache: true,
      });

      setUser(res.data.data);
      setPreviewImage(url);

      setCropModal(false);
      setImageSrc(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const formData = new FormData();
      formData.append("delete_image", "true");

      const res = await updateProfile(formData);

      setUser(res.data.data);
      setPreviewImage(null);

      setPreviewModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    if (!validateProfileForm(form, toast)) return;

    try {
      setLoading(true);

      const formData = buildFormDataFromObject(form);

      const res = await updateProfile(formData);

      setUser(res.data.data);
      toast("Profile updated successfully", "success");

      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast("Profile update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    customModal({
      type: "warning",
      title: "Delete Account?",
      message: `This action will permanently delete your account along with all your data including appointments, booking history, and profile details.

This action cannot be undone.

Are you sure you want to continue?`,
      primaryBtnText: "Delete",
      secondaryBtnText: "Cancel",
      onPrimary: async () => {
        try {
          await deleteAccount();
          logout();
        } catch {
          toast("Delete failed", "error");
        }
      },
    });
  };

  const actions = [
    {
      label: "Edit Profile",
      icon: FiEdit2,
      onClick: () => setEditMode(true),
      className: "bg-primary text-white",
    },
    {
      label: "Logout",
      icon: FiLogOut,
      onClick: logout,
      className: "bg-orange-500 text-white",
    },
    {
      label: "Delete Account",
      icon: FiTrash2,
      onClick: handleDelete,
      className: "bg-red-600 text-white",
    },
  ];

  if (!user) return null;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 px-4 py-5 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Dashboard
        </h2>

        <DashboardCard user={dashboardData} items={userDashboardItems} />

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 rounded-xl bg-cardLight dark:bg-cardDark p-4 sm:p-6 md:p-8 shadow-lg">
          {/* LEFT */}
          <div className="flex flex-col items-center gap-5 sm:gap-6">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-primary flex items-center justify-center">
              <div
                onClick={handleAvatarClick}
                className="w-full h-full rounded-full overflow-hidden cursor-pointer"
              >
                <Avatar
                  name={user.username}
                  image={previewImage}
                  alt="profile"
                  className="w-full h-full"
                  textClassName="text-5xl sm:text-7xl font-bold"
                />
              </div>

              <label className="absolute bottom-1 right-1 cursor-pointer rounded-full border-2 border-white bg-primary p-2 sm:p-3 text-white shadow-lg dark:border-slate-900">
                <FiCamera />
                <input type="file" hidden onChange={handleFileSelect} />
              </label>
            </div>

            {actions.map((btn, i) => {
              const Icon = btn.icon;

              return (
                <button
                  key={i}
                  onClick={btn.onClick}
                  className={`w-full py-2.5 sm:py-3 rounded-lg flex justify-center items-center gap-2 text-sm sm:text-base ${btn.className}`}
                >
                  <Icon /> {btn.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {formFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    disabled={!editMode || !field.editable}
                    className="input"
                  >
                    {field.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    disabled={!editMode || !field.editable}
                    className="input resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={form[field.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    disabled={!editMode || !field.editable}
                    className="input"
                  />
                )}
              </div>
            ))}

            {editMode && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm sm:text-base"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm sm:text-base bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition dark:border"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewModal && (
        <ImagePreviewModal
          previewImage={previewImage}
          onClose={() => setPreviewModal(false)}
          onDelete={handleDeleteImage}
        />
      )}

      {cropModal && (
        <CropImageModal
          imageSrc={imageSrc}
          crop={crop}
          zoom={zoom}
          cropShape="round"
          setCrop={setCrop}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          onClose={() => setCropModal(false)}
          onSave={handleCropSave}
        />
      )}
    </MainLayout>
  );
};

export default UserProfile;
