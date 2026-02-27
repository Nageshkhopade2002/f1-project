import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import AdminTable from "../../components/admin/AdminTable";
import AdminModal from "../../components/admin/AdminModal";
import "../../components/admin/admin-shared.css";

export default function ManageNews() {
  const emptyForm = {
    title: "",
    description: "",
    source: "",
    image: null,
    imageUrl: "",
  };

  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadNews = async () => {
    const res = await api.get("/admin/news");
    setNewsList(res.data);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const submit = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("source", form.source);
    if (form.image) fd.append("image", form.image);
    if (!form.image && form.imageUrl) fd.append("imageUrl", form.imageUrl);

    if (editing) {
      await api.put(`/admin/news/${editing.id}`, fd);
      alert("News Updated");
    } else {
      await api.post("/admin/news", fd);
      alert("News Added");
    }

    setForm(emptyForm);
    setEditing(null);
    setShowModal(false);
    loadNews();
  };

  const deleteNews = async (row) => {
    if (!window.confirm("Delete this news?")) return;
    await api.delete(`/admin/news/${row.id}`);
    loadNews();
  };

  const editNews = (row) => {
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description,
      source: row.source,
      image: null,
      imageUrl: row.imageUrl,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const columns = [
    { header: "ID", field: "id", width: "60px" },
    {
      header: "Image",
      field: "imageUrl",
      width: "100px",
      render: (row) =>
        row.imageUrl ? (
          <img
            src={`http://localhost:8080${row.imageUrl}`}
            alt=""
            style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
          />
        ) : null,
    },
    { header: "Title", field: "title" },
    { header: "Source", field: "source", width: "150px" },
    {
      header: "Description",
      field: "description",
      render: (row) => (
        <span style={{ fontSize: "12px", color: "#aaa" }}>
          {row.description?.substring(0, 80)}...
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📰 Manage News</h1>
        <button className="btn-admin btn-admin-success" onClick={handleAdd}>
          + Add News
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={newsList}
        onEdit={editNews}
        onDelete={deleteNews}
        searchPlaceholder="Search news..."
        emptyMessage="No news found"
      />

      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit News" : "Add News"}
        size="large"
      >
        <div className="admin-form-group">
          <label className="admin-form-label">Title</label>
          <input
            className="admin-input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            className="admin-textarea"
            rows="4"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Source</label>
          <input
            className="admin-input"
            placeholder="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Upload Image</label>
          <input
            type="file"
            className="admin-input"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </div>

        <div style={{ textAlign: "center", margin: "12px 0", color: "#666" }}>OR</div>

        <div className="admin-form-group">
          <label className="admin-form-label">Image URL</label>
          <input
            className="admin-input"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>

        <div className="admin-form-actions">
          <button className="btn-admin btn-admin-primary" onClick={submit}>
            {editing ? "Update" : "Save"}
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
