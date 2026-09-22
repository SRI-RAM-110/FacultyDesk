import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import "../styles/OrderTeaSnacks.css";

function OrderTeaSnacks() {
  const navigate = useNavigate();
  const location = useLocation();

  const cart = location.state?.cart || [];

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError("Your order is empty.");
      return;
    }

    if (!bookingDate || !bookingTime) {
      setError("Please select booking date and time.");
      return;
    }

    if (!purpose.trim()) {
      setError("Please enter the purpose of the order.");
      return;
    }

    try {
      setLoading(true);

      const storedFaculty = localStorage.getItem("faculty");

if (!storedFaculty) {
  setError("Faculty information not found. Please login again.");
  setLoading(false);
  return;
}

const faculty = JSON.parse(storedFaculty);

// This is the database primary key (Long)
const facultyId = faculty.id;

if (!facultyId) {
  setError("Faculty database ID not found. Please login again.");
  setLoading(false);
  return;
}

      const orderData = {
        facultyId: Number(facultyId),

        items: cart.map((item) => ({
          itemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),

        bookingDate,
        bookingTime,
        purpose: purpose.trim(),
        instructions: instructions.trim(),
      };

      console.log("Tea & Snacks Order:", orderData);

      const response = await API.post(
        "/tea-snacks/orders",
        orderData
      );

      navigate("/my-tea-snacks-orders", {
        state: {
          order: response.data,
        },
      });

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to place the order. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="order-page">

        <div className="empty-order">

          <h2>No items in your order</h2>

          <p>
            Please add some tea or snacks first.
          </p>

          <button
            onClick={() =>
              navigate("/tea-snacks")
            }
          >
            ← Back to Tea & Snacks
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="order-page">

      <header className="order-header">

        <div>

          <p className="order-label">
            TEA & SNACKS
          </p>

          <h1>
            Place Your Order
          </h1>

          <p>
            Provide the details for your refreshment request.
          </p>

        </div>

        <button
          className="order-back-button"
          onClick={() =>
            navigate("/tea-snacks")
          }
        >
          ← Back
        </button>

      </header>

      <main className="order-layout">

        <form
          className="order-form-card"
          onSubmit={handleSubmit}
        >

          <div className="section-heading">

            <h2>
              Order Details
            </h2>

            <span>
              Required information
            </span>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Booking Date <span>*</span>
              </label>

              <input
                type="date"
                value={bookingDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setBookingDate(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                Booking Time <span>*</span>
              </label>

              <input
                type="time"
                value={bookingTime}
                onChange={(e) =>
                  setBookingTime(e.target.value)
                }
                required
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Purpose <span>*</span>
            </label>

            <input
              type="text"
              placeholder="Example: Faculty meeting"
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              maxLength={500}
              required
            />

          </div>

          <div className="form-group">

            <label>
              Special Instructions
            </label>

            <textarea
              placeholder="Any special requirements or instructions..."
              value={instructions}
              onChange={(e) =>
                setInstructions(e.target.value)
              }
              rows="5"
              maxLength={1000}
            />

          </div>

          {error && (
            <div className="order-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="confirm-order-button"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Confirm Order"}
          </button>

        </form>

        <div className="order-summary-card">

          <div className="section-heading">

            <h2>
              Order Summary
            </h2>

            <span>
              {totalItems} item
              {totalItems !== 1 ? "s" : ""}
            </span>

          </div>

          <div className="summary-items">

            {cart.map((item) => (

              <div
                className="summary-item"
                key={item.id}
              >

                <div className="summary-item-icon">
                  {item.icon}
                </div>

                <div className="summary-item-info">

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>

                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

              </div>

            ))}

          </div>

          <div className="summary-divider" />

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{totalPrice}
            </strong>

          </div>

          <div className="summary-note">
            Your order will be submitted for approval.
          </div>

        </div>

      </main>

    </div>
  );
}

export default OrderTeaSnacks;