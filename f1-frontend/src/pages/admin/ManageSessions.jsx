import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/layout/AdminLayout";
import "../../components/admin/admin-shared.css";

export default function ManageSessions() {
  const [races, setRaces] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [raceId, setRaceId] = useState("");
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    api.get("/schedule/2026").then(res => setRaces(res.data));
  }, []);

  const loadSessions = async (id) => {
    setRaceId(id);
    const res = await api.get(`/admin/sessions/${id}`);
    setSessions(res.data);
  };

  const addSession = async () => {
    await api.post("/admin/sessions", { raceEventId: raceId, sessionName });
    setSessionName("");
    loadSessions(raceId);
  };

  const deleteSession = async (id) => {
    await api.delete(`/admin/sessions/${id}`);
    loadSessions(raceId);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">⏱ Manage Sessions</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-card-header">Select Race</div>
        <div className="admin-card-body">
          <select
            className="admin-select"
            onChange={e => loadSessions(e.target.value)}
            value={raceId}
          >
            <option value="">Select Race</option>
            {races.map(r => <option key={r.id} value={r.id}>{r.raceName}</option>)}
          </select>
        </div>
      </div>

      {raceId && (
        <>
          <div className="admin-card" style={{ marginBottom: '20px' }}>
            <div className="admin-card-header">Add Session</div>
            <div className="admin-card-body">
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  className="admin-input"
                  placeholder="Session Name (FP1, RACE...)"
                  value={sessionName}
                  onChange={e => setSessionName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="btn-admin btn-admin-success" onClick={addSession}>
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">Sessions List</div>
            <div className="admin-card-body">
              {sessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sessions.map(s => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#0f0f0f',
                        border: '1px solid #2a2a2a',
                        borderRadius: '4px'
                      }}
                    >
                      <span style={{ color: '#ddd', fontSize: '14px' }}>{s.sessionName}</span>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => deleteSession(s.id)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty">
                  <div className="admin-empty-text">No sessions added yet</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
