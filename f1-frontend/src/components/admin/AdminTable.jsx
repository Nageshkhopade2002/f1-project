import { useState } from "react";
import "./admin-table.css";

export default function AdminTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  searchable = true,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found"
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item => {
    if (!search) return true;
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="admin-table-wrapper">
      {searchable && (
        <div className="table-search">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row) : row[col.field]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="actions-cell">
                      {onEdit && (
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => onEdit(row)}
                          title="Edit"
                        >
                          ✏
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => onDelete(row)}
                          title="Delete"
                        >
                          🗑
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="empty-row">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
