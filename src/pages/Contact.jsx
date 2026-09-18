import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", text: "Message sent successfully!" });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", text: data.message });
      }
    } catch (error) {
      setStatus({ type: "error", text: "Unable to connect to server" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      {/* Contact Header */}
      <section className="contact-header">
        <p>GET IN TOUCH</p>

        <h1>Contact Us</h1>

        <p>
          Have a question or need help planning your next trip?
          We would love to hear from you.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        {/* Contact Information */}
        <div className="contact-info">
          <p className="contact-small-title">CONTACT US</p>

          <h2>Let's Plan Your Next Adventure</h2>

          <p className="contact-description">
            Our travel experts are here to help you choose the
            perfect destination, package, and experience for your trip.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Our Office</h3>
                <p>Bhubaneswar, Odisha, India</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>hello@travelora.com</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon">🕒</div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Saturday, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-container">
          <h2>Send Us a Message</h2>

          {status && (
            <p className={`contact-form-message ${status.type}`}>
              {status.text}
            </p>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="What can we help you with?"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta">
        <h2>Start Planning Your Dream Trip</h2>
        <p>Let Travelora help you turn your travel dreams into reality.</p>
      </section>
    </main>
  );
}

export default Contact;