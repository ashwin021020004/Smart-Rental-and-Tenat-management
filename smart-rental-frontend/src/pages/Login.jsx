import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(username, password);
    if (result.success) {
      navigate(result.role === "ADMIN" ? "/admin" : "/user");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Smart Rental</h1>
        <p className="login-subtitle">
          Manage rooms, tenants & complaints
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>



        <p className="login-footer">
          <button
            className="link-button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
          <br />
          Don't have an account?{" "}
          <button
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
          <br />
          Secure & simple rental management
        </p>
      </div>
    </div>
  );
}

export default Login;
