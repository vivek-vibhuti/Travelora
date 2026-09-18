import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth-flow.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Login successful!");
      } else {
        setMessageType("error");
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-heading">Welcome Back</h2>
        <p className="auth-sub">Login to your TravelAgency account</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-flow-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-link-row">
          <Link to="/forgot-password" className="auth-flat-link">
            Forgot password?
          </Link>
        </div>

        {message && <p className={`auth-message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;