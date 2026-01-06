import { useEffect, useState } from "react";
import { getRooms, getBookings, getComplaints, getPayments } from "../../services/api";
import "../../styles/dashboard.css";

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all data from APIs
      const [roomsResponse, bookingsResponse, complaintsResponse, paymentsResponse] = await Promise.all([
        getRooms(),
        getBookings(),
        getComplaints(),
        getPayments()
      ]);

      const rooms = roomsResponse.data;
      const bookings = bookingsResponse.data;
      const complaints = complaintsResponse.data;
      const payments = paymentsResponse.data;

      // Calculate stats
      setTotalRooms(rooms.length);
      setAvailableRooms(rooms.filter(room => room.status === "Available").length);
      setPendingComplaints(complaints.filter(complaint => complaint.status !== "Resolved").length);

      // Get accepted bookings for tenant table
      const acceptedBookings = bookings.filter(b => b.status === "Accepted");

      // Create payment status map
      const paymentMap = new Map();
      payments.forEach(payment => {
        if (payment.status === "Completed") {
          paymentMap.set(payment.user.username, "Paid");
        }
      });

      // Tenant table data from accepted bookings with payment status
      const tenantData = acceptedBookings.map((b) => ({
        name: b.user?.username || 'Unknown',
        room: b.room,
        floor: b.floor,
        phone: b.phone,
        feeStatus: paymentMap.get(b.user?.username) || "Due",
      }));

      setTenants(tenantData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set defaults on error
      setTotalRooms(0);
      setAvailableRooms(0);
      setPendingComplaints(0);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH BY NAME OR ROOM
  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.room.toString().includes(search)
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">
        Manage rooms, tenants, and payments
      </p>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="card-grid">
        <div className="dashboard-card">
          <h3>Total Rooms</h3>
          <p className="card-number">{totalRooms}</p>
        </div>

        <div className="dashboard-card">
          <h3>Available Rooms</h3>
          <p className="card-number">{availableRooms}</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Complaints</h3>
          <p className="card-number">{pendingComplaints}</p>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search by name or room number"
        className="table-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ===== TENANT TABLE ===== */}
      <div className="table-wrapper">
        <table className="tenant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Room No</th>
              <th>Floor</th>
              <th>Phone</th>
              <th>Fee Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No tenant records found
                </td>
              </tr>
            ) : (
              filteredTenants.map((t, i) => (
                <tr key={i}>
                  <td>{t.name}</td>
                  <td>{t.room}</td>
                  <td>{t.floor}</td>
                  <td>{t.phone}</td>
                  <td>
                    <span
                      className={`status-badge ${t.feeStatus.toLowerCase()}`}
                    >
                      {t.feeStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
