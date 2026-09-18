import { Link, useParams } from "react-router-dom";
import destinations from "../data/destinations";

function DestinationDetail() {
  const { id } = useParams();
  const dest = destinations.find((d) => d.id === Number(id));

  if (!dest) {
    return (
      <main className="destination-detail-page">
        <div className="destination-not-found">
          <h1>Destination not found</h1>
          <p>Sorry, we couldn't find that place.</p>
          <Link to="/destinations" className="destination-btn">
            Browse all destinations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="destination-detail-page">
      <section className="destination-detail-hero">
        <img src={dest.image} alt={dest.name} />
        <div className="destination-detail-hero-overlay">
          <p className="destination-detail-eyebrow">DESTINATION</p>
          <h1>{dest.name}</h1>
          <h3>{dest.country}</h3>
        </div>
      </section>

      <section className="destination-detail-content">
        <div className="destination-detail-main">
          <h2>About {dest.name}</h2>
          <p className="destination-detail-desc">{dest.longDescription}</p>

          <h2>Highlights</h2>
          <ul className="destination-highlights">
            {dest.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <aside className="destination-detail-info">
          <h3>Quick Facts</h3>

          <div className="destination-fact">
            <span className="fact-label">Best time to visit</span>
            <span className="fact-value">{dest.bestTime}</span>
          </div>

          <div className="destination-fact">
            <span className="fact-label">Currency</span>
            <span className="fact-value">{dest.currency}</span>
          </div>

          <div className="destination-fact">
            <span className="fact-label">Language</span>
            <span className="fact-value">{dest.language}</span>
          </div>

          <Link to={`/booking/${dest.id}`} className="destination-book-btn">
            Book a Trip
          </Link>

          <Link to="/destinations" className="destination-back-btn">
            ← Back to destinations
          </Link>
        </aside>
      </section>
    </main>
  );
}

export default DestinationDetail;