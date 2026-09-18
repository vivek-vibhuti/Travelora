import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/admin.css";

const BASE = "http://localhost:5000";

function AdminDashboard() {
  const token = localStorage.getItem("travelora_admin_token");
  const [adminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("travelora_admin_user")) || null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("travelora_admin_token");
    localStorage.removeItem("travelora_admin_user");
    navigate("/login");
  }, [navigate]);

  const handleError = useCallback(
    (res) => {
      if (res.status === 401 || res.status === 403) {
        logout();
        return true;
      }
      return false;
    },
    [logout]
  );

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/stats`, { headers });
      if (handleError(res)) return;
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json();
      setStats(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [headers, handleError]);

  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/bookings`, { headers });
      if (handleError(res)) return;
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [headers, handleError]);

  const loadContacts = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/contacts`, { headers });
      if (handleError(res)) return;
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setContacts(data.contacts || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [headers, handleError]);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/users`, { headers });
      if (handleError(res)) return;
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [headers, handleError]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const run = async () => {
      try {
        if (activeTab === "Overview") await loadStats();
        else if (activeTab === "Bookings") await loadBookings();
        else if (activeTab === "Messages") await loadContacts();
        else if (activeTab === "Users") await loadUsers();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [activeTab, token, loadStats, loadBookings, loadContacts, loadUsers]);

  const selectTab = (tab) => {
    setActiveTab(tab);
    setLoading(true);
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers,
      });
      if (handleError(res)) return;
      if (!res.ok) throw new Error("Failed to delete booking");
      await loadBookings();
      await loadStats();
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const formatDate = (x) => {
    if (!x) return "—";
    return new Date(x).toLocaleString();
  };

  const tabs = ["Overview", "Bookings", "Messages", "Users"];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">T</span>
          <div>
            <strong>Travelora</strong>
            <small>Admin Panel</small>
          </div>
        </div>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`admin-nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => selectTab(tab)}
            >
              <span className="admin-nav-dot" />
              {tab}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">
            {(adminUser && adminUser.name ? adminUser.name.charAt(0) : "A").toUpperCase()}
          </div>
          <div className="admin-avatar-info">
            <strong>{adminUser ? adminUser.name : "Admin"}</strong>
            <span>{adminUser ? adminUser.email : ""}</span>
          </div>
          <button className="admin-logout-btn" onClick={logout} title="Log out">
            ⎋
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{activeTab}</h1>
            <p>Manage your travel business from one place</p>
          </div>
          <button className="admin-logout-btn admin-header-logout" onClick={logout}>
            Log out
          </button>
        </header>

        {error && (
          <div className="admin-error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <p>Loading…</p>
          </div>
        ) : (
          <>
            {activeTab === "Overview" && (
              <section className="admin-overview">
                <h2 className="admin-section-title">Overview</h2>
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <span className="admin-stat-icon">📅</span>
                    <div>
                      <strong>{stats?.bookings ?? 0}</strong>
                      <span>Total Bookings</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <span className="admin-stat-icon">💬</span>
                    <div>
                      <strong>{stats?.messages ?? 0}</strong>
                      <span>Messages</span>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <span className="admin-stat-icon">👥</span>
                    <div>
                      <strong>{stats?.users ?? 0}</strong>
                      <span>Registered Users</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Bookings" && (
              <section className="admin-section">
                <div className="admin-section-head">
                  <h2 className="admin-section-title">Bookings</h2>
                  <span className="admin-count">{bookings.length} total</span>
                </div>
                {bookings.length === 0 ? (
                  <p className="admin-empty">No bookings found.</p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Package</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Travelers</th>
                          <th>Travel Date</th>
                          <th>Booked</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td className="admin-mono">#{b.id}</td>
                            <td>{b.package_id}</td>
                            <td>{b.name}</td>
                            <td className="admin-mono">{b.email}</td>
                            <td>{b.phone}</td>
                            <td>{b.travelers}</td>
                            <td>{formatDate(b.travel_date)}</td>
                            <td>{formatDate(b.created_at)}</td>
                            <td>
                              <button
                                className="admin-delete-btn"
                                onClick={() => deleteBooking(b.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === "Messages" && (
              <section className="admin-section">
                <div className="admin-section-head">
                  <h2 className="admin-section-title">Contact Messages</h2>
                  <span className="admin-count">{contacts.length} total</span>
                </div>
                {contacts.length === 0 ? (
                  <p className="admin-empty">No messages yet.</p>
                ) : (
                  <div className="admin-messages-grid">
                    {contacts.map((c) => (
                      <div className="admin-message-card" key={c.id}>
                        <div className="admin-message-head">
                          <div>
                            <strong>{c.name}</strong>
                            <span className="admin-message-subject">{c.subject}</span>
                          </div>
                          <span className="admin-message-date">{formatDate(c.created_at)}</span>
                        </div>
                        <p className="admin-message-body">{c.message}</p>
                        <div className="admin-message-foot">
                          <span>from</span> {c.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "Users" && (
              <section className="admin-section">
                <div className="admin-section-head">
                  <h2 className="admin-section-title">Users</h2>
                  <span className="admin-count">{users.length} total</span>
                </div>
                {users.length === 0 ? (
                  <p className="admin-empty">No users found.</p>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div className="admin-user-cell">
                                <span className="admin-user-avatar">
                                  {(u.name ? u.name.charAt(0) : "?").toUpperCase()}
                                </span>
                                {u.name}
                              </div>
                            </td>
                            <td className="admin-mono">{u.email}</td>
                            <td>
                              {u.is_admin ? (
                                <span className="admin-badge admin-badge-admin">Admin</span>
                              ) : (
                                <span className="admin-badge">User</span>
                              )}
                            </td>
                            <td>{formatDate(u.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;