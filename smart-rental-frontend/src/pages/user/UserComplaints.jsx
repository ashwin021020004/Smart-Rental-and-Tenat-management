import { useEffect, useState } from "react";
import ComplaintCard from "../../components/ComplaintCard";
import { getComplaintsByUser, addComplaint } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/complaints.css";

function UserComplaints() {
  const { user: currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [complaintDate, setComplaintDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadComplaints();
      // Refresh complaints every 5 seconds to show status updates from admin
      const interval = setInterval(loadComplaints, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadComplaints = async () => {
    try {
      const response = await getComplaintsByUser(currentUser.username);
      setComplaints(response.data);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async () => {
    if (!room || !message || !complaintDate) return;

    try {
      const response = await addComplaint({
        username: currentUser.username,
        room: room,
        message,
        complaintDate
      });
      setComplaints(prev => [...prev, response.data]);
      setRoom("");
      setMessage("");
      setComplaintDate("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert(error.response?.data || "Error submitting complaint");
    }
  };

  return (
    <div className="complaints-container">
      <h1 className="complaints-title">My Complaints</h1>

      {/* ADD THIS FORM */}
      <div className="complaint-form">
        <input
          placeholder="Room Number"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <textarea
          placeholder="Describe the issue"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="date"
          placeholder="Complaint Date"
          value={complaintDate}
          onChange={(e) => setComplaintDate(e.target.value)}
        />

        <button onClick={submitComplaint}>
          Submit Complaint
        </button>
      </div>

      {/* COMPLAINT LIST */}
      <div className="complaint-list">
        {complaints.map((c) => (
          <ComplaintCard
            key={c.id}
            room={c.room}
            message={c.message}
            status={c.status}
            createdAt={c.createdAt}
            complaintDate={c.complaintDate}
            isAdmin={false} // USER VIEW
          />
        ))}
      </div>
    </div>
  );
}

export default UserComplaints;
