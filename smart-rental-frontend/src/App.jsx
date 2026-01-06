import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import Complaints from "./pages/admin/Complaints";
import Bookings from "./pages/admin/Bookings";

import UserDashboard from "./pages/user/UserDashboard";
import ViewRooms from "./pages/user/ViewRooms";
import UserComplaints from "./pages/user/UserComplaints";
import UserPayments from "./pages/user/UserPayments"; // ✅ NEW IMPORT

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check both state and localStorage
  const storedUser = localStorage.getItem('user');
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

/* ================= ADMIN LAYOUT ================= */
function AdminLayout() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Navbar />
      <div className="app-layout">
        <Sidebar role="admin" />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ================= USER LAYOUT ================= */
function UserLayout() {
  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <Navbar />
      <div className="app-layout">
        <Sidebar role="user" />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="rooms" element={<ManageRooms />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>

      {/* USER ROUTES */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="rooms" element={<ViewRooms />} />
        <Route path="complaints" element={<UserComplaints />} />
        <Route path="payments" element={<UserPayments />} /> {/* ✅ FIX */}
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
