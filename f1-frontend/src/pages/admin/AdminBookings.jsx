import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import "../../components/admin/admin-shared.css";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/admin/all");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === "ALL" || booking.bookingStatus === filter
  );

  const getTotalRevenue = () => {
    return bookings
      .filter(b => b.bookingStatus === "CONFIRMED")
      .reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.bookingStatus === "CONFIRMED").length,
      pending: bookings.filter(b => b.bookingStatus === "PENDING").length,
      cancelled: bookings.filter(b => b.bookingStatus === "CANCELLED").length,
    };
    return stats;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading bookings...</div>
      </AdminLayout>
    );
  }

  const stats = getBookingStats();

  const columns = [
    { header: "Booking ID", field: "bookingId", width: "100px" },
    { header: "Race", field: "raceName" },
    { header: "Circuit", field: "circuitName" },
    { header: "Ticket Type", field: "ticketType", width: "120px" },
    { header: "Quantity", field: "quantity", width: "80px" },
    { 
      header: "Amount", 
      field: "totalAmount", 
      width: "120px",
      render: (row) => `₹${parseFloat(row.totalAmount || 0).toLocaleString()}`
    },
    { 
      header: "Date", 
      field: "bookingDate", 
      width: "120px",
      render: (row) => {
        if (!row.bookingDate) return "N/A";
        const date = Array.isArray(row.bookingDate)
          ? new Date(row.bookingDate[0], row.bookingDate[1] - 1, row.bookingDate[2])
          : new Date(row.bookingDate);
        return date.toLocaleDateString();
      }
    },
    { 
      header: "Status", 
      field: "bookingStatus",
      width: "120px",
      render: (row) => (
        <span className={`admin-badge admin-badge-${
          row.bookingStatus === 'CONFIRMED' ? 'success' :
          row.bookingStatus === 'PENDING' ? 'warning' :
          row.bookingStatus === 'CANCELLED' ? 'danger' : 'secondary'
        }`}>
          {row.bookingStatus}
        </span>
      )
    },
    { 
      header: "Payment", 
      field: "paymentStatus",
      width: "120px",
      render: (row) => (
        <span className={`admin-badge admin-badge-${
          row.paymentStatus === 'SUCCESS' ? 'success' :
          row.paymentStatus === 'PENDING' ? 'warning' :
          row.paymentStatus === 'FAILED' ? 'danger' : 'secondary'
        }`}>
          {row.paymentStatus}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📋 Manage Bookings</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-label">Total Bookings</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-label">Confirmed</div>
          <div className="admin-stat-value">{stats.confirmed}</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-label">Pending</div>
          <div className="admin-stat-value">{stats.pending}</div>
        </div>
        <div className="admin-stat-card danger">
          <div className="admin-stat-label">Cancelled</div>
          <div className="admin-stat-value">{stats.cancelled}</div>
        </div>
        <div className="admin-stat-card primary">
          <div className="admin-stat-label">Total Revenue</div>
          <div className="admin-stat-value" style={{ fontSize: '20px' }}>
            ₹{getTotalRevenue().toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '20px',
        padding: '12px',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #2a2a2a'
      }}>
        <button 
          className={`btn-admin ${filter === "ALL" ? 'btn-admin-primary' : 'btn-admin-secondary'}`}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        <button 
          className={`btn-admin ${filter === "CONFIRMED" ? 'btn-admin-primary' : 'btn-admin-secondary'}`}
          onClick={() => setFilter("CONFIRMED")}
        >
          Confirmed
        </button>
        <button 
          className={`btn-admin ${filter === "PENDING" ? 'btn-admin-primary' : 'btn-admin-secondary'}`}
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </button>
        <button 
          className={`btn-admin ${filter === "CANCELLED" ? 'btn-admin-primary' : 'btn-admin-secondary'}`}
          onClick={() => setFilter("CANCELLED")}
        >
          Cancelled
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={filteredBookings}
        searchPlaceholder="Search bookings..."
        emptyMessage="No bookings found"
      />
    </AdminLayout>
  );
}