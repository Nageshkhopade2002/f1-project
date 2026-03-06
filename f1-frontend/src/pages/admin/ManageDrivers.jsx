import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import "../../components/admin/admin-shared.css";

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    driverNumber: "",
    nationality: "",
    teamId: "",
    bio: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/admin/drivers');
      console.log('Drivers response:', res.data);
      setDrivers(res.data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setDrivers([]);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await api.get('/admin/teams');
      setTeams(res.data || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) data.append("profileImage", image);

    try {
      if (editingId) {
        await api.put(`/admin/drivers/${editingId}`, data);
        alert("Driver updated");
      } else {
        await api.post('/admin/drivers', data);
        alert("Driver added");
      }
      resetForm();
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Error saving driver");
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      driverNumber: row.driverNumber || "",
      nationality: row.nationality || "",
      teamId: row.team?.id || "",
      bio: row.bio || "",
    });
    if (row.profileImage) {
      const imageUrl = row.profileImage.startsWith('/') 
        ? `http://localhost:8080${row.profileImage}`
        : `http://localhost:8080/${row.profileImage}`;
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await api.delete(`/admin/drivers/${row.id}`);
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      driverNumber: "",
      nationality: "",
      teamId: "",
      bio: "",
    });
    setImage(null);
    setPreview(null);
    setShowModal(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const columns = [
    {
      header: "Image",
      field: "profileImage",
      width: "80px",
      render: (row) =>
        row.profileImage ? (
          <img
            src={row.profileImage.startsWith('/') 
              ? `http://localhost:8080${row.profileImage}`
              : `http://localhost:8080/${row.profileImage}`}
            alt={row.firstName}
            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : null,
    },
    {
      header: "Name",
      field: "firstName",
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { header: "Number", field: "driverNumber", width: "80px" },
    { header: "Team", field: "team", render: (row) => row.team?.name || "-" },
    { header: "Nationality", field: "nationality", width: "150px" },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">🏆 Manage Drivers</h1>
        <button className="btn-admin btn-admin-success" onClick={handleAdd}>
          + Add Driver
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={drivers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search drivers..."
        emptyMessage="No drivers found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={resetForm}
        title={editingId ? "Edit Driver" : "Add Driver"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">First Name</label>
              <input
                name="firstName"
                className="admin-input"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Last Name</label>
              <input
                name="lastName"
                className="admin-input"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Car Number</label>
              <input
                name="driverNumber"
                className="admin-input"
                placeholder="Car Number"
                value={formData.driverNumber}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Nationality</label>
              <input
                name="nationality"
                className="admin-input"
                placeholder="Nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Team</label>
            <select
              name="teamId"
              className="admin-select"
              value={formData.teamId}
              onChange={handleChange}
              required
            >
              <option value="">Select Team</option>
              {Array.isArray(teams) &&
                teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Bio</label>
            <textarea
              name="bio"
              className="admin-textarea"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Driver Image</label>
            <input type="file" className="admin-input" onChange={handleImageChange} />
          </div>

          {preview && (
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #333' }}
              />
            </div>
          )}

          <div className="admin-form-actions">
            <button type="submit" className="btn-admin btn-admin-primary">
              {editingId ? "Update" : "Save"}
            </button>
            <button type="button" className="btn-admin btn-admin-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
}
