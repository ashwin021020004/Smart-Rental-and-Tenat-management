import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { makePayment, getPaymentStatus, getBookingsByUser } from "../../services/api";
import "../../styles/dashboard.css";

function UserPayments() {
  const { user: currentUser } = useAuth();
  const [paymentMode, setPaymentMode] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("5000");
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentResponse, bookingsResponse] = await Promise.all([
          getPaymentStatus(currentUser.username),
          getBookingsByUser(currentUser.username)
        ]);
        setPaymentStatus(paymentResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const hasOccupiedRoom = bookings.some(booking => booking.status === "Accepted");

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (paymentMode === "upi" && !upiId) {
      alert("Please enter UPI ID");
      return;
    }

    if (paymentMode === "bank" && !accountNo) {
      alert("Please enter account number");
      return;
    }

    try {
      await makePayment({
        username: currentUser.username,
        paymentMethod: paymentMode === "upi" ? "UPI" : "Bank Account",
        paymentIdentifier: paymentMode === "upi" ? upiId : accountNo,
        amount: amount
      });

      setMessage("✅ Payment processed successfully! Amount paid: ₹" + amount);

      // Refresh payment status
      const paymentResponse = await getPaymentStatus(currentUser.username);
      setPaymentStatus(paymentResponse.data);

      // Clear form
      setUpiId("");
      setAccountNo("");
      setAmount("5000");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!hasOccupiedRoom) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Payments</h1>
        <p className="dashboard-subtitle">
          You need to occupy a room before making payments.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Payments</h1>
      <p className="dashboard-subtitle">
        Pay your monthly rent securely
      </p>

      <div className="payment-card">
        <h2>Rent Payment</h2>

        {paymentStatus?.status === "Paid" ? (
          <p className="payment-success">
            Rent already paid. Amount: ₹{paymentStatus.amount}
          </p>
        ) : (
          <>
            <div className="amount-input">
              <label>Amount to Pay:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  checked={paymentMode === "upi"}
                  onChange={() => setPaymentMode("upi")}
                />
                Pay via UPI
              </label>

              <label>
                <input
                  type="radio"
                  checked={paymentMode === "bank"}
                  onChange={() => setPaymentMode("bank")}
                />
                Pay via Bank Account
              </label>
            </div>

            {paymentMode === "upi" && (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@paytm)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            )}

            {paymentMode === "bank" && (
              <input
                type="text"
                placeholder="Enter Account Number"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
              />
            )}

            <button className="pay-btn" onClick={handlePayment}>
              Pay Now
            </button>

            {message && (
              <p className="payment-success">{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserPayments;
