import "../styles/rooms.css";

function RoomModal({ room, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal room-modal">
        <h2 className="modal-title">Room Details</h2>

        <div className="room-details">
          <div className="detail-row">
            <span>Room</span>
            <strong>{room.room}</strong>
          </div>

          <div className="detail-row">
            <span>Floor</span>
            <strong>{room.floor}</strong>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <strong>{room.status}</strong>
          </div>

          {room.tenant && (
            <>
              <div className="divider" />

              <div className="detail-row">
                <span>User Name</span>
                <strong>{room.tenant.name}</strong>
              </div>

              <div className="detail-row">
                <span>User ID</span>
                <strong>{room.tenant.userId}</strong>
              </div>

              <div className="detail-row">
                <span>Phone</span>
                <strong>{room.tenant.phone}</strong>
              </div>
            </>
          )}
        </div>

        <div className="modal-actions center">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomModal;
