import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/MaintenanceRequests.css";

const API_BASE_URL = "http://localhost:8080";

function MaintenanceRequests() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const facultyData = localStorage.getItem("faculty");

  let faculty = null;

  try {
    faculty = facultyData ? JSON.parse(facultyData) : null;
  } catch {
    faculty = null;
  }

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const displayName = faculty?.name || "Faculty Member";
  const department =
    faculty?.branch || "Department Not Available";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/maintenance/requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load requests. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        if (err instanceof TypeError) {
          setError(
            "Unable to connect to the server. Please make sure the backend is running."
          );
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [token, navigate]);

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;

    return requests.filter(
      (request) =>
        request.status?.toLowerCase() ===
        filter.toLowerCase()
    );
  }, [requests, filter]);

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

  const statusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "maintenance-status-resolved";

      case "In Progress":
        return "maintenance-status-progress";

      case "Rejected":
        return "maintenance-status-rejected";

      case "Cancelled":
        return "maintenance-status-cancelled";

      default:
        return "maintenance-status-pending";
    }
  };

  return (
    <div className="maintenance-requests-page">

      <header className="maintenance-header">

        <div className="maintenance-brand">

          <button
            className="maintenance-back-button"
            onClick={() =>
              navigate("/maintenance")
            }
          >
            ←
          </button>

          <div>
            <h1>My Maintenance Requests</h1>

            <p>
              Track repair and maintenance requests submitted by you
            </p>
          </div>

        </div>

        <button
          className="maintenance-requests-btn"
          onClick={() =>
            navigate("/maintenance")
          }
        >
          + New Request
        </button>

      </header>

      <main className="maintenance-requests-content">

        <div className="maintenance-request-filters">

          {[
            ["all", "All"],
            ["Pending", "Pending"],
            ["In Progress", "In Progress"],
            ["Resolved", "Resolved"],
            ["Rejected", "Rejected"],
            ["Cancelled", "Cancelled"],
          ].map(([value, label]) => (

            <button
              key={value}
              className={
                filter === value
                  ? "maintenance-filter active"
                  : "maintenance-filter"
              }
              onClick={() => setFilter(value)}
            >
              {label}
            </button>

          ))}

        </div>

        {loading && (
          <div className="maintenance-message">
            Loading your maintenance requests...
          </div>
        )}

        {!loading && error && (
          <div className="maintenance-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredRequests.length === 0 && (

            <div className="maintenance-message">

              <h3>
                No maintenance requests found
              </h3>

              <p>
                Your submitted repair requests will
                appear here.
              </p>

              <button
                className="maintenance-view-btn"
                onClick={() =>
                  navigate("/maintenance")
                }
              >
                Create Maintenance Request →
              </button>

            </div>
          )}

        {!loading &&
          !error &&
          filteredRequests.length > 0 && (

            <div className="maintenance-request-list">

              {filteredRequests.map((request) => (

                <div
                  className="maintenance-request-card"
                  key={request.id}
                >

                  <div className="maintenance-request-top">

                    <div>

                      <span>
                        MR-
                        {String(request.id).padStart(
                          4,
                          "0"
                        )}
                      </span>

                      <h3>
                        {request.issueType}
                      </h3>

                    </div>

                    <strong
                      className={`maintenance-request-status ${statusClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </strong>

                  </div>

                  <div className="maintenance-request-location">

                    <div>
                      <span>LOCATION</span>

                      <strong>
                        {request.block}
                      </strong>

                      <small>
                        {request.floor} •{" "}
                        {request.roomArea}
                      </small>
                    </div>

                    <div>
                      <span>CATEGORY</span>

                      <strong>
                        {request.category}
                      </strong>

                      <small>
                        Quantity: {request.quantity}
                      </small>
                    </div>

                    <div>
                      <span>PRIORITY</span>

                      <strong>
                        {request.priority}
                      </strong>

                      <small>
                        {formatDate(
                          request.createdAt
                        )}
                      </small>
                    </div>

                  </div>

                  <div className="maintenance-request-description">

                    <span>
                      PROBLEM
                    </span>

                    <p>
                      {request.description}
                    </p>

                  </div>

                  <div className="maintenance-request-bottom">

                    <div>
                      <span>
                        Requested By
                      </span>

                      <strong>
                        {request.requestedBy ||
                          displayName}
                      </strong>

                      <small>
                        {request.department ||
                          department}
                      </small>
                    </div>

                    <button
                      className="maintenance-view-btn"
                      onClick={() =>
                        navigate(
                          `/maintenance/requests/${request.id}`
                        )
                      }
                    >
                      View Details →
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>

    </div>
  );
}

export default MaintenanceRequests;