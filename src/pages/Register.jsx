import { useState } from "react";
import "../styles/auth-flow.css";

const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What city were you born in?",
];

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            security_question: securityQuestion,
            security_answer: securityAnswer,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        setSecurityQuestion("");
        setSecurityAnswer("");
      } else {
        setMessageType("error");
        setMessage(data.message || "Registration failed");
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
        <h2 className="auth-heading">Create Account</h2>
        <p className="auth-sub">Register for your TravelAgency account</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create a password (min 6 characters)"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="auth-flow-label">
            Security Question
            <select
              className="select-clean"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a security question
              </option>
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </label>

          <label className="auth-flow-label">
            Security Answer
            <input
              type="text"
              placeholder="Enter your security answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="auth-flow-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p className={`auth-message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
}

export default Register;