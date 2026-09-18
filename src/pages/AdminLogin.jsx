import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.user.is_admin) {
        localStorage.setItem("travelora_admin_token", data.token);
        localStorage.setItem("travelora_admin_user", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setError(true);
        setMessage(data.user ? "Admin access required" : (data.message || "Login failed"));
      }
    } catch {
      setError(true);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-box admin-auth-box">
        <div className="admin-auth-icon">🛡️</div>
        <h2>Admin Portal</h2>
        <p>Sign in with an administrator account</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {message && (
          <p className={`auth-message ${error ? "admin-auth-error" : "admin-auth-ok"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;