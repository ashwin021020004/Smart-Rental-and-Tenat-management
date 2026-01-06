import "../../styles/dashboard.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getBookingsByUser, getComplaintsByUser, getPaymentStatus, vacateRoom } from "../../services/api";
import ComplaintCard from "../../components/ComplaintCard";

function UserDashboard() {
  const { user: currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [vacating, setVacating] = useState(false);

  console.log("UserDashboard - currentUser:", currentUser);

  useEffect(() => {
    if (!currentUser?.username) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const username = currentUser.username?.trim();
        if (!username) {
          throw new Error("Invalid username");
        }
        const [bookingsResponse, complaintsResponse, paymentResponse] = await Promise.all([
          getBookingsByUser(username),
          getComplaintsByUser(username),
          getPaymentStatus(username)
        ]);
        setBookings(bookingsResponse.data);
        setComplaints(complaintsResponse.data);
        setPaymentStatus(paymentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Refresh complaints every 5 seconds for real-time updates
    const interval = setInterval(async () => {
      try {
        const complaintsResponse = await getComplaintsByUser(currentUser.username);
        setComplaints(complaintsResponse.data);
      } catch (error) {
        console.error("Error refreshing complaints:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Check if user has an accepted booking (occupied room)
  const userBooking = bookings.find(
    (booking) => booking.status === "Accepted"
  );
  const hasOccupiedRoom = !!userBooking;

  // 🔹 Read rent info from localStorage
  const rent = JSON.parse(localStorage.getItem("rent"));

  const handleVacateRoom = async () => {
    if (!currentUser?.username) {
      console.error("No username found in currentUser:", currentUser);
      return;
    }

    console.log("Vacating room for user:", currentUser.username);
    setVacating(true);
    try {
      await vacateRoom(currentUser.username);
      // Refresh bookings data
      const bookingsResponse = await getBookingsByUser(currentUser.username);
      setBookings(bookingsResponse.data);
      // Refresh payment status
      const paymentResponse = await getPaymentStatus(currentUser.username);
      setPaymentStatus(paymentResponse.data);
      setShowConfirmDialog(false);
      alert("Room vacated successfully!");
    } catch (error) {
      console.error("Error vacating room:", error);
      alert("Failed to vacate room. Please try again.");
    } finally {
      setVacating(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <p className="dashboard-subtitle">
        View your personal and rent status
      </p>

      {/* USER DETAILS */}
      <div className="user-details-card">
        <h2>User Information</h2>

        {hasOccupiedRoom ? (
          <>
            <div className="user-details-grid">
              <div>
                <span className="label">Username</span>
                <span className="value">{currentUser?.username}</span>
              </div>

              <div>
                <span className="label">Room No</span>
                <span className="value">{userBooking.room}</span>
              </div>

              <div>
                <span className="label">Floor No</span>
                <span className="value">{userBooking.floor}</span>
              </div>

              <div>
                <span className="label">Phone No</span>
                <span className="value">{userBooking.phone}</span>
              </div>

              <div>
                <span className="label">Occupied Date</span>
                <span className="value">{userBooking.bookingDate || 'N/A'}</span>
              </div>
            </div>

            <div className="vacate-room-section">
              <button
                className="vacate-room-btn"
                onClick={() => setShowConfirmDialog(true)}
                disabled={vacating}
              >
                {vacating ? "Vacating..." : "Leave Room"}
              </button>
            </div>
          </>
        ) : (
          <div className="user-details-grid">
            <div>
              <span className="label">Username</span>
              <span className="value">{currentUser?.username}</span>
            </div>
          </div>
        )}
      </div>

      {/* RENT STATUS */}
      {hasOccupiedRoom && (
        <div className="booking-status-card">
          <h2>Rent Status</h2>

          {paymentStatus ? (
            <>
              <div className="booking-status-row">
                <span>
                  Monthly Rent: <strong>₹{paymentStatus.amount}</strong>
                </span>

                <span
                  className={`booking-status ${paymentStatus.status.toLowerCase()}`}
                >
                  {paymentStatus.status}
                </span>
              </div>

              <p className="booking-message">
                {paymentStatus.status === "Paid" &&
                  "Your rent has been paid for this month. Thank you!"}

                {paymentStatus.status === "Due" &&
                  "Your rent is due. Please make payment."}
              </p>
            </>
          ) : (
            <p className="booking-message">
              Rent information is not available.
            </p>
          )}
        </div>
      )}

      {/* COMPLAINTS STATUS */}
      <div className="complaints-dashboard-card">
        <h2>My Complaints</h2>
        {complaints.length === 0 ? (
          <p className="no-complaints">No complaints submitted yet.</p>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                room={complaint.room}
                message={complaint.message}
                status={complaint.status}
                createdAt={complaint.createdAt}
                complaintDate={complaint.complaintDate}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONFIRMATION DIALOG */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Room Vacation</h3>
            <p>Are you sure you want to leave your room? This action cannot be undone.</p>
            <div className="confirm-dialog-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
                disabled={vacating}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleVacateRoom}
                disabled={vacating}
              >
                {vacating ? "Vacating..." : "Yes, Leave Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
