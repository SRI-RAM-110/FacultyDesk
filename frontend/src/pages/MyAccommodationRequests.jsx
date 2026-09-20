import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/MyAccommodationRequests.css";

function MyAccommodationRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const faculty = JSON.parse(
    localStorage.getItem("faculty") || "null"
  );

  useEffect(() => {
    if (!faculty) {
      navigate("/login");
      return;
    }

    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await API.get(
        `/accommodation/requests/faculty/${faculty.id}`
      );

      setRequests(response.data);
    } catch (error) {
      console.error(
        "Accommodation Request Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          `Request failed with status ${
            error.response?.status || "unknown"
          }`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  const getStatusClass = (status) => {
    if (!status) return "";

    return status.toLowerCase();
  };

  return (
    <div className="my-accommodation-page">

      {/* ================= HEADER ================= */}

      <header className="my-accommodation-header">

        <div>
          <h1>My Accommodation Requests</h1>

          <p>
            View your accommodation requests and their
            current status
          </p>
        </div>

        <div className="header-actions">

          <button
            className="new-request-btn"
            onClick={() =>
              navigate("/accommodation")
            }
          >
            + New Request
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

      {/* ================= MAIN CONTENT ================= */}

      <main className="my-accommodation-container">

        {/* Loading */}

        {loading ? (

          <div className="empty-state">

            <p>
              Loading your requests...
            </p>

          </div>

        ) : requests.length === 0 ? (

          /* ================= NO REQUESTS ================= */

          <div className="empty-state">

            <div className="empty-icon">
              🏠
            </div>

            <h2>
              No Accommodation Requests
            </h2>

            <p>
              You haven't submitted any
              accommodation requests yet.
            </p>

            <button
              className="new-request-btn"
              onClick={() =>
                navigate("/accommodation")
              }
            >
              Request Accommodation
            </button>

          </div>

        ) : (

          /* ================= REQUEST LIST ================= */

          <div className="requests-list">

            {requests.map((request) => (

              <div
                className="accommodation-request-card"
                key={request.id}
              >

                {/* ================= CARD HEADER ================= */}

                <div className="request-card-header">

                  <div>

                    <h2>
                      {request.room?.hostel ||
                        "Hostel"}{" "}
                      —{" "}
                      {request.room?.roomName ||
                        "Guest Room"}
                    </h2>

                    <p>
                      {request.room?.roomType ||
                        "-"}{" "}
                      Room
                    </p>

                  </div>

                  <span
                    className={`request-status ${getStatusClass(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </div>

                {/* ================= DETAILS ================= */}

                <div className="request-details">

                  <div className="detail-item">

                    <span>
                      Check-in
                    </span>

                    <strong>
                      {formatDate(
                        request.checkIn
                      )}
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Check-out
                    </span>

                    <strong>
                      {formatDate(
                        request.checkOut
                      )}
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Guests
                    </span>

                    <strong>
                      {request.guests}
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Room Type
                    </span>

                    <strong>
                      {request.room?.roomType ||
                        "-"}
                    </strong>

                  </div>

                </div>

                {/* ================= PURPOSE ================= */}

                <div className="request-purpose">

                  <span>
                    Purpose
                  </span>

                  <p>
                    {request.purpose ||
                      "-"}
                  </p>

                </div>

                {/* ================= FACILITIES ================= */}

                {request.room?.facilities && (

                  <div className="request-facilities">

                    <span>
                      Facilities
                    </span>

                    <p>
                      {request.room.facilities}
                    </p>

                  </div>

                )}

                {/* ================= ROOM INFORMATION ================= */}

                <div className="request-room-info">

                  <div>

                    <span>
                      Hostel
                    </span>

                    <strong>
                      {request.room?.hostel ||
                        "-"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Room
                    </span>

                    <strong>
                      {request.room?.roomName ||
                        "-"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Capacity
                    </span>

                    <strong>
                      {request.room?.capacity
                        ? `${request.room.capacity} Guests`
                        : "-"}
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

export default MyAccommodationRequests;