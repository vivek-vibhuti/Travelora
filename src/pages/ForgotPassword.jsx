import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth-flow.css";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleFindAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 404) {
        setMessageType("error");
        setMessage("No account found with that email");
      } else if (response.ok) {
        setQuestion(data.question);
        setStep(2);
      } else {
        setMessageType("error");
        setMessage(data.message || "Unable to process your request");
      }
    } catch {
      setMessageType("error");
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          security_answer: securityAnswer,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Password reset successfully! You can now log in with your new password.");
        setStep(3);
      } else {
        setMessageType("error");
        setMessage(data.message || "Unable to reset password. Please verify your answer.");
      }
    } catch {
      setMessageType("error");
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-heading">Forgot Password</h2>
        <p className="auth-sub">
          {step === 1 && "Enter your account email to recover access"}
          {step === 2 && "Answer your security question to reset your password"}
          {step === 3 && "All done — you're ready to sign back in"}
        </p>

        {step === 1 && (
          <form onSubmit={handleFindAccount}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="auth-flow-btn" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <>
            <div className="auth-question-box">
              <span>Security Question</span>
              <strong>{question}</strong>
            </div>

            <form onSubmit={handleReset}>
              <label className="auth-flow-label">
                Your Answer
                <input
                  type="text"
                  placeholder="Enter your security answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </label>

              <label className="auth-flow-label">
                New Password (min 6 characters)
                <input
                  type="password"
                  placeholder="Enter a new password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="auth-flow-btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="auth-link-row">
              <button
                type="button"
                className="auth-flat-link"
                style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
                onClick={() => {
                  setStep(1);
                  setMessage("");
                  setMessageType("");
                }}
              >
                ← Use a different email
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="auth-link-row" style={{ flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Link to="/login" className="auth-flow-btn" style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}>
              Back to Login
            </Link>
          </div>
        )}

        {message && <p className={`auth-message ${messageType}`}>{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;