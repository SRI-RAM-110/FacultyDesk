import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Transport.css";

const API_BASE_URL = "http://localhost:8080";

function Transport() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const facultyData = localStorage.getItem("faculty");

  let faculty = null;

  try {
    faculty = facultyData ? JSON.parse(facultyData) : null;
  } catch (error) {
    console.error("Invalid faculty data in localStorage:", error);
  }

  const [tripType, setTripType] = useState("roundTrip");

  const [formData, setFormData] = useState({
    purpose: "",
    source: "Narasaraopeta Engineering College",
    pickupPoint: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    returnDate: "",
    returnTime: "",
    students: "",
    facultyCount: "",
    vehiclePreference: "Any Available",
    additionalInfo: "",
  });

  const [showBuses, setShowBuses] = useState(false);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const displayName = faculty?.name || "Faculty Member";
  const department = faculty?.branch || "Department Not Available";

  const totalPassengers =
    Number(formData.students || 0) +
    Number(formData.facultyCount || 0);

  /*
   * ---------------------------------------------------------
   * FORM CHANGE
   * ---------------------------------------------------------
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Existing availability is no longer valid
    // when form details change.
    setShowBuses(false);
    setSelectedBus(null);
    setAvailableBuses([]);
  };

  /*
   * ---------------------------------------------------------
   * TRIP TYPE
   * ---------------------------------------------------------
   */

  const handleTripType = (type) => {
    setTripType(type);

    setShowBuses(false);
    setSelectedBus(null);
    setAvailableBuses([]);

    if (type === "oneWay") {
      setFormData((prev) => ({
        ...prev,
        returnDate: "",
        returnTime: "",
      }));
    }
  };

  /*
   * ---------------------------------------------------------
   * ERROR MESSAGE HANDLER
   * ---------------------------------------------------------
   */

  const getErrorMessage = (response) => {
    if (response.status === 400) {
      return "Invalid transport request. Please check the entered details.";
    }

    if (response.status === 401) {
      return "Your session has expired. Please login again.";
    }

    if (response.status === 403) {
      return "You are not authorized to perform this action.";
    }

    if (response.status === 500) {
      return "Server error occurred. Please try again later.";
    }

    return `Request failed with status ${response.status}.`;
  };

  /*
   * ---------------------------------------------------------
   * CHECK BUS AVAILABILITY
   * ---------------------------------------------------------
   */

  const checkAvailability = async () => {
    // Required field validation
    if (
      !formData.purpose ||
      !formData.destination ||
      !formData.pickupPoint ||
      !formData.departureDate ||
      !formData.departureTime ||
      !formData.students ||
      !formData.facultyCount
    ) {
      alert(
        "Please fill purpose, destination, pickup point, date, time and passenger details."
      );
      return;
    }

    if (
      tripType === "roundTrip" &&
      (!formData.returnDate || !formData.returnTime)
    ) {
      alert("Please select return date and time.");
      return;
    }

    if (totalPassengers <= 0) {
      alert("Passenger count must be greater than 0.");
      return;
    }

    setShowBuses(false);
    setSelectedBus(null);
    setAvailableBuses([]);

    try {
      const params = new URLSearchParams({
        date: formData.departureDate,
        time: formData.departureTime,
        passengers: totalPassengers.toString(),
        vehiclePreference: formData.vehiclePreference,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/transport/available?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        throw new Error(getErrorMessage(response));
      }

      const data = await response.json();

      /*
       * Backend is the source of truth.
       * No frontend filtering.
       * No demo/mock buses.
       */

      setAvailableBuses(Array.isArray(data) ? data : []);
      setShowBuses(true);
      setSelectedBus(null);

      if (!Array.isArray(data) || data.length === 0) {
        alert(
          "No suitable vehicles found. Try another date, time or passenger count."
        );
      }
    } catch (error) {
      console.error("Availability check failed:", error);

      if (error instanceof TypeError) {
        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        alert(
          error.message ||
            "Unable to check vehicle availability. Please try again."
        );
      }
    }
  };

  /*
   * ---------------------------------------------------------
   * SELECT BUS
   * ---------------------------------------------------------
   */

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT TRANSPORT REQUEST
   * ---------------------------------------------------------
   */

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!selectedBus) {
      alert("Please select an available bus.");
      return;
    }

    // Basic validation before submit
    if (
      !formData.purpose ||
      !formData.destination ||
      !formData.pickupPoint ||
      !formData.departureDate ||
      !formData.departureTime ||
      !formData.students ||
      !formData.facultyCount
    ) {
      alert("Please complete all required transport details.");
      return;
    }

    if (
      tripType === "roundTrip" &&
      (!formData.returnDate || !formData.returnTime)
    ) {
      alert("Please select return date and time.");
      return;
    }

    const requestData = {
      requestedBy: displayName,
      department: department,
      purpose: formData.purpose,
      tripType: tripType,
      source: formData.source,
      pickupPoint: formData.pickupPoint,
      destination: formData.destination,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,

      returnDate:
        tripType === "roundTrip"
          ? formData.returnDate
          : null,

      returnTime:
        tripType === "roundTrip"
          ? formData.returnTime
          : null,

      students: Number(formData.students),
      faculty: Number(formData.facultyCount),
      totalPassengers: totalPassengers,

      vehiclePreference: formData.vehiclePreference,

      /*
       * IMPORTANT:
       * Only selected bus ID is sent.
       *
       * Do NOT send:
       * busNumber
       * vehicleType
       * driverName
       * driverPhone
       *
       * Backend will fetch these using busId.
       */
      busId: selectedBus.id,

      additionalInfo: formData.additionalInfo,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/transport/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        throw new Error(getErrorMessage(response));
      }

      /*
       * Backend automatically sets:
       * status = "Pending"
       */

      alert(
        "Transport request submitted successfully! Your request is now pending approval."
      );

      navigate("/transport/requests");
    } catch (error) {
      console.error("Transport request submission failed:", error);

      if (error instanceof TypeError) {
        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        alert(
          error.message ||
            "Unable to submit transport request. Please try again."
        );
      }
    }
  };

  return (
    <div className="transport-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="transport-header">

        <div className="transport-brand">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ←
          </button>

          <div>
            <h1>Transport Request</h1>
            <p>
              Request college transport for official activities
            </p>
          </div>

        </div>

        <div className="transport-header-right">

          <div className="transport-user">

            <div className="transport-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{displayName}</strong>
              <span>{department}</span>
            </div>

          </div>

          <button
            className="my-requests-btn"
            onClick={() => navigate("/transport/requests")}
          >
            My Requests →
          </button>

        </div>

      </header>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="transport-content">

        {/* REQUESTER INFORMATION */}

        <section className="transport-card requester-card">

          <div className="section-heading">

            <div className="section-icon">
              👤
            </div>

            <div>
              <h2>Request Information</h2>
              <p>
                Details are automatically taken from your account
              </p>
            </div>

          </div>

          <div className="requester-grid">

            <div className="readonly-field">
              <label>Requested By</label>

              <div>
                {displayName}
              </div>
            </div>

            {/* <div className="readonly-field">
              <label>Designation</label>

              <div>
                Head of Department
              </div>
            </div> */}

            <div className="readonly-field">
              <label>Requesting Department</label>

              <div>
                {department}
              </div>
            </div>

          </div>

        </section>

        <div className="transport-layout">

          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="transport-left">

            {/* TRIP DETAILS */}

            <section className="transport-card">

              <div className="section-heading">

                <div className="section-icon">
                  🚌
                </div>

                <div>
                  <h2>Trip Details</h2>
                  <p>
                    Enter the details of your transportation requirement
                  </p>
                </div>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="form-group full-width">

                  <label>
                    Purpose / Event
                  </label>

                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="Example: Faculty Development Program"
                    required
                  />

                </div>

                <div className="form-row">

                  <div className="form-group">

                    <label>Source</label>

                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      required
                      id="source"
                    />

                  </div>

                  <div className="form-group">

                    <label>Destination</label>

                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Enter destination"
                      required
                    />

                  </div>

                </div>

                <div className="form-group full-width">

                  <label>
                    Pickup Point
                  </label>

                  <select
                    name="pickupPoint"
                    value={formData.pickupPoint}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select pickup point
                    </option>

                    <option value="Main Gate">
                      Block - 2
                    </option>

                    <option value="Administrative Block">
                      Block - 3
                    </option>

                    <option value="Engineering Block">
                      Block - 4
                    </option>

                    <option value="Hostel">
                      Main Gate
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-group full-width">

                  <label>Trip Type</label>

                  <div className="trip-type">

                    <button
                      type="button"
                      className={
                        tripType === "oneWay"
                          ? "trip-option active"
                          : "trip-option"
                      }
                      onClick={() =>
                        handleTripType("oneWay")
                      }
                    >
                      One Way
                    </button>

                    <button
                      type="button"
                      className={
                        tripType === "roundTrip"
                          ? "trip-option active"
                          : "trip-option"
                      }
                      onClick={() =>
                        handleTripType("roundTrip")
                      }
                    >
                      Round Trip
                    </button>

                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Departure Date
                    </label>

                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      id="dt"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Departure Time
                    </label>

                    <input
                      type="time"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      id="dt"
                      required
                    />

                  </div>

                </div>

                {tripType === "roundTrip" && (

                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Return Date
                      </label>

                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        id="dt"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Return Time
                      </label>

                      <input
                        type="time"
                        name="returnTime"
                        value={formData.returnTime}
                        onChange={handleChange}
                        id="dt"
                        required
                      />

                    </div>

                  </div>

                )}

              </form>

            </section>

            {/* PASSENGER DETAILS */}

            <section className="transport-card">

              <div className="section-heading">

                <div className="section-icon">
                  👥
                </div>

                <div>
                  <h2>Passenger Details</h2>
                  <p>
                    Enter the number of students and faculty travelling
                  </p>
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Number of Students
                  </label>

                  <input
                    type="number"
                    name="students"
                    min="0"
                    value={formData.students}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Number of Faculty
                  </label>

                  <input
                    type="number"
                    name="facultyCount"
                    min="0"
                    value={formData.facultyCount}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />

                </div>

              </div>

              <div className="passenger-total">

                <span>
                  Total Passengers
                </span>

                <strong>
                  {totalPassengers}
                </strong>

              </div>

              <div className="faculty-members-box">

                <div className="faculty-box-header">

                  <div>
                    <strong>
                      Faculty Members
                    </strong>

                    <span>
                      Names and departments
                    </span>
                  </div>

                  <button
                    type="button"
                    className="add-faculty-btn"
                    onClick={() =>
                      alert(
                        "Faculty member selection will be connected to the backend."
                      )
                    }
                  >
                    + Add Faculty
                  </button>

                </div>

                <div className="faculty-placeholder">

                  Add the faculty members who will travel
                  with this request.

                </div>

              </div>

              <div className="form-group full-width">

                <label>
                  Vehicle Preference
                </label>

                <select
                  name="vehiclePreference"
                  value={formData.vehiclePreference}
                  onChange={handleChange}
                >

                  <option value="Any Available">
                    Any Available
                  </option>

                  <option value="Bus">
                    Bus
                  </option>

                  <option value="Electrical Kart">
                    Electrical Kart
                  </option>

                  <option value="Car">
                    Car
                  </option>

                </select>

              </div>

              <button
                type="button"
                className="availability-btn"
                onClick={checkAvailability}
              >
                Check Bus Availability
                <span>→</span>
              </button>

            </section>

            {/* AVAILABILITY */}

            {showBuses && (

              <section className="transport-card availability-card">

                <div className="section-heading">

                  <div className="section-icon">
                    ✓
                  </div>

                  <div>
                    <h2>Available Vehicles</h2>

                    <p>
                      Buses matching your passenger requirement
                    </p>
                  </div>

                </div>

                {availableBuses.length === 0 ? (

                  <div className="no-buses">

                    <strong>
                      No suitable vehicles found
                    </strong>

                    <p>
                      Try another date, time or passenger count.
                    </p>

                  </div>

                ) : (

                  <div className="bus-list">

                    {availableBuses.map((bus) => (

                      <div
                        className={
                          selectedBus?.id === bus.id
                            ? "bus-card selected"
                            : "bus-card"
                        }
                        key={bus.id}
                      >

                        <div className="bus-main">

                          <div className="bus-icon">
                            🚌
                          </div>

                          <div>

                            <h3>
                              {bus.busNumber}
                            </h3>

                            <p>
                              {bus.vehicleType}
                            </p>

                          </div>

                        </div>

                        <div className="bus-info">

                          <div>
                            <span>Capacity</span>

                            <strong>
                              {bus.capacity} Seats
                            </strong>
                          </div>

                          <div>
                            <span>Driver</span>

                            <strong>
                              {bus.driverName}
                            </strong>
                          </div>

                          <div>
                            <span>Contact</span>

                            <strong>
                              {bus.driverPhone}
                            </strong>
                          </div>

                        </div>

                        <button
                          type="button"
                          className="select-bus-btn"
                          onClick={() =>
                            handleSelectBus(bus)
                          }
                        >
                          {selectedBus?.id === bus.id
                            ? "✓ Selected"
                            : "Select Bus"}
                        </button>

                      </div>

                    ))}

                  </div>

                )}

              </section>

            )}

            {/* ADDITIONAL INFO */}

            <section className="transport-card">

              <div className="section-heading">

                <div className="section-icon">
                  📝
                </div>

                <div>
                  <h2>Additional Information</h2>

                  <p>
                    Add any special instructions or requirements
                  </p>
                </div>

              </div>

              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Example: Please arrange pickup from the Main Gate 15 minutes before departure..."
                rows="4"
              />

            </section>

          </div>

          {/* =====================================
              RIGHT SIDE SUMMARY
          ===================================== */}

          <aside className="transport-summary">

            <div className="summary-card">

              <div className="summary-header">

                <div>
                  <span>REQUEST SUMMARY</span>
                  <h2>Transport</h2>
                </div>

                <div className="summary-status">
                  Pending
                </div>

              </div>

              <div className="summary-section">

                <span className="summary-label">
                  Department
                </span>

                <strong>
                  {department}
                </strong>

              </div>

              <div className="summary-section">

                <span className="summary-label">
                  Requested By
                </span>

                <strong>
                  {displayName}
                </strong>

                <small>
                  Head of Department
                </small>

              </div>

              <div className="summary-divider"></div>

              <div className="summary-route">

                <span className="summary-label">
                  ROUTE
                </span>

                <strong>
                  {formData.source || "Source"}
                </strong>

                <span className="route-arrow">
                  ↓
                </span>

                <strong>
                  {formData.destination || "Destination"}
                </strong>

              </div>

              <div className="summary-grid">

                <div>

                  <span>
                    Departure
                  </span>

                  <strong>
                    {formData.departureDate
                      ? new Date(
                          formData.departureDate
                        ).toLocaleDateString("en-IN")
                      : "--"}
                  </strong>

                  <small>
                    {formData.departureTime || "--"}
                  </small>

                </div>

                <div>

                  <span>
                    Passengers
                  </span>

                  <strong>
                    {totalPassengers}
                  </strong>

                  <small>
                    {formData.students || 0} Students
                    {" + "}
                    {formData.facultyCount || 0} Faculty
                  </small>

                </div>

              </div>

              {selectedBus && (

                <div className="selected-bus-summary">

                  <span className="summary-label">
                    SELECTED VEHICLE
                  </span>

                  <strong>
                    {selectedBus.busNumber}
                  </strong>

                  <span>
                    {selectedBus.vehicleType} •{" "}
                    {selectedBus.capacity} Seats
                  </span>

                  <small>
                    Driver: {selectedBus.driverName}
                  </small>

                </div>

              )}

              <div className="approval-note">

                <span>ⓘ</span>

                <p>
                  Your request will be sent to the
                  Vice Principal / AO for approval.
                </p>

              </div>

              <button
                type="button"
                className="submit-request-btn"
                onClick={handleSubmit}
              >
                Submit Transport Request
                <span>→</span>
              </button>

              <button
                type="button"
                className="cancel-request-btn"
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

export default Transport;