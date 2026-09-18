import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          Travel<span>ora</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-buttons">
                  <Link to="/admin/login" className="admin-btn">
                    Admin
                  </Link>

                  <Link to="/login" className="login-btn">
                    Login
                  </Link>

          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;