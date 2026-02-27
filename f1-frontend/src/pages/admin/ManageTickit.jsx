import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import api from "../../services/api";
import { getScheduleByYear } from "../../services/api";
import { useAuth } from "../../context/AuthProvider";
import "../../components/admin/admin-shared.css";

export default function ManageTickit() {
  const { user } = useAuth();
  const [races, setRaces] = useState([]);
  const [raceTickets, setRaceTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    raceEventId: "",
    ticketType: "GENERAL",
    price: "",
    totalSeats: ""
  });

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Token from localStorage:", localStorage.getItem("token"));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [racesResponse, ticketsResponse] = await Promise.all([
        getScheduleByYear(2026),
        api.get("/admin/tickets")
      ]);
      console.log("Races data:", racesResponse);
      setRaces(racesResponse);
      setRaceTickets(ticketsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ticketData = {
        raceEventId: parseInt(formData.raceEventId),
        ticketType: formData.ticketType,
        price: parseFloat(formData.price),
        totalSeats: parseInt(formData.totalSeats),
        availableSeats: parseInt(formData.totalSeats)
      };

      console.log("Sending ticket data:", ticketData);

      if (editingTicket) {
        await api.put(`/admin/tickets/${editingTicket.id}`, ticketData);
      } else {
        const response = await api.post("/admin/tickets", ticketData);
        console.log("Response:", response);
      }

      fetchData();
      resetForm();
      alert(editingTicket ? "Ticket updated!" : "Ticket created!");
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      alert("Error saving ticket: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (row) => {
    setEditingTicket(row);
    setFormData({
      raceEventId: row.raceEventId.toString(),
      ticketType: row.ticketType,
      price: row.price.toString(),
      totalSeats: row.totalSeats.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await api.delete(`/admin/tickets/${row.id}`);
        fetchData();
        alert("Ticket deleted!");
      } catch (error) {
        alert("Error deleting ticket!");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      raceEventId: "",
      ticketType: "GENERAL",
      price: "",
      totalSeats: ""
    });
    setEditingTicket(null);
    setShowModal(false);
  };

  const getRaceName = (raceEventId) => {
    const race = races.find(r => r.id === raceEventId);
    return race ? `${race.raceName} - ${race.circuit.country}` : `Race ID: ${raceEventId}`;
  };

  const columns = [
    { 
      header: "Race", 
      field: "raceEventId",
      render: (row) => getRaceName(row.raceEventId)
    },
    { 
      header: "Type", 
      field: "ticketType",
      width: "120px",
      render: (row) => (
        <span className={`admin-badge admin-badge-${
          row.ticketType === 'VIP' ? 'warning' : 
          row.ticketType === 'PADDOCK' ? 'danger' : 'primary'
        }`}>
          {row.ticketType}
        </span>
      )
    },
    { 
      header: "Price", 
      field: "price",
      width: "100px",
      render: (row) => `₹${row.price}`
    },
    { header: "Total Seats", field: "totalSeats", width: "100px" },
    { header: "Available", field: "availableSeats", width: "100px" },
    { 
      header: "Status", 
      field: "status",
      width: "100px",
      render: (row) => (
        <span className={`admin-badge admin-badge-${row.status === 'ACTIVE' ? 'success' : 'secondary'}`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">🎫 Manage Tickets</h1>
        <button className="btn-admin btn-admin-success" onClick={() => setShowModal(true)}>
          + Add Ticket
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={raceTickets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search tickets..."
        emptyMessage="No tickets found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={resetForm}
        title={editingTicket ? "Edit Race Ticket" : "Create New Race Ticket"}
      >
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Select Race</label>
            <select
              className="admin-select"
              value={formData.raceEventId}
              onChange={(e) => setFormData({...formData, raceEventId: e.target.value})}
              required
              disabled={editingTicket}
            >
              <option value="">Select Race</option>
              {races.map(race => (
                <option key={race.id} value={race.id}>
                  {race.raceName} - {race.circuit.country}
                </option>
              ))}
            </select>
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Ticket Type</label>
            <select
              className="admin-select"
              value={formData.ticketType}
              onChange={(e) => setFormData({...formData, ticketType: e.target.value})}
              required
            >
              <option value="GENERAL">General</option>
              <option value="VIP">VIP</option>
              <option value="PADDOCK">Paddock</option>
            </select>
          </div>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Price (₹)</label>
              <input
                className="admin-input"
                type="number"
                step="0.01"
                placeholder="Ticket Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Total Seats</label>
              <input
                className="admin-input"
                type="number"
                placeholder="Total Seats"
                value={formData.totalSeats}
                onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="admin-form-actions">
            <button type="submit" className="btn-admin btn-admin-primary">
              {editingTicket ? "Update Ticket" : "Create Ticket"}
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