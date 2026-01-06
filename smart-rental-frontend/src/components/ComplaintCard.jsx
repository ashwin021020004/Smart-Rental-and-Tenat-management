function ComplaintCard({ room, message, status, createdAt, complaintDate, user, onResolve, isAdmin }) {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="complaint-card">

      {/* STATUS BADGE – TOP RIGHT */}
      <span className={`complaint-status ${status.toLowerCase()}`}>
        {status}
      </span>

      <h3 className="complaint-room">Room {room}</h3>

      {isAdmin && user && (
        <p className="complaint-user">
          User: {user.username}
        </p>
      )}

      <p className="complaint-message">{message}</p>

      {createdAt && (
        <p className="complaint-date">
          Submitted: {formatDateTime(createdAt)}
        </p>
      )}

      {complaintDate && (
        <p className="complaint-date">
          Complaint Date: {complaintDate}
        </p>
      )}

      {isAdmin && status === "Pending" && (
        <button className="resolve-btn" onClick={onResolve}>
          Mark as Resolved
        </button>
      )}
    </div>
  );
}

export default ComplaintCard;
