import { useEffect, useState } from "react";
import ComplaintCard from "../../components/ComplaintCard";
import { getComplaints, updateComplaintStatus } from "../../services/api";
import "../../styles/complaints.css";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const response = await getComplaints();
      setComplaints(response.data);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await updateComplaintStatus(id, "Resolved");
      setComplaints(prev => prev.map(c =>
        c.id === id ? { ...c, status: "Resolved" } : c
      ));
    } catch (error) {
      console.error("Error resolving complaint:", error);
      alert("Error resolving complaint");
    }
  };

  return (
    <div className="complaints-container">
      <h1 className="complaints-title">Admin Complaints</h1>
      <p className="complaints-subtitle">
        Review and resolve tenant issues
      </p>

      <div className="complaint-list">
        {complaints.map((c) => (
          <ComplaintCard
            key={c.id}
            room={c.room}
            message={c.message}
            status={c.status}
            createdAt={c.createdAt}
            complaintDate={c.complaintDate}
            user={c.user}
            isAdmin={true} // ADMIN VIEW
            onResolve={() => resolveComplaint(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Complaints;
