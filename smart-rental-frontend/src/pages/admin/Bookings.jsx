import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../../services/api";
import "../../styles/complaints.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings from API
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update booking status
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      // Update local state
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status } : b
      ));

      // Trigger refresh of room data by dispatching custom event
      window.dispatchEvent(new CustomEvent('bookingStatusChanged'));
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Error updating booking status");
    }
  };

  return (
    <div className="complaints-container">
      <h1 className="complaints-title">Room Bookings</h1>
      <p className="complaints-subtitle">
        Review and approve room booking requests
      </p>

      <div className="complaint-list">
        {bookings.length === 0 && <p>No bookings found.</p>}

        {bookings.map((b) => (
          <div className="complaint-card" key={b.id}>
            <h3>{b.user?.username || 'Unknown'}</h3>
            <p>Room: {b.room}</p>
            <p>Floor: {b.floor}</p>
            <p>Phone: {b.phone}</p>
            <p>Booking Date: {b.bookingDate || 'N/A'}</p>

            <span className={`status ${b.status.toLowerCase()}`}>
              {b.status}
            </span>

            {b.status === "Pending" && (
              <div className="complaint-actions">
                <button
                  className="status-btn"
                  onClick={() => handleUpdateStatus(b.id, "Accepted")}
                >
                  Accept
                </button>

                <button
                  className="status-btn"
                  onClick={() => handleUpdateStatus(b.id, "Cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
