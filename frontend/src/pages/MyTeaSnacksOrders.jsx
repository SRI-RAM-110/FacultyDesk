import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/MyTeaSnacksOrders.css";

function MyTeaSnacksOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const storedFaculty =
        localStorage.getItem("faculty");

      if (!storedFaculty) {
        setError(
          "Faculty information not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const faculty = JSON.parse(storedFaculty);

      // Database primary key
      const facultyId = faculty.id;

      if (!facultyId) {
        setError(
          "Faculty database ID not found."
        );
        setLoading(false);
        return;
      }

      const response = await API.get(
        `/tea-snacks/orders/faculty/${facultyId}`
      );

      setOrders(response.data);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load your orders."
      );

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";

      case "REJECTED":
        return "status-rejected";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  return (
    <div className="my-tea-orders-page">

      {/* HEADER */}

      <header className="my-orders-header">

        <div>
          <p className="my-orders-label">
            FACULTY SERVICES
          </p>

          <h1>
            My Tea & Snacks Orders
          </h1>

          <p>
            View and track your refreshment orders.
          </p>
        </div>

        <button
          className="my-orders-back-button"
          onClick={() =>
            navigate("/tea-snacks")
          }
        >
          ← Tea & Snacks
        </button>

      </header>

      {/* LOADING */}

      {loading && (
        <div className="orders-message">
          <div className="loading-spinner" />
          <p>Loading your orders...</p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="orders-message error-message">
          <h3>
            Unable to load orders
          </h3>

          <p>{error}</p>

          <button
            onClick={fetchOrders}
          >
            Try Again
          </button>
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div className="orders-message">

            <div className="empty-order-icon">
              ☕
            </div>

            <h3>
              No orders yet
            </h3>

            <p>
              You haven't placed any Tea & Snacks
              orders yet.
            </p>

            <button
              onClick={() =>
                navigate("/tea-snacks")
              }
            >
              Browse Menu
            </button>

          </div>
        )}

      {/* ORDERS */}

      {!loading &&
        !error &&
        orders.length > 0 && (

          <main className="orders-list">

            {orders.map((order) => (

              <div
                className="tea-order-card"
                key={order.id}
              >

                {/* ORDER HEADER */}

                <div className="tea-order-top">

                  <div>

                    <span className="order-id-label">
                      Order ID
                    </span>

                    <h2>
                      {order.orderId}
                    </h2>

                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* ORDER DETAILS */}

                <div className="tea-order-details">

                  <div className="order-detail">

                    <span>
                      Booking Date
                    </span>

                    <strong>
                      {formatDate(
                        order.bookingDate
                      )}
                    </strong>

                  </div>

                  <div className="order-detail">

                    <span>
                      Booking Time
                    </span>

                    <strong>
                      {formatTime(
                        order.bookingTime
                      )}
                    </strong>

                  </div>

                  <div className="order-detail">

                    <span>
                      Purpose
                    </span>

                    <strong>
                      {order.purpose}
                    </strong>

                  </div>

                  <div className="order-detail">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{order.totalPrice}
                    </strong>

                  </div>

                </div>

                {/* ITEMS */}

                <div className="ordered-items">

                  <h3>
                    Ordered Items
                  </h3>

                  <div className="ordered-items-list">

                    {order.items?.map(
                      (item) => (

                        <div
                          className="ordered-item"
                          key={item.id}
                        >

                          <div className="ordered-item-left">

                            <div className="ordered-item-icon">
                              ☕
                            </div>

                            <div>

                              <strong>
                                {item.itemName}
                              </strong>

                              <span>
                                ₹{item.unitPrice} ×{" "}
                                {item.quantity}
                              </span>

                            </div>

                          </div>

                          <strong>
                            ₹{item.totalPrice}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* INSTRUCTIONS */}

                {order.instructions && (
                  <div className="order-instructions">

                    <span>
                      Special Instructions
                    </span>

                    <p>
                      {order.instructions}
                    </p>

                  </div>
                )}

              </div>

            ))}

          </main>
        )}

    </div>
  );
}

export default MyTeaSnacksOrders;