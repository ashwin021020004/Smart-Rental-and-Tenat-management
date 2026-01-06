import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dashboard.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h3 className="navbar-brand">Smart Rental</h3>
        </div>

        <button
          className="logout-btn"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </nav>

      {/* 🔐 LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="logout-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
