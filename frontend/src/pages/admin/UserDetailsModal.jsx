import { useEffect, useMemo, useState } from "react";
import { deleteUser, updateUser } from "../../services/authService";
import { customModal } from "../../services/modalService";
import { toast } from "../../components/CustomToast";
import Avatar from "../../components/Avatar";
import { formatDateNumeric } from "../../utils/formatters";

const editableFields = [
  { label: "Username", name: "username", type: "text" },
  { label: "Phone", name: "phone", type: "text" },
  { label: "Age", name: "age", type: "number" },
  { label: "Gender", name: "gender", type: "select" },
  { label: "Address", name: "address", type: "textarea" },
];

const UserDetailsModal = ({ user, onClose, onUpdated, onDeleted }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        phone: user.phone || "",
        age: user.age || "",
        gender: user.gender || "",
        address: user.address || "",
      });
      setEditMode(false);
    }
  }, [user]);

  const createdAt = useMemo(
    () => {
      if (!user?.created_at) return "N/A";
      return formatDateNumeric(user.created_at);
    },
    [user],
  );

  const updatedAt = useMemo(
    () => {
      if (!user?.updated_at) return "N/A";
      return formatDateNumeric(user.updated_at);
    },
    [user],
  );

  if (!user) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!String(form.username || "").trim()) {
      toast("Username is required", "error");
      return false;
    }

    if (String(form.username || "").trim().length < 3) {
      toast("Username must be at least 3 characters", "error");
      return false;
    }

    if (String(form.phone || "").trim() && !/^[0-9]{10}$/.test(String(form.phone || "").trim())) {
      toast("Phone number must be exactly 10 digits", "error");
      return false;
    }

    if (String(form.age || "").trim() && Number(form.age) <= 0) {
      toast("Age must be greater than 0", "error");
      return false;
    }

    if (String(form.gender || "").trim() && !["MALE", "FEMALE", "OTHER"].includes(form.gender)) {
      toast("Select a valid gender", "error");
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
        data.append(key, value ?? "");
      });

      const res = await updateUser(user.id, data);
      toast("User updated successfully", "success");
      onUpdated(res.data);
      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    customModal({
      type: "warning",
      title: "Delete User Account?",
      message:
        "This user account will be permanently deleted along with connected profile data.\n\nDo you want to continue?",
      primaryBtnText: "Delete",
      secondaryBtnText: "Cancel",
      onPrimary: async () => {
        try {
          await deleteUser(user.id);
          toast("User account deleted", "success");
          onDeleted(user.id);
        } catch (err) {
          console.log(err);
          toast("Failed to delete user", "error");
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
            name={user.username}
            image={user.profile_image}
            alt={user.username}
            className="h-24 w-24"
            textClassName="text-3xl font-semibold"
          />

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {user.email}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
              {user.gender || "Not specified"}
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
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              value={user.email || ""}
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
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`input ${!editMode ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
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
                onClick={() => setEditMode(true)}
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

export default UserDetailsModal;
