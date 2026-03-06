import "./admin-modal.css";

export default function AdminModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = "medium"
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div 
        className={`admin-modal admin-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
