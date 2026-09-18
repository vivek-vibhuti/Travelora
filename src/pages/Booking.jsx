import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import destinations from "../data/destinations";

function Booking() {
  const { id } = useParams();
  const dest = destinations.find((d) => d.id === Number(id));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelers, setTravelers] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package_id: id,
          name,
          email,
          phone,
          travelers,
          travel_date: travelDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Booking confirmed successfully!",
        });

        setName("");
        setEmail("");
        setPhone("");
        setTravelers("");
        setTravelDate("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Unable to connect to server" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="booking-hero">
        <div className="booking-hero-inner">
          <p className="booking-eyebrow">RESERVE YOUR ADVENTURE</p>
          <h1>Book Your Trip</h1>
          <p>
            Fill in your details and let us handle the rest. Your perfect
            journey starts here.
          </p>
        </div>
      </section>

      <section className="booking-body">
        <div className="booking-grid">
          {/* Summary sidebar */}
          <aside className="booking-summary">
            <h3>Your Trip Summary</h3>

            <div className="booking-summary-card">
              <div className="booking-summary-image">
                <img
                  src={dest ? dest.image : ""}
                  alt={dest ? dest.name : "Trip"}
                />
              </div>

              <h4>{dest ? dest.name : `Package #${id}`}</h4>
              <p className="booking-summary-country">
                {dest ? dest.country : ""}
              </p>

              <div className="booking-summary-rows">
                <div className="booking-summary-row">
                  <span>Package ID</span>
                  <strong>{id}</strong>
                </div>
                <div className="booking-summary-row">
                  <span>Travelers</span>
                  <strong>{travelers || "—"}</strong>
                </div>
                <div className="booking-summary-row">
                  <span>Travel Date</span>
                  <strong>{travelDate || "—"}</strong>
                </div>
              </div>

              {dest && (
                <p className="booking-summary-note">
                  {dest.longDescription.slice(0, 120)}…
                </p>
              )}
            </div>
          </aside>

          {/* Booking form */}
          <div className="booking-form-wrap">
            <div className="booking-form-header">
              <h2>Fill in the details</h2>
              <p>Please provide accurate information for your reservation.</p>
            </div>

            {message && (
              <p className={`booking-message booking-message-${message.type}`}>
                {message.text}
              </p>
            )}

            <form className="booking-form" onSubmit={handleBooking}>
              <div className="booking-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="booking-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="booking-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="booking-row">
                <div className="booking-field">
                  <label>Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="booking-actions">
        <Link to="/packages" className="booking-back-link">
          ← Back to packages
        </Link>
      </div>
    </main>
  );
}

export default Booking;