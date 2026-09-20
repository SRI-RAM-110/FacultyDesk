import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/SeminarHall.css";

function SeminarHall() {
  const navigate = useNavigate();

  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    hallId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    {
      start: "09:00",
      end: "10:00",
      label: "09:00 AM – 10:00 AM",
    },
    {
      start: "10:00",
      end: "11:00",
      label: "10:00 AM – 11:00 AM",
    },
    {
      start: "11:00",
      end: "12:00",
      label: "11:00 AM – 12:00 PM",
    },
    {
      start: "12:00",
      end: "13:00",
      label: "12:00 PM – 01:00 PM",
    },
    {
      start: "13:00",
      end: "14:00",
      label: "01:00 PM – 02:00 PM",
    },
    {
      start: "14:00",
      end: "15:00",
      label: "02:00 PM – 03:00 PM",
    },
    {
      start: "15:00",
      end: "16:00",
      label: "03:00 PM – 04:00 PM",
    },
    {
      start: "16:00",
      end: "17:00",
      label: "04:00 PM – 05:00 PM",
    },
  ];

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      const response = await API.get("/seminar/halls");
      setHalls(response.data);
    } catch (error) {
      console.error("Seminar halls error:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unable to load seminar halls"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (hallId, bookingDate) => {
    if (!hallId || !bookingDate) {
      setBookings([]);
      return;
    }

    setLoadingSlots(true);

    try {
      const response = await API.get(
        `/seminar/bookings/hall/${hallId}`,
        {
          params: {
            bookingDate,
          },
        }
      );

      setBookings(response.data);
    } catch (error) {
      console.error("Availability error:", error);

      setBookings([]);

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to check hall availability"
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    if (name === "hallId" || name === "bookingDate") {
      const hallId =
        name === "hallId"
          ? value
          : formData.hallId;

      const bookingDate =
        name === "bookingDate"
          ? value
          : formData.bookingDate;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        startTime: "",
        endTime: "",
      }));

      loadBookings(hallId, bookingDate);
    }
  };

  const selectTimeSlot = (slot) => {
    if (isSlotBooked(slot)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      startTime: slot.start,
      endTime: slot.end,
    }));
  };

  const isSlotBooked = (slot) => {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time
      .substring(0, 5)
      .split(":")
      .map(Number);

    return hours * 60 + minutes;
  };

  const slotStart = timeToMinutes(slot.start);
  const slotEnd = timeToMinutes(slot.end);

  return bookings.some((booking) => {
    if (booking.status === "CANCELLED") {
      return false;
    }

    const bookingStart = timeToMinutes(
      booking.startTime
    );

    const bookingEnd = timeToMinutes(
      booking.endTime
    );

    return (
      slotStart < bookingEnd &&
      slotEnd > bookingStart
    );
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const faculty = JSON.parse(
      localStorage.getItem("faculty")
    );

    if (!faculty?.id) {
      alert("Faculty session not found. Please login again.");
      navigate("/login");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      alert("Please select an available time slot.");
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/seminar/bookings", {
        facultyId: faculty.id,
        hallId: Number(formData.hallId),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
      });

      alert(
        "Seminar hall booking submitted successfully."
      );

      setFormData({
        hallId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
      });

      setBookings([]);
    } catch (error) {
      console.error("Booking error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Booking failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="seminar-page">

      <header className="seminar-header">

        <div>
          <h1>Seminar Hall Booking</h1>

          <p>
            Book a seminar hall for your faculty activities
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      <main className="seminar-container">

        <section className="booking-card">

          <div className="booking-card-header">

            <div>
              <h2>Request a Hall</h2>

              <p className="section-description">
                Select a hall, date and available time slot.
              </p>
            </div>

            <button
              className="my-bookings-btn"
              onClick={() =>
                navigate("/my-seminar-bookings")
              }
            >
              My Seminar Bookings
            </button>

          </div>

          {loading ? (
            <p>Loading seminar halls...</p>
          ) : halls.length === 0 ? (
            <p>
              No seminar halls are currently available.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* HALL */}

              <div className="form-group">

                <label>
                  Select Seminar Hall
                </label>

                <select
                  name="hallId"
                  value={formData.hallId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a seminar hall
                  </option>

                  {halls.map((hall) => (
                    <option
                      key={hall.id}
                      value={hall.id}
                    >
                      {hall.hallName} — Capacity{" "}
                      {hall.capacity}
                    </option>
                  ))}

                </select>

              </div>

              {/* DATE */}

              <div className="form-group">

                <label>
                  Booking Date
                </label>

                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* TIME SLOTS */}

              {formData.hallId &&
                formData.bookingDate && (
                  <div className="slot-section">

                    <div className="slot-header">

                      <div>
                        <h3>
                          Available Time Slots
                        </h3>

                        <p>
                          Select an available slot
                        </p>
                      </div>

                    </div>

                    {loadingSlots ? (
                      <p className="slot-loading">
                        Checking availability...
                      </p>
                    ) : (
                      <div className="slot-grid">

                        {timeSlots.map((slot) => {

                          const booked =
                            isSlotBooked(slot);

                          const selected =
                            formData.startTime ===
                              slot.start &&
                            formData.endTime ===
                              slot.end;

                          return (
                            <button
                              type="button"
                              key={slot.start}
                              className={`time-slot ${
                                booked
                                  ? "booked"
                                  : selected
                                  ? "selected"
                                  : "available"
                              }`}
                              disabled={booked}
                              onClick={() =>
                                selectTimeSlot(slot)
                              }
                            >

                              <span>
                                {slot.label}
                              </span>

                              <small>
                                {booked
                                  ? "Booked"
                                  : selected
                                  ? "Selected"
                                  : "Available"}
                              </small>

                            </button>
                          );
                        })}

                      </div>
                    )}

                  </div>
                )}

              {/* PURPOSE */}

              <div className="form-group">

                <label>
                  Purpose
                </label>

                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Enter the purpose of the booking"
                  rows="4"
                  maxLength="500"
                  required
                />

              </div>

              <button
                type="submit"
                className="submit-booking-btn"
                disabled={
                  submitting ||
                  !formData.startTime
                }
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Booking Request"}
              </button>

            </form>
          )}

        </section>

        {/* HALL CARDS */}

        <section className="halls-section">

          <h2>All Seminar Halls</h2>

          <div className="hall-grid">

            {halls.map((hall) => (

              <div
                className="hall-card"
                key={hall.id}
              >

                <h3>{hall.hallName}</h3>

                <p>
                  📍 {hall.location}
                </p>

                <p>
                  👥 Capacity: {hall.capacity}
                </p>

                {hall.facilities && (
                  <p>
                    🛠 {hall.facilities}
                  </p>
                )}

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default SeminarHall;