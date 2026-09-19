import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    facultyId: "",
    name: "",
    email: "",
    branch: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registration Data:", formData);

    // Backend registration will be connected later.
  };

  return (
    <div className="register-page">

      {/* =========================================
          REGISTER CARD
      ========================================= */}

      <div className="register-card">

        {/* =========================================
            LEFT BRANDING
        ========================================= */}

        <div className="register-brand-panel">

          <div className="register-brand-content">

            

            <h1>Faculty Desk</h1>

            <p className="brand-tagline">
              One Desk. Every Faculty Service.
            </p>

            <div className="brand-description">
              <p>
                A unified platform designed to simplify
                faculty services and campus resources.
              </p>
            </div>

          </div>


          {/* Service Highlights */}

          {/* <div className="register-services">

            <div className="register-service">
              <div className="service-icon">📅</div>

              <div>
                <h4>BOOK</h4>
                <p>Reserve campus resources</p>
              </div>
            </div>

            <div className="register-service">
              <div className="service-icon">📋</div>

              <div>
                <h4>REQUEST</h4>
                <p>Access faculty services</p>
              </div>
            </div>

            <div className="register-service">
              <div className="service-icon">⚙</div>

              <div>
                <h4>MANAGE</h4>
                <p>Manage your bookings</p>
              </div>
            </div>

            <div className="register-service">
              <div className="service-icon">🤝</div>

              <div>
                <h4>COLLABORATE</h4>
                <p>Connect with campus resources</p>
              </div>
            </div>

          </div> */}


          <div className="register-brand-footer">
            Narasaraopet Engineering College
          </div>

        </div>


        {/* =========================================
            RIGHT REGISTRATION FORM
        ========================================= */}

        <div className="register-form-panel">

          <div className="register-header">

            <div className="mobile-logo">
              FD
            </div>

            <h2>Create Faculty Account</h2>

            <p>
              Register to access Faculty Desk services
            </p>

          </div>


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Faculty ID */}

            <div className="register-field">

              <label htmlFor="facultyId">
                Faculty ID
              </label>

              <input
                id="facultyId"
                type="text"
                name="facultyId"
                placeholder="e.g. FAC001"
                value={formData.facultyId}
                onChange={handleChange}
                required
              />

            </div>


            {/* Full Name */}

            <div className="register-field">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Email */}

            <div className="register-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Phone */}

            <div className="register-field">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>


            {/* Department */}

            <div className="register-field">

              <label htmlFor="branch">
                Department
              </label>

              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select department
                </option>

                <option value="CSE">
                  Computer Science & Engineering
                </option>

                <option value="AIML">
                  Artificial Intelligence & Machine Learning
                </option>

                <option value="ECE">
                  Electronics & Communication Engineering
                </option>

                <option value="EEE">
                  Electrical & Electronics Engineering
                </option>

                <option value="MECH">
                  Mechanical Engineering
                </option>

                <option value="CIVIL">
                  Civil Engineering
                </option>

                <option value="IT">
                  Information Technology
                </option>

              </select>

            </div>


            {/* Password */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-password">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="password-button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Confirm Password */}

            <div className="register-field">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-password">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="password-button"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Register Button */}

            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>


          {/* Login */}

          <div className="register-divider">
            <span>OR</span>
          </div>

          <div className="existing-account">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;