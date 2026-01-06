import "../styles/rooms.css";

function RoomCard({ room, onView, onDelete }) {
  const isOccupied = room.status === "Occupied";

  return (
    <div className={`room-card ${isOccupied ? 'occupied' : ''}`}>
      <div className="room-top">
        <div>
          <h3 className="room-title">Room {room.room}</h3>
          <p className="room-floor">Floor {room.floor}</p>
        </div>

        <span className={`status-badge ${room.status.toLowerCase()}`}>
          {room.status}
        </span>
      </div>

      <div className="room-actions">
        <button className="btn-outline" onClick={onView}>
          View
        </button>
        {!isOccupied && (
          <button className="btn-danger" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default RoomCard;
