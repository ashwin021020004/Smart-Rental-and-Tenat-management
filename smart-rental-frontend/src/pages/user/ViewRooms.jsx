import { useEffect, useState } from "react";
import { getRooms, bookRoom } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/rooms.css";

function ViewRooms() {
  const { user: currentUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", bookingDate: "" });
  const [loading, setLoading] = useState(true);

  // Load available rooms from API
  const loadRooms = async () => {
    try {
      const response = await getRooms();
      const allRooms = response.data;

      // Filter available rooms (not occupied)
      const availableRooms = allRooms.filter(r => r.status === "Available");
      setRooms(availableRooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOAD ON MOUNT + LISTEN FOR CHANGES
  useEffect(() => {
    loadRooms();

    // when localStorage changes (admin adds room)
    const handleStorageChange = () => {
      loadRooms();
    };

    // when user navigates back to this page
    const handleFocus = () => {
      loadRooms();
    };

    // when booking status changes
    const handleBookingStatusChange = () => {
      loadRooms();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("bookingStatusChanged", handleBookingStatusChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("bookingStatusChanged", handleBookingStatusChange);
    };
  }, []);

  // Auto-fill name when modal opens
  useEffect(() => {
    if (selectedRoom && currentUser) {
      setForm({ name: currentUser.username, phone: "", bookingDate: "" });
    }
  }, [selectedRoom, currentUser]);

  const handleBook = async () => {
    if (!form.name || !form.phone || !form.bookingDate) {
      alert("Please fill all details");
      return;
    }

    try {
      await bookRoom({
        name: form.name,
        phone: form.phone,
        room: selectedRoom.room,
        floor: selectedRoom.floor,
        bookingDate: form.bookingDate
      });

      alert("Booking request sent to admin!");
      setSelectedRoom(null);
      setForm({ name: "", phone: "", bookingDate: "" });
      loadRooms(); // refresh available rooms
    } catch (error) {
      console.error("Error booking room:", error);
      alert(error.response?.data || "Error booking room");
    }
  };

  return (
    <>
      <div className="rooms-container user-view-rooms">
        <h1>Available Rooms</h1>

        {rooms.length === 0 && (
          <p>No rooms currently available</p>
        )}

        <div className="room-grid">
          {rooms.map((r) => (
            <div className="room-card" key={r.id}>
              <h3>Room {r.room}</h3>
              <p>Floor {r.floor}</p>
              <button onClick={() => setSelectedRoom(r)}>
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Book Room {selectedRoom.room}</h3>

            <input
              placeholder="Your Name"
              value={form.name}
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
            />

            <input
              placeholder="Mobile Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              type="date"
              placeholder="Booking Date"
              value={form.bookingDate}
              onChange={(e) =>
                setForm({ ...form, bookingDate: e.target.value })
              }
            />

            <button onClick={handleBook}>Submit</button>
            <button onClick={() => setSelectedRoom(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewRooms;
