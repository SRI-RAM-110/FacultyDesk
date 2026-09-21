import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TeaSnacks.css";

const menuItems = [
  {
    id: 1,
    name: "Tea",
    category: "Tea",
    price: 10,
    icon: "☕",
    description: "Freshly prepared hot tea.",
  },
  {
    id: 2,
    name: "Coffee",
    category: "Coffee",
    price: 15,
    icon: "☕",
    description: "Fresh hot coffee.",
  },
  {
    id: 3,
    name: "Masala Tea",
    category: "Tea",
    price: 15,
    icon: "🍵",
    description: "Hot tea blended with aromatic spices.",
  },
  {
    id: 4,
    name: "Ginger Tea",
    category: "Tea",
    price: 15,
    icon: "🍵",
    description: "Refreshing tea with fresh ginger.",
  },
  {
    id: 5,
    name: "Green Tea",
    category: "Tea",
    price: 20,
    icon: "🍵",
    description: "Light and refreshing green tea.",
  },
  {
    id: 6,
    name: "Lemon Tea",
    category: "Tea",
    price: 15,
    icon: "🍋",
    description: "Refreshing tea with lemon.",
  },
  {
    id: 7,
    name: "Black Coffee",
    category: "Coffee",
    price: 20,
    icon: "☕",
    description: "Strong freshly brewed black coffee.",
  },
  {
    id: 8,
    name: "Cold Coffee",
    category: "Coffee",
    price: 30,
    icon: "🥤",
    description: "Chilled and creamy coffee.",
  },
  {
    id: 9,
    name: "Samosa",
    category: "Snacks",
    price: 15,
    icon: "🥟",
    description: "Crispy vegetable samosa.",
  },
  {
    id: 10,
    name: "Veg Puff",
    category: "Snacks",
    price: 20,
    icon: "🥐",
    description: "Flaky puff filled with seasoned vegetables.",
  },
  {
    id: 11,
    name: "Biscuits",
    category: "Snacks",
    price: 10,
    icon: "🍪",
    description: "Assorted biscuits.",
  },
  {
    id: 12,
    name: "Cookies",
    category: "Snacks",
    price: 20,
    icon: "🍪",
    description: "Fresh assorted cookies.",
  },
  {
    id: 13,
    name: "Veg Sandwich",
    category: "Snacks",
    price: 40,
    icon: "🥪",
    description: "Fresh vegetable sandwich.",
  },
  {
    id: 14,
    name: "Bread Pakora",
    category: "Snacks",
    price: 20,
    icon: "🍞",
    description: "Crispy bread pakora served hot.",
  },
  {
    id: 15,
    name: "Mirchi Bajji",
    category: "Snacks",
    price: 20,
    icon: "🌶️",
    description: "Crispy chilli fritter served hot.",
  },
  {
    id: 16,
    name: "Onion Pakoda",
    category: "Snacks",
    price: 25,
    icon: "🧅",
    description: "Crispy onion fritters.",
  },
  {
    id: 17,
    name: "Tea & Biscuit Combo",
    category: "Combos",
    price: 20,
    icon: "☕",
    description: "Hot tea served with biscuits.",
  },
  {
    id: 18,
    name: "Tea & Samosa Combo",
    category: "Combos",
    price: 30,
    icon: "☕",
    description: "Hot tea served with a crispy samosa.",
  },
  {
    id: 19,
    name: "Tea & Veg Puff Combo",
    category: "Combos",
    price: 35,
    icon: "🥐",
    description: "Hot tea served with a vegetable puff.",
  },
  {
    id: 20,
    name: "Coffee & Sandwich Combo",
    category: "Combos",
    price: 50,
    icon: "🥪",
    description: "Fresh coffee served with a veg sandwich.",
  },
];

const categories = [
  "All",
  "Tea",
  "Coffee",
  "Snacks",
  "Combos",
];

function TeaSnacks() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === activeCategory
        );

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="tea-snacks-page">

      <header className="tea-snacks-header">

        <div>
          <p className="page-label">
            FACULTY SERVICES
          </p>

          <h1>
            Tea <span>&</span> Snacks
          </h1>

          <p className="page-description">
            Order refreshments for meetings, events and
            other college activities.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="cart-button">
            🛒
            <span>Order</span>

            {totalItems > 0 && (
              <b>{totalItems}</b>
            )}
          </div>

        </div>

      </header>

      <div className="category-filter">

        {categories.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}

      </div>

      <main className="menu-grid">

        {filteredItems.map((item) => {

          const cartItem = cart.find(
            (cartItem) => cartItem.id === item.id
          );

          return (
            <div
              className="menu-card"
              key={item.id}
            >

              <div className="menu-card-top">

                <div className="menu-icon">
                  {item.icon}
                </div>

                <span className="menu-category">
                  {item.category}
                </span>

              </div>

              <div className="menu-card-content">

                <h2>{item.name}</h2>

                <p>{item.description}</p>

                <div className="menu-card-bottom">

                  <div className="menu-price">
                    ₹{item.price}
                    <small> / item</small>
                  </div>

                  {cartItem ? (

                    <div className="quantity-control">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        −
                      </button>

                      <span>
                        {cartItem.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        +
                      </button>

                    </div>

                  ) : (

                    <button
                      className="add-button"
                      onClick={() =>
                        addToCart(item)
                      }
                    >
                      + Add
                    </button>

                  )}

                </div>

              </div>

            </div>
          );
        })}

      </main>

      {cart.length > 0 && (

        <div className="order-summary-bar">

          <div>

            <strong>
              {totalItems} item
              {totalItems !== 1 ? "s" : ""}
            </strong>

            <span>
              ₹{totalPrice}
            </span>

          </div>

          <button
            onClick={() =>
              navigate("/order-tea-snacks", {
                state: {
                  cart,
                },
              })
            }
          >
            Continue →
          </button>

        </div>

      )}

    </div>
  );
}

export default TeaSnacks;