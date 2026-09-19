import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Left Section */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">FD</div>

            <h1>Faculty Desk</h1>

            <p>One Desk. Every Faculty Service.</p>
          </div>

          <div className="college-info">
            <h2>Narasaraopet Engineering College</h2>

            <p>
              A unified platform designed to simplify faculty
              services and campus resources.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">

          <div className="login-header">
            <h2>Welcome Back</h2>

            <p>
              Sign in to access your Faculty Desk
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">

              <div className="password-header">
                <label htmlFor="password">
                  Password
                </label>

                <a href="/forgot-password">
                  Forgot password?
                </a>
              </div>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>

          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Register */}
          <div className="register-link">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;