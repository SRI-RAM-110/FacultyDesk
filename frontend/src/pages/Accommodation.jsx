import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Accommodation.css";

function Accommodation() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    purpose: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const faculty = JSON.parse(
    localStorage.getItem("faculty") || "null"
  );

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await API.get(
        "/accommodation/rooms"
      );

      setRooms(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load accommodation rooms");
    } finally {
      setLoading(false);
    }
  };

  const loadRoomBookings = async (roomId) => {
    if (!roomId) {
      setBookings([]);
      return;
    }

    try {
      setLoadingBookings(true);

      const response = await API.get(
        `/accommodation/rooms/${roomId}/bookings`
      );

      setBookings(response.data);
    } catch (error) {
      console.error(
        "Room bookings error:",
        error
      );

      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "roomId") {
      loadRoomBookings(value);

      setFormData((prev) => ({
        ...prev,
        roomId: value,
        checkIn: "",
        checkOut: "",
      }));
    }
  };

  const selectedRoom = rooms.find(
    (room) =>
      String(room.id) ===
      String(formData.roomId)
  );

  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] =
      date.split("-");

    return `${day}-${month}-${year}`;
  };

  const isDateBooked = (date) => {
    if (!date) return false;

    const selectedDate =
      new Date(`${date}T00:00:00`);

    return bookings.some((booking) => {
      const checkIn =
        new Date(
          `${booking.checkIn}T00:00:00`
        );

      const checkOut =
        new Date(
          `${booking.checkOut}T00:00:00`
        );

      return (
        selectedDate >= checkIn &&
        selectedDate < checkOut
      );
    });
  };

  const handleCheckInChange = (e) => {
    const date = e.target.value;

    if (isDateBooked(date)) {
      alert(
        "This date is already booked for the selected room."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      checkIn: date,
      checkOut: "",
    }));
  };

  const handleCheckOutChange = (e) => {
    const date = e.target.value;

    if (isDateBooked(date)) {
      alert(
        "This date is already booked for the selected room."
      );
      return;
    }

    if (
      formData.checkIn &&
      date <= formData.checkIn
    ) {
      alert(
        "Check-out date must be after check-in date."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      checkOut: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!faculty) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!formData.roomId) {
      alert("Please select a room");
      return;
    }

    if (
      !formData.checkIn ||
      !formData.checkOut
    ) {
      alert(
        "Please select check-in and check-out dates"
      );
      return;
    }

    if (
      !formData.checkIn ||
      !formData.checkOut
    ) {
      return;
    }

    if (
      formData.checkOut <= formData.checkIn
    ) {
      alert(
        "Check-out date must be after check-in date"
      );
      return;
    }

    if (formData.guests < 1) {
      alert("At least one guest is required");
      return;
    }

    if (
      selectedRoom &&
      Number(formData.guests) >
        selectedRoom.capacity
    ) {
      alert(
        `This room can accommodate maximum ${selectedRoom.capacity} guests`
      );
      return;
    }

    // Check every date in requested range
    let currentDate =
      new Date(
        `${formData.checkIn}T00:00:00`
      );

    const endDate =
      new Date(
        `${formData.checkOut}T00:00:00`
      );

    while (currentDate < endDate) {
      const dateString =
        currentDate
          .toISOString()
          .split("T")[0];

      if (isDateBooked(dateString)) {
        alert(
          `The room is already booked on ${formatDate(
            dateString
          )}. Please select different dates.`
        );
        return;
      }

      currentDate.setDate(
        currentDate.getDate() + 1
      );
    }

    try {
      setSubmitting(true);

      await API.post(
        "/accommodation/requests",
        {
          facultyId: faculty.id,
          roomId: Number(formData.roomId),
          accommodationType:
            selectedRoom?.roomType,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: Number(formData.guests),
          purpose: formData.purpose,
        }
      );

      alert(
        "Accommodation request submitted successfully"
      );

      setFormData({
        roomId: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        purpose: "",
      });

      setBookings([]);

    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to submit accommodation request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="accommodation-page">

      {/* ================= HEADER ================= */}

      <header className="accommodation-header">

        <div>
          <h1>Accommodation</h1>

          <p>
            Request guest accommodation at
            the college hostels
          </p>
        </div>

        <div className="accommodation-header-actions">

          <button
            className="my-requests-btn"
            onClick={() =>
              navigate(
                "/my-accommodation-requests"
              )
            }
          >
            My Requests
          </button>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="accommodation-container">

        <section className="accommodation-card">

          <div className="section-heading">

            <h2>
              Request Accommodation
            </h2>

            <p>
              Select an available guest room
              and provide your stay details.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* ================= ROOM ================= */}

            <div className="form-group">

              <label>
                Select Guest Room
              </label>

              {loading ? (

                <p className="loading-text">
                  Loading rooms...
                </p>

              ) : (

                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select a guest room
                  </option>

                  {rooms.map((room) => (

                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.hostel} —{" "}
                      {room.roomName} —{" "}
                      {room.roomType}
                    </option>

                  ))}

                </select>

              )}

            </div>

            {/* ================= ROOM INFO ================= */}

            {selectedRoom && (

              <div className="room-info-card">

                <h3>
                  {selectedRoom.hostel} —{" "}
                  {selectedRoom.roomName}
                </h3>

                <div className="room-info-grid">

                  <div>
                    <span>
                      Room Type
                    </span>

                    <strong>
                      {selectedRoom.roomType}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Capacity
                    </span>

                    <strong>
                      {selectedRoom.capacity}{" "}
                      Guests
                    </strong>
                  </div>

                  <div>
                    <span>
                      Facilities
                    </span>

                    <strong>
                      {selectedRoom.facilities}
                    </strong>
                  </div>

                </div>

              </div>

            )}

            {/* ================= BOOKED DATES ================= */}

            {formData.roomId && (

              <div className="booked-dates-card">

                <div className="booked-dates-header">

                  <div>
                    <h3>
                      Booked Dates
                    </h3>

                    <p>
                      Existing reservations
                      for this room
                    </p>
                  </div>

                </div>

                {loadingBookings ? (

                  <p className="booking-loading">
                    Checking booked dates...
                  </p>

                ) : bookings.length === 0 ? (

                  <div className="no-bookings">

                    <span>✓</span>

                    <p>
                      No bookings for this
                      room
                    </p>

                  </div>

                ) : (

                  <div className="booked-dates-list">

                    {bookings.map(
                      (booking) => (

                        <div
                          className="booked-date-item"
                          key={booking.id}
                        >

                          <div>

                            <strong>
                              {formatDate(
                                booking.checkIn
                              )}
                            </strong>

                            <span>
                              {" "}to{" "}
                            </span>

                            <strong>
                              {formatDate(
                                booking.checkOut
                              )}
                            </strong>

                          </div>

                          <span className="booked-label">
                            Booked
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

            {/* ================= DATES ================= */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Check-in Date
                </label>

                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={
                    handleCheckInChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Check-out Date
                </label>

                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={
                    handleCheckOutChange
                  }
                  required
                />

              </div>

            </div>

            {/* ================= GUESTS ================= */}

            <div className="form-group">

              <label>
                Number of Guests
              </label>

              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              >

                <option value="1">
                  1 Guest
                </option>

                <option value="2">
                  2 Guests
                </option>

              </select>

            </div>

            {/* ================= PURPOSE ================= */}

            <div className="form-group">

              <label>
                Purpose of Stay
              </label>

              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Enter the purpose of your stay"
                rows="4"
                required
              />

            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              className="submit-accommodation-btn"
              disabled={submitting}
            >

              {submitting
                ? "Submitting..."
                : "Submit Accommodation Request"}

            </button>

          </form>

        </section>

        {/* ================= HOSTELS ================= */}

        <section className="hostel-overview">

          <div className="hostel-card">

            <h3>
              Girls Hostel
            </h3>

            <p>
              2 Guest Rooms
            </p>

            <span>
              1 AC • 1 Non-AC
            </span>

          </div>

          <div className="hostel-card">

            <h3>
              Boys Hostel
            </h3>

            <p>
              2 Guest Rooms
            </p>

            <span>
              1 AC • 1 Non-AC
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Accommodation;