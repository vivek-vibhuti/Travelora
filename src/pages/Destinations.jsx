import { useNavigate, useSearchParams } from "react-router-dom";
import destinations from "../data/destinations";

const tripTypeKeywords = {
  beach: ["beach", "maldives", "goa", "island"],
  mountain: ["mountain", "switzerland", "alpine", "himalaya"],
  city: ["city", "dubai", "paris", "london", "tokyo"],
  adventure: ["adventure", "safari", "desert", "trek"],
};

function matchesType(destination, type) {
  if (!type) return true;
  const keywords = tripTypeKeywords[type];
  if (!keywords) return true;
  const haystack = [
    destination.name,
    destination.country,
    destination.description,
    destination.longDescription,
    ...(destination.highlights || []),
  ]
    .join(" ")
    .toLowerCase();
  return keywords.some((kw) => haystack.includes(kw));
}

function inferType(text) {
  const lower = text.toLowerCase();
  for (const [type, keywords] of Object.entries(tripTypeKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) return type;
  }
  return null;
}

function Destinations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const typeParam = (searchParams.get("type") || "").toLowerCase();

  const normalizedType = typeParam
    ? (tripTypeKeywords[typeParam] ? typeParam : inferType(typeParam))
    : inferType(search);

  const filtersActive = Boolean(search || normalizedType);

  const filtered = destinations.filter((destination) => {
    if (normalizedType && !matchesType(destination, normalizedType)) return false;
    if (search) {
      const haystack = [
        destination.name,
        destination.country,
        destination.description,
        destination.longDescription,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const clearFilters = () => navigate("/destinations");

  return (
    <main className="destinations-page">

      <section className="destinations-header">
        <p>EXPLORE THE WORLD</p>

        <h1>Popular Destinations</h1>

        <p>
          Discover amazing places and find your perfect destination
          for your next adventure.
        </p>
      </section>

      {filtersActive && filtered.length > 0 && (
        <p className="destinations-header results-bar">
          Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {search ? ` for "${search}"` : ""}
          {normalizedType ? ` (${normalizedType})` : ""}
        </p>
      )}

      {filtersActive && filtered.length === 0 && (
        <div className="destinations-header no-results">
          <h2>No destinations match your search</h2>
          <p>
            Try a different keyword or trip type,{" "}
            <a href="/destinations" onClick={(e) => { e.preventDefault(); clearFilters(); }} style={{ cursor: "pointer" }}>
              view all destinations
            </a>.
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <section className="destinations-grid">

          {filtered.map((destination) => (
                  <article
                    className="destination-card"
                    key={destination.id}
                    onClick={() => navigate(`/destination/${destination.id}`)}
                  >

            <img
              src={destination.image}
              alt={destination.name}
            />

            <div className="destination-content">

              <h2>{destination.name}</h2>

              <h4>{destination.country}</h4>

              <p>{destination.description}</p>

              <button className="destination-btn">
                Explore
              </button>

            </div>

          </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Destinations;