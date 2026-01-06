import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Spring Boot backend
});

// -------- ROOMS --------
export const getRooms = () => API.get("/rooms");
export const addRoom = (data) => API.post("/rooms", data);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);
export const bookRoom = (data) => API.post("/rooms/book", data);

// -------- BOOKINGS --------
export const getBookings = () => API.get("/bookings");
export const getBookingsByUser = (username) => API.get(`/bookings/user/${encodeURIComponent(username)}`);
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status });
export const vacateRoom = (username) => API.post(`/bookings/vacate/${encodeURIComponent(username)}`);

// -------- COMPLAINTS --------
export const getComplaints = () => API.get("/complaints");
export const getComplaintsByUser = (username) => API.get(`/complaints/user/${username}`);
export const addComplaint = (data) => API.post("/complaints", data);
export const updateComplaintStatus = (id, status) => API.put(`/complaints/${id}/status`, { status });

// -------- AUTH --------
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// -------- PASSWORD RESET --------
export const forgotPassword = (username) => API.post("/auth/forgot-password", { username });
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// -------- PAYMENTS --------
export const makePayment = (data) => API.post("/payments", data);
export const getPayments = () => API.get("/payments");
export const getPaymentsByUser = (username) => API.get(`/payments/user/${encodeURIComponent(username)}`);
export const getPaymentStatus = (username) => API.get(`/payments/user/${encodeURIComponent(username)}/status`);

export default API;
