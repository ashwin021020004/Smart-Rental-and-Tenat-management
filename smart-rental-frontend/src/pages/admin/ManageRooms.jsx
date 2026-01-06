import { useState, useEffect } from "react";
import RoomCard from "../../components/RoomCard";
import RoomModal from "../../components/RoomModal";
import AddRoomModal from "../../components/AddRoomModal";
import { getRooms, addRoom as apiAddRoom, deleteRoom as apiDeleteRoom } from "../../services/api";
import "../../styles/rooms.css";

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [floorFilter, setFloorFilter] = useState("All");
  const [search, setSearch] = useState("");

  // MODALS
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Load rooms from API
  useEffect(() => {
    loadRooms();

    // Listen for booking status changes that might affect room availability
    const handleStorageChange = () => {
      loadRooms();
    };

    const handleFocus = () => {
      loadRooms();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("bookingStatusChanged", loadRooms);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("bookingStatusChanged", loadRooms);
    };
  }, []);

  const loadRooms = async () => {
    try {
      const response = await getRooms();
      // Show all rooms in Manage Rooms (available and occupied)
      setRooms(response.data);
    } catch (error) {
      console.error("Error loading rooms:", error);
      // Fallback to empty array if API fails
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD ROOM
  const handleAddRoom = async (newRoom) => {
    try {
      const response = await apiAddRoom({
        room: parseInt(newRoom.room),
        floor: parseInt(newRoom.floor),
        status: "Available"
      });
      setRooms(prev => [...prev, response.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding room:", error);
      alert(error.response?.data || "Error adding room");
    }
  };

  // DELETE ROOM
  const handleDeleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await apiDeleteRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Error deleting room");
    }
  };

  // ✅ DYNAMIC FLOORS
  const floors = ["All", ...new Set(rooms.map((r) => r.floor))];

  // FILTER + SEARCH
  const filteredRooms = rooms.filter((room) => {
    const matchFloor =
      floorFilter === "All" || room.floor === Number(floorFilter);

    const matchSearch = String(room.room)
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchFloor && matchSearch;
  });

  return (
    <>
      <div className="rooms-container">
        {/* HEADER */}
        <div className="rooms-header">
          <div>
            <h1>Manage Rooms</h1>
            <p>View room availability floor-wise</p>
          </div>

          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            + Add Room
          </button>
        </div>

        {/* FILTERS */}
        <div className="rooms-filters">
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
          >
            {floors.map((f) => (
              <option key={f} value={f}>
                {f === "All" ? "All Floors" : `Floor ${f}`}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ROOMS GRID */}
        <div className="room-grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((r) => (
              <RoomCard
                key={r.id}
                room={r}
                onView={() => setSelectedRoom(r)}
                onDelete={() => handleDeleteRoom(r.id)}
              />
            ))
          ) : (
            <p>No rooms found</p>
          )}
        </div>
      </div>

      {/* VIEW ROOM MODAL */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      {/* ADD ROOM MODAL */}
      {showAddModal && (
        <AddRoomModal
          onAdd={handleAddRoom}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}

export default ManageRooms;
