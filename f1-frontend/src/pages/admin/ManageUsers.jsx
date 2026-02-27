import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import "../../components/admin/admin-shared.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admin: 0, user: 0 });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "USER" });
  const [editUser, setEditUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Load users error", err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/users/stats");
      setStats(res.data || { total: 0, admin: 0, user: 0 });
    } catch (err) {
      console.error("Load stats error", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const addUser = async () => {
    if (!form.email || !form.password) {
      alert("Email and Password required");
      return;
    }
    await api.post("/admin/users", form);
    setForm({ email: "", password: "", role: "USER" });
    setShowModal(false);
    loadUsers();
    loadStats();
  };

  const updateUser = async () => {
    if (!editUser) return;
    await api.put(`/admin/users/${editUser.id}`, {
      email: editUser.email,
      password: editUser.password || null,
    });
    setEditUser(null);
    setShowModal(false);
    loadUsers();
    loadStats();
  };

  const deleteUser = async (row) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    await api.delete(`/admin/users/${row.id}`);
    loadUsers();
    loadStats();
  };

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, null, { params: { role } });
    loadUsers();
    loadStats();
  };

  const handleEdit = (row) => {
    setEditUser({ ...row, password: "" });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditUser(null);
    setForm({ email: "", password: "", role: "USER" });
    setShowModal(true);
  };

  const columns = [
    { header: "ID", field: "id", width: "60px" },
    { header: "Email", field: "email" },
    {
      header: "Role",
      field: "role",
      render: (row) => (
        <select
          className="admin-select"
          value={row.role}
          onChange={(e) => changeRole(row.id, e.target.value)}
          style={{ padding: '6px 8px', fontSize: '12px' }}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">👥 Manage Users</h1>
        <button className="btn-admin btn-admin-success" onClick={handleAdd}>
          + Add User
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card danger">
          <div className="admin-stat-label">Admins</div>
          <div className="admin-stat-value">{stats.admin}</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-label">Users</div>
          <div className="admin-stat-value">{stats.user}</div>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={deleteUser}
        searchPlaceholder="Search users..."
        emptyMessage="No users found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editUser ? "Edit User" : "Add New User"}
      >
        <div className="admin-form-group">
          <label className="admin-form-label">Email</label>
          <input
            className="admin-input"
            placeholder="Email"
            value={editUser ? editUser.email : form.email}
            onChange={(e) =>
              editUser
                ? setEditUser({ ...editUser, email: e.target.value })
                : setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            Password {editUser && "(leave blank to keep current)"}
          </label>
          <input
            type="password"
            className="admin-input"
            placeholder="Password"
            value={editUser ? editUser.password : form.password}
            onChange={(e) =>
              editUser
                ? setEditUser({ ...editUser, password: e.target.value })
                : setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {!editUser && (
          <div className="admin-form-group">
            <label className="admin-form-label">Role</label>
            <select
              className="admin-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        )}

        <div className="admin-form-actions">
          <button
            className="btn-admin btn-admin-primary"
            onClick={editUser ? updateUser : addUser}
          >
            {editUser ? "Update" : "Save"}
          </button>
          <button
            className="btn-admin btn-admin-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}
