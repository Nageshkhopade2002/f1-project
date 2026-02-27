export default function AdminCard({ title, value, icon }) {
  return (
    <div className="admin-stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
}
