import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tripType, setTripType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (tripType) params.set("type", tripType);
    const qs = params.toString();
    navigate(qs ? `/destinations?${qs}` : "/destinations");
  };

  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">

          <p className="hero-subtitle">
            EXPLORE THE WORLD
          </p>

          <h1>
            Your Journey Begins Here
          </h1>

          <p className="hero-description">
            Discover beautiful destinations, unforgettable experiences,
            and carefully planned trips made just for you.
          </p>

          <button className="explore-btn" onClick={() => navigate("/destinations")}>
                      Explore Destinations
                    </button>

          <form className="search-box" onSubmit={handleSearch}>
  <input
    type="text"
    placeholder="Where do you want to go?"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
    <option value="" disabled>
      Select trip type
    </option>
    <option value="beach">Beach</option>
    <option value="mountain">Mountain</option>
    <option value="city">City</option>
    <option value="adventure">Adventure</option>
  </select>

  <button type="submit" className="search-btn">
    Search
  </button>
</form>

        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">

        <p className="section-subtitle">
          DISCOVER MORE
        </p>

        <h2>
          Travel. Explore. Experience.
        </h2>

        <p>
          From relaxing beaches to breathtaking mountains,
          we help you discover the perfect destination for your next adventure.
        </p>

      </section>
    </main>
  );
}

export default Home;