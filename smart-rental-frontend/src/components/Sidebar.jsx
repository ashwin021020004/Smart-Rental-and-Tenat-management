import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Menu</div>

      {role === "admin" ? (
        <>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/rooms">Manage Rooms</Link>
          <Link to="/admin/complaints">Complaints</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </>
      ) : (
        <>
          <Link to="/user">Dashboard</Link>
          <Link to="/user/rooms">View Rooms</Link>
          <Link to="/user/complaints">Complaints</Link>

          {/* ✅ ADD THIS LINE */}
          <Link to="/user/payments">Payments</Link>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
