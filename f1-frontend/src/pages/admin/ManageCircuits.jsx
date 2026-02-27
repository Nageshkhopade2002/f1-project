import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import "../../components/admin/admin-shared.css";

export default function ManageCircuits() {
  const emptyForm = {
    name: "",
    country: "",
    city: "",
    trackImage: null,
    trackImageUrl: "",
    trackOutline: null,
  };

  const [circuits, setCircuits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadCircuits = async () => {
    const res = await api.get("/admin/circuits");
    setCircuits(res.data);
  };

  useEffect(() => {
    loadCircuits();
  }, []);

  const submit = async () => {
    if (!form.name || !form.country || !form.city) {
      alert("Name, Country and City are required");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("country", form.country);
    fd.append("city", form.city);
    if (form.trackImage) fd.append("trackImage", form.trackImage);
    if (form.trackImageUrl) fd.append("trackImageUrl", form.trackImageUrl);
    if (form.trackOutline) fd.append("trackOutline", form.trackOutline);

    try {
      if (editingId) {
        await api.put(`/admin/circuits/${editingId}`, fd);
        alert("Circuit updated successfully");
      } else {
        await api.post("/admin/circuits", fd);
        alert("Circuit added successfully");
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowModal(false);
      loadCircuits();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const editCircuit = (row) => {
    setForm({
      name: row.name || "",
      country: row.country || "",
      city: row.city || "",
      trackImage: null,
      trackImageUrl: row.trackImage && row.trackImage.startsWith("http") ? row.trackImage : "",
      trackOutline: null,
    });
    setEditingId(row.id);
    setShowModal(true);
  };

  const deleteCircuit = async (row) => {
    if (!window.confirm("Are you sure you want to delete this circuit?")) return;
    await api.delete(`/admin/circuits/${row.id}`);
    loadCircuits();
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const columns = [
    { header: "ID", field: "id", width: "60px" },
    {
      header: "Name",
      field: "name",
      render: (row) => (
        <>
          {row.name}
          {row.city && <span style={{ color: "#888", fontSize: "12px" }}> ({row.country})</span>}
        </>
      ),
    },
    {
      header: "Track Image",
      field: "trackImage",
      width: "120px",
      render: (row) =>
        row.trackImage ? (
          <img
            src={row.trackImage.startsWith("http") ? row.trackImage : `http://localhost:8080${row.trackImage}`}
            alt="track"
            style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
          />
        ) : null,
    },
    {
      header: "Outline",
      field: "trackOutline",
      width: "100px",
      render: (row) =>
        row.trackOutline ? (
          <img
            src={`http://localhost:8080${row.trackOutline}`}
            alt="outline"
            style={{ width: "60px", height: "40px", objectFit: "contain" }}
          />
        ) : null,
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">🏁 Manage Circuits</h1>
        <button className="btn-admin btn-admin-success" onClick={handleAdd}>
          + Add Circuit
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={circuits}
        onEdit={editCircuit}
        onDelete={deleteCircuit}
        searchPlaceholder="Search circuits..."
        emptyMessage="No circuits found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Circuit" : "Add Circuit"}
        size="large"
      >
        <div className="admin-form-group">
          <label className="admin-form-label">Circuit Name</label>
          <input
            className="admin-input"
            placeholder="Circuit Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Country</label>
            <input
              className="admin-input"
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">City</label>
            <input
              className="admin-input"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Track Image (File)</label>
          <input
            type="file"
            className="admin-input"
            onChange={(e) => setForm({ ...form, trackImage: e.target.files[0] })}
          />
        </div>

        <div style={{ textAlign: "center", margin: "12px 0", color: "#666" }}>OR</div>

        <div className="admin-form-group">
          <label className="admin-form-label">Track Image URL</label>
          <input
            className="admin-input"
            placeholder="Track Image URL"
            value={form.trackImageUrl}
            onChange={(e) => setForm({ ...form, trackImageUrl: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Track Outline (SVG)</label>
          <input
            type="file"
            className="admin-input"
            onChange={(e) => setForm({ ...form, trackOutline: e.target.files[0] })}
          />
        </div>

        <div className="admin-form-actions">
          <button className="btn-admin btn-admin-primary" onClick={submit}>
            {editingId ? "Update" : "Save"}
          </button>
          <button className="btn-admin btn-admin-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}
