import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Maintenance.css";

const API_BASE_URL = "http://localhost:8080";

function Maintenance() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const facultyData = localStorage.getItem("faculty");

  let faculty = null;

  try {
    faculty = facultyData ? JSON.parse(facultyData) : null;
  } catch (error) {
    console.error("Invalid faculty data:", error);
  }

  const [formData, setFormData] = useState({
    block: "",
    floor: "",
    roomArea: "",
    specificLocation: "",
    category: "",
    issueType: "",
    quantity: 1,
    priority: "Medium",
    description: "",
    additionalInfo: "",
  });

  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const displayName = faculty?.name || "Faculty Member";
  const department =
    faculty?.branch || "Department Not Available";

  const categoryItems = {
    Electrical: [
      "Fan",
      "Light",
      "Switch",
      "Socket",
      "Electrical Wiring",
      "Other",
    ],

    Carpentry: [
      "Table",
      "Chair",
      "Bench",
      "Door",
      "Window",
      "Cupboard",
      "Other",
    ],

    Furniture: [
      "Table",
      "Chair",
      "Desk",
      "Bench",
      "Cupboard",
      "Other",
    ],

    Plumbing: [
      "Tap",
      "Wash Basin",
      "Pipeline",
      "Water Leakage",
      "Toilet",
      "Other",
    ],

    Civil: [
      "Wall",
      "Floor",
      "Ceiling",
      "Roof",
      "Door",
      "Window",
      "Other",
    ],

    "IT / Networking": [
      "Computer",
      "Projector",
      "Network Point",
      "Wi-Fi",
      "LAN Cable",
      "Other",
    ],

    Cleaning: [
      "Room Cleaning",
      "Dustbin",
      "Washroom Cleaning",
      "Other",
    ],

    Other: [
      "Other",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: value,
      issueType: "",
    }));
  };

  const getErrorMessage = (response) => {
    if (response.status === 400) {
      return "Invalid maintenance request. Please check the entered details.";
    }

    if (response.status === 401) {
      return "Your session has expired. Please login again.";
    }

    if (response.status === 403) {
      return "You are not authorized to submit a maintenance request.";
    }

    if (response.status === 500) {
      return "Server error occurred. Please try again later.";
    }

    return `Request failed with status ${response.status}.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.block ||
      !formData.floor ||
      !formData.roomArea ||
      !formData.category ||
      !formData.issueType ||
      !formData.description
    ) {
      alert(
        "Please fill all required maintenance details."
      );
      return;
    }

    if (Number(formData.quantity) <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

const requestData = {
  block: formData.block,
  floor: formData.floor,
  roomArea: formData.roomArea,
  specificLocation: formData.specificLocation,

  category: formData.category,
  issueType: formData.issueType,
  quantity: Number(formData.quantity),

  priority: formData.priority,

  description: formData.description,
  additionalInfo: formData.additionalInfo,
};
    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/api/maintenance/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(response)
        );
      }

      alert(
        "Maintenance request submitted successfully!"
      );

      navigate("/maintenance/requests");
    } catch (error) {
      console.error(
        "Maintenance request error:",
        error
      );

      if (error instanceof TypeError) {
        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        alert(
          error.message ||
            "Unable to submit maintenance request."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="maintenance-page">

      {/* HEADER */}

      <header className="maintenance-header">

        <div className="maintenance-brand">

          <button
            className="maintenance-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ←
          </button>

          <div>
            <h1>Maintenance Request</h1>

            <p>
              Report repair and maintenance issues
            </p>
          </div>

        </div>

        <div className="maintenance-header-right">

          <div className="maintenance-user">

            <div className="maintenance-avatar">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {displayName}
              </strong>

              <span>
                {department}
              </span>
            </div>

          </div>

          <button
            className="maintenance-requests-btn"
            onClick={() =>
              navigate("/maintenance/requests")
            }
          >
            My Requests →
          </button>

        </div>

      </header>

      <main className="maintenance-content">

        <div className="maintenance-layout">

          {/* LEFT */}

          <div className="maintenance-left">

            {/* REQUEST INFORMATION */}

            <section className="maintenance-card">

              <div className="maintenance-section-heading">

                <div className="maintenance-section-icon">
                  👤
                </div>

                <div>
                  <h2>Request Information</h2>

                  <p>
                    Details are automatically taken from your account
                  </p>
                </div>

              </div>

              <div className="maintenance-requester-grid">

                <div className="maintenance-readonly">
                  <label>Requested By</label>
                  <div>{displayName}</div>
                </div>

                {/* <div className="maintenance-readonly">
                  <label>Designation</label>
                  <div>Head of Department</div>
                </div> */}

                <div className="maintenance-readonly">
                  <label>Department</label>
                  <div>{department}</div>
                </div>

              </div>

            </section>

            {/* LOCATION */}

            <section className="maintenance-card">

              <div className="maintenance-section-heading">

                <div className="maintenance-section-icon">
                  📍
                </div>

                <div>
                  <h2>Location Details</h2>

                  <p>
                    Tell us exactly where the issue is located
                  </p>
                </div>

              </div>

              <div className="maintenance-form-row">

                <div className="maintenance-form-group">

                  <label>Block</label>

                  <select
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select block
                    </option>

                    <option value="Block - 2">
                      Block - 2
                    </option>

                    <option value="Block - 3">
                      Block - 3
                    </option>

                    <option value="Block - 4">
                      Block - 4
                    </option>

                    <option value="Hostel">
                      Hostel
                    </option>

                    <option value="Administrative Block">
                      Administrative Block
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>

                <div className="maintenance-form-group">

                  <label>Floor</label>

                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select floor
                    </option>

                    <option value="Ground Floor">
                      Ground Floor
                    </option>

                    <option value="1st Floor">
                      1st Floor
                    </option>

                    <option value="2nd Floor">
                      2nd Floor
                    </option>

                    <option value="3rd Floor">
                      3rd Floor
                    </option>

                    <option value="4th Floor">
                      4th Floor
                    </option>
                  </select>

                </div>

              </div>

              <div className="maintenance-form-row">

                <div className="maintenance-form-group">

                  <label>Room / Area</label>

                  <input
                    type="text"
                    name="roomArea"
                    value={formData.roomArea}
                    onChange={handleChange}
                    placeholder="Example: CSE Lab - 204"
                    required
                  />

                </div>

                <div className="maintenance-form-group">

                  <label>
                    Specific Location
                  </label>

                  <input
                    type="text"
                    name="specificLocation"
                    value={formData.specificLocation}
                    onChange={handleChange}
                    placeholder="Example: Near projector table"
                  />

                </div>

              </div>

            </section>

            {/* ISSUE */}

            <section className="maintenance-card">

              <div className="maintenance-section-heading">

                <div className="maintenance-section-icon">
                  🔧
                </div>

                <div>
                  <h2>Issue Details</h2>

                  <p>
                    Provide details about the repair required
                  </p>
                </div>

              </div>

              <div className="maintenance-form-row">

                <div className="maintenance-form-group">

                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {Object.keys(categoryItems).map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div className="maintenance-form-group">

                  <label>
                    Affected Item
                  </label>

                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    disabled={!formData.category}
                    required
                  >
                    <option value="">
                      {formData.category
                        ? "Select item"
                        : "Select category first"}
                    </option>

                    {(
                      categoryItems[
                        formData.category
                      ] || []
                    ).map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              <div className="maintenance-form-row">

                <div className="maintenance-form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                  />

                </div>

                <div className="maintenance-form-group">

                  <label>Priority</label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>
                  </select>

                </div>

              </div>

              <div className="maintenance-form-group full">

                <label>
                  Problem Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the problem clearly..."
                  rows="5"
                  required
                />

              </div>

            </section>

            {/* ADDITIONAL */}

            <section className="maintenance-card">

              <div className="maintenance-section-heading">

                <div className="maintenance-section-icon">
                  📝
                </div>

                <div>
                  <h2>
                    Additional Information
                  </h2>

                  <p>
                    Add any additional instructions
                  </p>
                </div>

              </div>

              <textarea
                className="maintenance-additional-textarea"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Example: Please complete the repair before the next class..."
                rows="4"
              />

            </section>

          </div>

          {/* RIGHT SUMMARY */}

          <aside className="maintenance-summary">

            <div className="maintenance-summary-card">

              <div className="maintenance-summary-header">

                <div>
                  <span>
                    REQUEST SUMMARY
                  </span>

                  <h2>
                    Maintenance
                  </h2>
                </div>

                <div className="maintenance-pending">
                  Pending
                </div>

              </div>

              <div className="maintenance-summary-section">

                <span>
                  Department
                </span>

                <strong>
                  {department}
                </strong>

              </div>

              <div className="maintenance-summary-section">

                <span>
                  Requested By
                </span>

                <strong>
                  {displayName}
                </strong>

                <small>
                  Head of Department
                </small>

              </div>

              <div className="maintenance-summary-divider" />

              <div className="maintenance-summary-section">

                <span>
                  LOCATION
                </span>

                <strong>
                  {formData.block || "Block"}
                </strong>

                <small>
                  {formData.floor || "Floor"} •{" "}
                  {formData.roomArea || "Room / Area"}
                </small>

              </div>

              <div className="maintenance-summary-section">

                <span>
                  ISSUE
                </span>

                <strong>
                  {formData.issueType ||
                    "Item not selected"}
                </strong>

                <small>
                  {formData.category ||
                    "Category not selected"}
                  {" • "}
                  Qty: {formData.quantity}
                </small>

              </div>

              <div className="maintenance-summary-section">

                <span>
                  PRIORITY
                </span>

                <strong>
                  {formData.priority}
                </strong>

              </div>

              <div className="maintenance-approval-note">

                <span>ⓘ</span>

                <p>
                  Your maintenance request will be
                  sent to the concerned maintenance
                  team for action.
                </p>

              </div>

              <button
                type="button"
                className="maintenance-submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Maintenance Request"}

                {!submitting && (
                  <span>→</span>
                )}
              </button>

              <button
                type="button"
                className="maintenance-cancel-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Cancel
              </button>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Maintenance;