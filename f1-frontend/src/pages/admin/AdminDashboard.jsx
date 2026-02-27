import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthProvider";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./adminDashboard.css";
import "../../components/admin/admin-shared.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [races, setRaces] = useState([]);
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    api.get("/admin/users").then(res => setUsers(res.data)).catch(() => {});
    api.get("/admin/news").then(res => setNews(res.data)).catch(() => {});
    api.get("/admin/circuits").then(res => setCircuits(res.data)).catch(() => {});
    api.get("/schedule/2026").then(res => setRaces(res.data)).catch(() => {});
    api.get("/admin/teams").then(res => setTeams(res.data)).catch(() => {});
    api.get("/admin/drivers").then(res => setDrivers(res.data)).catch(() => {});
    api.get("/admin/tickets").then(res => setTickets(res.data)).catch(() => {});
    api.get("/bookings/admin/all").then(res => setBookings(res.data)).catch(() => {});
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return (
      <AdminLayout>
        <div className="admin-empty">
          <div className="admin-empty-icon">⛔</div>
          <div className="admin-empty-text">Access Denied. Admins only.</div>
        </div>
      </AdminLayout>
    );
  }

  const monthlyData = [
    { month: "Jan", users: users.length },
    { month: "Feb", users: users.length },
    { month: "Mar", users: users.length },
  ];

  const chartData = {
    labels: monthlyData.map(m => m.month),
    datasets: [
      {
        label: "Users",
        data: monthlyData.map(m => m.users),
        backgroundColor: "#e10600",
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#fff" }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#888" },
        grid: { color: "#222" }
      },
      x: {
        ticks: { color: "#888" },
        grid: { color: "#222" }
      }
    },
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📊 Dashboard Overview</h1>
      </div>

      <div className="dashboard-overview-grid">
        <div className="dash-stat-card" onClick={() => navigate('/admin/users')}>
          <div className="dash-stat-icon">👥</div>
          <div className="dash-stat-value">{users.length}</div>
          <div className="dash-stat-label">Users</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/news')}>
          <div className="dash-stat-icon">📰</div>
          <div className="dash-stat-value">{news.length}</div>
          <div className="dash-stat-label">News</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/schedule')}>
          <div className="dash-stat-icon">🏁</div>
          <div className="dash-stat-value">{races.length}</div>
          <div className="dash-stat-label">Races</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/circuits')}>
          <div className="dash-stat-icon">🏎</div>
          <div className="dash-stat-value">{circuits.length}</div>
          <div className="dash-stat-label">Circuits</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/teams')}>
          <div className="dash-stat-icon">🏆</div>
          <div className="dash-stat-value">{teams.length}</div>
          <div className="dash-stat-label">Teams</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/drivers')}>
          <div className="dash-stat-icon">🏅</div>
          <div className="dash-stat-value">{drivers.length}</div>
          <div className="dash-stat-label">Drivers</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/tikit')}>
          <div className="dash-stat-icon">🎫</div>
          <div className="dash-stat-value">{tickets.length}</div>
          <div className="dash-stat-label">Tickets</div>
        </div>
        <div className="dash-stat-card" onClick={() => navigate('/admin/bookings')}>
          <div className="dash-stat-icon">📋</div>
          <div className="dash-stat-value">{bookings.length}</div>
          <div className="dash-stat-label">Bookings</div>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h3 className="section-title">⚡ Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => navigate('/admin/users')}>
            <span className="qa-icon">👤</span>
            <span className="qa-label">Add User</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/admin/news')}>
            <span className="qa-icon">📝</span>
            <span className="qa-label">Add News</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/admin/schedule')}>
            <span className="qa-icon">🏁</span>
            <span className="qa-label">Add Race</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/admin/tikit')}>
            <span className="qa-icon">🎫</span>
            <span className="qa-label">Add Ticket</span>
          </button>
        </div>
      </div>

      <div className="dashboard-analytics">
        <div className="admin-card">
          <div className="admin-card-header">📈 User Growth</div>
          <div className="admin-card-body">
            <div style={{ height: "200px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-activity">
        <div className="admin-card">
          <div className="admin-card-header">👥 Recent Users</div>
          <div className="admin-card-body">
            <div className="activity-list">
              {users.slice(-6).reverse().map(u => (
                <div key={u.id} className="activity-item">
                  <span className="activity-text">{u.email}</span>
                  <span className={`admin-badge admin-badge-${u.role === 'ADMIN' ? 'danger' : 'secondary'}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">📋 Recent Bookings</div>
          <div className="admin-card-body">
            <div className="activity-list">
              {bookings.slice(-6).reverse().map(b => (
                <div key={b.id} className="activity-item">
                  <span className="activity-text">{b.bookingReference}</span>
                  <span className={`admin-badge admin-badge-${
                    b.status === 'CONFIRMED' ? 'success' : 
                    b.status === 'PENDING' ? 'warning' : 'danger'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">🎫 Recent Tickets</div>
          <div className="admin-card-body">
            <div className="activity-list">
              {tickets.slice(-6).reverse().map(t => (
                <div key={t.id} className="activity-item">
                  <span className="activity-text">{t.ticketType}</span>
                  <span className="activity-value">₹{t.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">📰 Recent News</div>
          <div className="admin-card-body">
            <div className="activity-list">
              {news.slice(-6).reverse().map(n => (
                <div key={n.id} className="activity-item">
                  <span className="activity-text">{n.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
