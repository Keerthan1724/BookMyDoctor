import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";
import { getDoctors } from "../../services/doctorService";
import SearchBar from "../../components/SearchBar";
import DoctorDetailsModal from "./DoctorDetailsModal";
import Avatar from "../../components/Avatar";
import { formatDateNumeric } from "../../utils/formatters";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data);
    } catch (err) {
      console.log("Error fetching doctors", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc?.username?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <div className="p-4 md:p-6 space-y-4">
        {/* Title */}
        <h1 className="text-xl font-semibold">Doctors</h1>

        {/* Search */}
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search doctors..."
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Updated At</th>
                <th className="p-3">Speciality</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    {/* Doctor */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={doc?.username}
                          image={doc?.profile_image}
                          alt="doctor"
                          className="w-10 h-10"
                          textClassName="text-sm font-semibold"
                        />

                        <span className="font-medium">{doc?.username}</span>
                      </div>
                    </td>

                    {/* Created At */}
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {formatDateNumeric(doc.created_at)}
                    </td>

                    {/* Updated At */}
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {formatDateNumeric(doc.updated_at)}
                    </td>

                    {/* Speciality */}
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs">
                        {doc.specialization || doc.speciality}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => setSelectedDoctor(doc)}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onUpdated={(updatedDoctor) => {
            setDoctors((prev) =>
              prev.map((doc) =>
                doc.id === updatedDoctor.id ? updatedDoctor : doc,
              ),
            );
            setSelectedDoctor(updatedDoctor);
          }}
          onDeleted={(doctorId) => {
            setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
            setSelectedDoctor(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default DoctorList;
