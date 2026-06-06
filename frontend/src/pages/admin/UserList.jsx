import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";
import SearchBar from "../../components/SearchBar";
import { getUsers } from "../../services/authService";
import UserDetailsModal from "./UserDetailsModal";
import Avatar from "../../components/Avatar";
import { formatDateNumeric } from "../../utils/formatters";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user?.username?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <div className="space-y-4 p-4 md:p-6">
        <h1 className="text-xl font-semibold">Users</h1>

        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search users..."
        />

        <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-100 text-left dark:bg-gray-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Updated At</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={user?.username}
                          image={user?.profile_image}
                          alt="user"
                          className="h-10 w-10"
                          textClassName="text-sm font-semibold"
                        />

                        <span className="font-medium">{user?.username}</span>
                      </div>
                    </td>

                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {formatDateNumeric(user.created_at)}
                    </td>

                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {formatDateNumeric(user.updated_at)}
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {user.gender || "Not set"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => setSelectedUser(user)}
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

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={(updatedUser) => {
            setUsers((prev) =>
              prev.map((user) =>
                user.id === updatedUser.id ? updatedUser : user,
              ),
            );
            setSelectedUser(updatedUser);
          }}
          onDeleted={(userId) => {
            setUsers((prev) => prev.filter((user) => user.id !== userId));
            setSelectedUser(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default UserList;
