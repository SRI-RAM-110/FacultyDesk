import React, { useState } from "react";
import "./Register.css";

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

    // Later:
    // fetch("http://localhost:8080/faculty/register", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });
  };

  return (
    <div className="register-page">

      {/* ================= LEFT SIDE ================= */}
      <div className="register-left">

        {/* NEC Logo */}
        <div className="logo-container">
          <img
            src="/nec-logo.png"
            alt="Narasaraopeta Engineering College"
            className="nec-logo"
          />
        </div>

        {/* Heading */}
        <h1>
          Create <span>Faculty Account</span>
        </h1>

        <p className="subtitle">
          Join the College Resource Booking System
        </p>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="register-form">

          {/* Faculty ID */}
          <div className="input-box">
            <span className="input-icon">🪪</span>

            <input
              type="text"
              name="facultyId"
              placeholder="Faculty ID"
              value={formData.facultyId}
              onChange={handleChange}
              required
            />

            <span className="example">
              e.g. FAC001
            </span>
          </div>

          {/* Full Name */}
          <div className="input-box">
            <span className="input-icon">👤</span>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-box">
            <span className="input-icon">✉</span>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Branch */}
          <div className="input-box">
            <span className="input-icon">🏛</span>

            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Branch / Department</option>
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

            <span className="dropdown-arrow">⌄</span>
          </div>

          {/* Phone */}
          <div className="input-box">
            <span className="input-icon">📞</span>

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <span className="example">
              e.g. 9876543210
            </span>
          </div>

          {/* Password */}
          <div className="input-box">
            <span className="input-icon">🔒</span>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span className="eye-icon">👁</span>
          </div>

          {/* Confirm Password */}
          <div className="input-box">
            <span className="input-icon">🔒</span>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <span className="eye-icon">👁</span>
          </div>

          {/* Register Button */}
          <button type="submit" className="register-btn">
            REGISTER
            <span>→</span>
          </button>

        </form>

        {/* Login */}
        <div className="login-section">

          <div className="or-section">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <p>
            Already have an account?
            <a href="/login"> Login</a>
          </p>

        </div>

        {/* Bottom Text */}
        <div className="bottom-text">
          LEARN &nbsp; | &nbsp; INNOVATE &nbsp; | &nbsp; GROW
        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}
      <div className="register-right">

        {/* College Name */}
        <div className="college-heading">
          <h2>NARASARAOPETA</h2>
          <h3>ENGINEERING COLLEGE</h3>

          <div className="heading-line"></div>

          <p>
            A BRIGHTER CAMPUS <span>TOGETHER</span>
          </p>
        </div>


        {/* Features */}
        <div className="features">

          <div className="feature">
            <div className="feature-icon">📅</div>
            <h4>PLAN</h4>
          </div>

          <div className="feature">
            <div className="feature-icon">👥</div>
            <h4>BOOK</h4>
          </div>

          <div className="feature">
            <div className="feature-icon">⚙</div>
            <h4>MANAGE</h4>
          </div>

          <div className="feature">
            <div className="feature-icon">🤝</div>
            <h4>COLLABORATE</h4>
          </div>

        </div>


        {/* Campus Image */}
        <div className="campus-image-container">

          <img
            src="/college-campus.jpg"
            alt="Narasaraopeta Engineering College Campus"
            className="campus-image"
          />

        </div>


        {/* Bottom Quote */}
        <div className="education-box">
          <p>EDUCATION</p>
          <p>EMPOWERS</p>
          <p>TOMORROW</p>

          <div className="small-line"></div>
        </div>

      </div>

    </div>
  );
};

export default Register;