import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import "../../components/admin/admin-shared.css";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    base: "",
    teamChief: "",
    technicalChief: "",
    powerUnit: "",
    firstEntryYear: "",
    description: "",
  });
  const [logo, setLogo] = useState(null);
  const [car, setCar] = useState(null);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/admin/teams');
      console.log('Teams response:', res.data);
      setTeams(res.data || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("fullName", formData.fullName);
    data.append("base", formData.base);
    data.append("teamChief", formData.teamChief);
    data.append("technicalChief", formData.technicalChief);
    data.append("powerUnit", formData.powerUnit);
    data.append("firstEntryYear", formData.firstEntryYear);
    data.append("description", formData.description);
    if (logo) data.append("logoImage", logo);
    if (car) data.append("carImage", car);

    try {
      if (editingId) {
        await api.put(`/admin/teams/${editingId}`, data);
        alert("Team updated");
      } else {
        await api.post('/admin/teams', data);
        alert("Team added");
      }
      resetForm();
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert("Error saving team");
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData({
      name: row.name || "",
      fullName: row.fullName || "",
      base: row.base || "",
      teamChief: row.teamChief || "",
      technicalChief: row.technicalChief || "",
      powerUnit: row.powerUnit || "",
      firstEntryYear: row.firstEntryYear || "",
      description: row.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/admin/teams/${row.id}`);
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      fullName: "",
      base: "",
      teamChief: "",
      technicalChief: "",
      powerUnit: "",
      firstEntryYear: "",
      description: "",
    });
    setLogo(null);
    setCar(null);
    setShowModal(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const columns = [
    { header: "ID", field: "id", width: "60px" },
    { header: "Name", field: "name" },
    { header: "Base", field: "base", width: "200px" },
    { header: "Power Unit", field: "powerUnit", width: "150px" },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">🏎 Manage Teams</h1>
        <button className="btn-admin btn-admin-success" onClick={handleAdd}>
          + Add Team
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={teams}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search teams..."
        emptyMessage="No teams found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={resetForm}
        title={editingId ? "Edit Team" : "Add Team"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Name</label>
              <input
                name="name"
                className="admin-input"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name</label>
              <input
                name="fullName"
                className="admin-input"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Base</label>
              <input
                name="base"
                className="admin-input"
                placeholder="Base"
                value={formData.base}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">First Entry Year</label>
              <input
                name="firstEntryYear"
                className="admin-input"
                placeholder="First Entry Year"
                value={formData.firstEntryYear}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Team Chief</label>
              <input
                name="teamChief"
                className="admin-input"
                placeholder="Team Chief"
                value={formData.teamChief}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Technical Chief</label>
              <input
                name="technicalChief"
                className="admin-input"
                placeholder="Technical Chief"
                value={formData.technicalChief}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Power Unit</label>
            <input
              name="powerUnit"
              className="admin-input"
              placeholder="Power Unit"
              value={formData.powerUnit}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              name="description"
              className="admin-textarea"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Team Logo</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => setLogo(e.target.files[0])}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Car Image</label>
              <input
                type="file"
                className="admin-input"
                onChange={(e) => setCar(e.target.files[0])}
              />
            </div>
          </div>

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
