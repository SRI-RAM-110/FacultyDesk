import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/TransportRequests.css";

const API_BASE_URL = "http://localhost:8080";

function TransportRequests() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const facultyData = localStorage.getItem("faculty");

  let faculty = null;

  try {
    faculty = facultyData ? JSON.parse(facultyData) : null;
  } catch (error) {
    console.error("Invalid faculty data:", error);
  }

  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const displayName = faculty?.name || "Faculty Member";
  const department = faculty?.branch || "Department Not Available";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /*
   * =========================================
   * FETCH MY TRANSPORT REQUESTS
   * =========================================
   */

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/transport/requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (response.status === 403) {
          throw new Error(
            "You are not authorized to view transport requests."
          );
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load requests. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch transport requests:", err);

        if (err instanceof TypeError) {
          setError(
            "Unable to connect to the server. Please make sure the backend is running."
          );
        } else {
          setError(
            err.message ||
              "Unable to load transport requests. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, navigate]);

  /*
   * =========================================
   * DATE HELPERS
   * =========================================
   */

  const getRequestDate = (request) => {
    return new Date(
      `${request.departureDate}T${request.departureTime || "00:00"}`
    );
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /*
   * =========================================
   * FILTER REQUESTS
   * =========================================
   */

  const categorizedRequests = useMemo(() => {
    const upcoming = [];
    const pending = [];
    const previous = [];
    const rejectedCancelled = [];

    requests.forEach((request) => {
      const requestDate = getRequestDate(request);
      const status = request.status;

      if (
        status === "Rejected" ||
        status === "Cancelled"
      ) {
        rejectedCancelled.push(request);
        return;
      }

      if (status === "Pending") {
        pending.push(request);
        return;
      }

      if (
        status === "Approved" &&
        requestDate >= today
      ) {
        upcoming.push(request);
        return;
      }

      previous.push(request);
    });

    return {
      upcoming,
      pending,
      previous,
      rejectedCancelled,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    switch (activeFilter) {
      case "upcoming":
        return categorizedRequests.upcoming;

      case "pending":
        return categorizedRequests.pending;

      case "previous":
        return categorizedRequests.previous;

      case "rejected":
        return categorizedRequests.rejectedCancelled;

      default:
        return requests;
    }
  }, [
    activeFilter,
    requests,
    categorizedRequests,
  ]);

  /*
   * =========================================
   * FORMAT DATE
   * =========================================
   */

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * =========================================
   * STATUS CLASS
   * =========================================
   */

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";

      case "Rejected":
        return "status-rejected";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  /*
   * =========================================
   * REQUEST CARD
   * =========================================
   */

  const RequestCard = ({ request }) => {
    return (
      <div className="transport-request-card">

        <div className="request-card-top">

          <div>
            <span className="request-id">
              TR-{String(request.id).padStart(4, "0")}
            </span>

            <h3>
              {request.purpose}
            </h3>
          </div>

          <span
            className={`request-status ${getStatusClass(
              request.status
            )}`}
          >
            {request.status}
          </span>

        </div>

        <div className="request-route">

          <div>
            <span>FROM</span>

            <strong>
              {request.source}
            </strong>
          </div>

          <div className="route-arrow">
            →
          </div>

          <div>
            <span>TO</span>

            <strong>
              {request.destination}
            </strong>
          </div>

        </div>

        <div className="request-details">

          <div>
            <span>Departure</span>

            <strong>
              {formatDate(request.departureDate)}
            </strong>

            <small>
              {request.departureTime || "--"}
            </small>
          </div>

          <div>
            <span>Passengers</span>

            <strong>
              {request.totalPassengers}
            </strong>

            <small>
              {request.students} Students •{" "}
              {request.faculty} Faculty
            </small>
          </div>

          <div>
            <span>Vehicle</span>

            <strong>
              {request.busNumber || "Not Assigned"}
            </strong>

            <small>
              {request.vehicleType || "--"}
            </small>
          </div>

        </div>

        <div className="request-card-bottom">

          <div className="request-user">

            <span>
              Requested By
            </span>

            <strong>
              {request.requestedBy || displayName}
            </strong>

            <small>
              {request.department || department}
            </small>

          </div>

          <button
            className="view-request-btn"
            onClick={() =>
              navigate(
                `/transport/requests/${request.id}`
              )
            }
          >
            View Details →
          </button>

        </div>

      </div>
    );
  };

  /*
   * =========================================
   * UI
   * =========================================
   */

  return (
    <div className="transport-requests-page">

      {/* HEADER */}

      <header className="transport-header">

        <div className="transport-brand">

          <button
            className="back-button"
            onClick={() =>
              navigate("/transport")
            }
          >
            ←
          </button>

          <div>
            <h1>My Transport Requests</h1>

            <p>
              View your submitted transport requests and bookings
            </p>
          </div>

        </div>

        <div className="transport-header-right">

          <div className="transport-user">

            <div className="transport-avatar">
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
            className="my-requests-btn"
            onClick={() =>
              navigate("/transport")
            }
          >
            + New Request
          </button>

        </div>

      </header>

      <main className="transport-requests-content">

        {/* SUMMARY */}

        <section className="request-summary-grid">

          <div className="request-stat">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="request-stat">
            <span>Upcoming</span>
            <strong>
              {categorizedRequests.upcoming.length}
            </strong>
          </div>

          <div className="request-stat">
            <span>Pending</span>
            <strong>
              {categorizedRequests.pending.length}
            </strong>
          </div>

          <div className="request-stat">
            <span>Previous</span>
            <strong>
              {categorizedRequests.previous.length}
            </strong>
          </div>

        </section>

        {/* FILTER */}

        <div className="request-filters">

          <button
            className={
              activeFilter === "all"
                ? "request-filter active"
                : "request-filter"
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            All
          </button>

          <button
            className={
              activeFilter === "upcoming"
                ? "request-filter active"
                : "request-filter"
            }
            onClick={() =>
              setActiveFilter("upcoming")
            }
          >
            Upcoming
          </button>

          <button
            className={
              activeFilter === "pending"
                ? "request-filter active"
                : "request-filter"
            }
            onClick={() =>
              setActiveFilter("pending")
            }
          >
            Pending
          </button>

          <button
            className={
              activeFilter === "previous"
                ? "request-filter active"
                : "request-filter"
            }
            onClick={() =>
              setActiveFilter("previous")
            }
          >
            Previous
          </button>

          <button
            className={
              activeFilter === "rejected"
                ? "request-filter active"
                : "request-filter"
            }
            onClick={() =>
              setActiveFilter("rejected")
            }
          >
            Rejected / Cancelled
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="requests-message">
            Loading your transport requests...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="requests-message error">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredRequests.length === 0 && (

            <div className="requests-message empty">

              <h3>
                No transport requests found
              </h3>

              <p>
                Your submitted transport requests
                will appear here.
              </p>

              <button
                className="view-request-btn"
                onClick={() =>
                  navigate("/transport")
                }
              >
                Create Transport Request →
              </button>

            </div>
          )}

        {/* REQUEST LIST */}

        {!loading &&
          !error &&
          filteredRequests.length > 0 && (

            <div className="transport-request-list">

              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))}

            </div>
          )}

      </main>

    </div>
  );
}

export default TransportRequests;