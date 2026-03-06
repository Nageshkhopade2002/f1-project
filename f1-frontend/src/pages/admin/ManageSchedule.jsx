import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import { getAllRaces2026, createRace, updateRace, deleteRace } from "../../services/api";
import "../../components/admin/admin-shared.css";

export default function ManageSchedule() {
  const [races, setRaces] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    raceName: "",
    roundNumber: "",
    eventType: "RACE"
  });

  const loadRaces = () => {
    getAllRaces2026().then(setRaces);
  };

  useEffect(() => {
    loadRaces();
  }, []);

  const handleSubmit = async () => {
    if (editing) {
      await updateRace(editing.id, { ...editing, ...form });
    } else {
      await createRace({
        ...form,
        season: { id: 1 },
        circuit: { id: 1 }
      });
    }
    setForm({ raceName: "", roundNumber: "", eventType: "RACE" });
    setEditing(null);
    setShowModal(false);
    loadRaces();
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      raceName: row.raceName,
      roundNumber: row.roundNumber,
      eventType: row.eventType
    });
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm("Delete this race?")) {
      try {
        await deleteRace(row.id);
        loadRaces();
      } catch (err) {
        alert("Delete failed. Check backend.");
      }
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ raceName: "", roundNumber: "", eventType: "RACE" });
    setShowModal(true);
  };

  const columns = [
    { header: "ID", field: "id", width: "60px" },
    { header: "Race Name", field: "raceName" },
    { header: "Round", field: "roundNumber", width: "100px", render: (row) => row.roundNumber ?? "-" },
    { 
      header: "Type", 
      field: "eventType", 
      width: "120px",
      render: (row) => (
        <span className={`admin-badge admin-badge-${row.eventType === 'RACE' ? 'success' : 'warning'}`}>
          {row.eventType}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📅 Manage Schedule</h1>
        <button className="btn-admin btn-admin-success" onClick={handleAdd}>
          + Add Race
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={races}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search races..."
        emptyMessage="No races found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit Race" : "Add Race"}
      >
        <div className="admin-form-group">
          <label className="admin-form-label">Race Name</label>
          <input
            className="admin-input"
            placeholder="Race Name"
            value={form.raceName}
            onChange={e => setForm({ ...form, raceName: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Round Number</label>
          <input
            className="admin-input"
            placeholder="Round Number"
            type="number"
            value={form.roundNumber}
            onChange={e => setForm({ ...form, roundNumber: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Event Type</label>
          <select
            className="admin-select"
            value={form.eventType}
            onChange={e => setForm({ ...form, eventType: e.target.value })}
          >
            <option value="RACE">RACE</option>
            <option value="TESTING">TESTING</option>
          </select>
        </div>

        <div className="admin-form-actions">
          <button className="btn-admin btn-admin-primary" onClick={handleSubmit}>
            {editing ? "Update" : "Add"}
          </button>
          <button className="btn-admin btn-admin-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
}
