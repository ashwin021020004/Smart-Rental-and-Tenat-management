import { useState } from "react";
import "../styles/rooms.css";

function AddRoomModal({ onAdd, onClose }) {
  const [room, setRoom] = useState("");
  const [floor, setFloor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!room || !floor) {
      alert("Please fill all fields");
      return;
    }

    onAdd({
      room,
      floor,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Room</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Room Number"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          {/* ✅ FLOOR AS TEXT INPUT */}
          <input
            type="number"
            placeholder="Floor Number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit" className="btn-add">
              Add
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal;
