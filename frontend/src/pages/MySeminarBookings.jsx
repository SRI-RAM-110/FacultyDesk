import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/MySeminarBookings.css";

function MySeminarBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const faculty = JSON.parse(
        localStorage.getItem("faculty")
      );

      if (!faculty?.id) {
        navigate("/login");
        return;
      }

      const response = await API.get(
        `/seminar/bookings/faculty/${faculty.id}`
      );

      setBookings(response.data);
    } catch (error) {
      console.error("Booking history error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to load booking history"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="my-bookings-page">

      <header className="my-bookings-header">
        <div>
          <h1>My Seminar Bookings</h1>
          <p>View your seminar hall booking requests</p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/seminar-hall")}
        >
          ← Book a Hall
        </button>
      </header>

      <main className="my-bookings-container">

        {loading ? (
          <div className="booking-message">
            Loading your bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="booking-message">
            <h2>No bookings yet</h2>
            <p>
              You haven't submitted any seminar hall booking requests.
            </p>

            <button
              className="book-now-btn"
              onClick={() => navigate("/seminar-hall")}
            >
              Book a Seminar Hall
            </button>
          </div>
        ) : (
          <div className="booking-list">

            {bookings.map((booking) => (

              <div
                className="booking-card"
                key={booking.id}
              >

                <div className="booking-card-top">

                  <div>
                    <h2>
                      {booking.hall?.hallName ||
                        "Seminar Hall"}
                    </h2>

                    <p>
                      📍 {booking.hall?.location ||
                        "Location unavailable"}
                    </p>
                  </div>

                  <span
                    className={`booking-status ${booking.status?.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="booking-details">

                  <div>
                    <span>Date</span>
                    <strong>
                      {formatDate(booking.bookingDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Time</span>
                    <strong>
                      {booking.startTime} - {booking.endTime}
                    </strong>
                  </div>

                  <div>
                    <span>Purpose</span>
                    <strong>
                      {booking.purpose}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default MySeminarBookings;