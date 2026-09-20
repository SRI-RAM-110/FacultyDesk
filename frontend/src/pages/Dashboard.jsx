import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const facultyData = localStorage.getItem("faculty");
  const faculty = facultyData ? JSON.parse(facultyData) : null;

  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 18));
  const [selectedDate, setSelectedDate] = useState(18);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("faculty");
    navigate("/login", { replace: true });
  };

  /* =====================================================
     SERVICES
  ===================================================== */

  const services = [
    {
      icon: "▣",
      title: "Seminar Hall",
      subtitle: "Slot Booking",
      description: "Book seminar halls for events, workshops and meetings.",
      color: "blue",
      path: "/seminar-hall",
    },

    {
      icon: "▰",
      title: "Transport",
      subtitle: "Request",
      description: "Request college transport for official use.",
      color: "cyan",
      path: "/transport",
    },
    {
      icon: "⚒",
      title: "Maintenance",
      subtitle: "Request",
      description: "Raise a maintenance request for department facilities.",
      color: "purple",
      path: "/maintenance",
    },
    {
      icon: "⚒",
      title: "Accomudation",
      subtitle: "Request",
      description: "Raise a Accomudation request for department facilities.",
      color: "purple",
      path: "/accommodation",
    },
    {
      icon: "▥",
      title: "Academic",
      subtitle: "Resources",
      description: "Access academic forms, syllabi, and useful resources.",
      color: "magenta",
    },
    {
      icon: "▤",
      title: "Stationery",
      subtitle: "Request",
      description:
        "Request and manage stationery items and essential office supplies.",
      color: "blue",
      path: "/stationery"
    },
    {
      icon: "☕",
      title: "Tea &",
      subtitle: "Snacks",
      description:
        "Request tea, snacks, and refreshments for meetings and campus activities.",
      color: "orange",
    },
  ];

  /* =====================================================
     ANNOUNCEMENTS
  ===================================================== */

  const announcements = [
    {
      id: 1,
      title: "New seminar hall available",
      description: "Seminar Hall D is now open for booking.",
      date: "17 Sep 2026",
      type: "Important",
      color: "green-dot",
    },
    {
      id: 2,
      title: "Faculty Development Program",
      description: "Register now for the upcoming FDP.",
      date: "15 Sep 2026",
      type: "Academic",
      color: "blue-dot",
    },
    {
      id: 3,
      title: "System Maintenance",
      description: "Portal will be down on 20 Sep, 10 PM – 2 AM.",
      date: "12 Sep 2026",
      type: "System",
      color: "orange-dot",
    },
    {
      id: 4,
      title: "Research Committee Meeting",
      description: "Faculty members can register for the committee meeting.",
      date: "10 Sep 2026",
      type: "Academic",
      color: "purple-dot",
    },
    {
      id: 5,
      title: "Internal Assessment Schedule",
      description: "The updated internal assessment schedule is available.",
      date: "08 Sep 2026",
      type: "Academic",
      color: "blue-dot",
    },
  ];

  const visibleAnnouncements = showAllAnnouncements
    ? announcements
    : announcements.slice(0, 3);

  /* =====================================================
     BOOKINGS
  ===================================================== */

  const bookings = [
    {
      day: "20",
      month: "SEP",
      title: "AI in Education Workshop",
      time: "10:00 AM – 12:00 PM",
      location: "Seminar Hall A",
      status: "Approved",
      statusType: "approved",
    },
    {
      day: "25",
      month: "SEP",
      title: "Department Meeting",
      time: "02:00 PM – 04:00 PM",
      location: "Seminar Hall B",
      status: "Pending",
      statusType: "pending",
    },
    {
      day: "29",
      month: "SEP",
      title: "Research Paper Presentation",
      time: "11:00 AM – 01:00 PM",
      location: "Seminar Hall C",
      status: "Approved",
      statusType: "approved",
    },
  ];

  /* =====================================================
     CALENDAR
  ===================================================== */

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({
      day: "",
      empty: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      empty: false,
    });
  }

  /* =====================================================
     NAME
  ===================================================== */

  const displayName = faculty?.name || "Faculty Member";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="dashboard-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="portal-header">
        <div className="college-brand">
          <div className="college-logo">NEC</div>

          <div className="college-brand-text">
            <h1>Narasaraopet Engineering College</h1>
            <p>Faculty Portal</p>
          </div>
        </div>

        <div className="header-right">
          <div className="portal-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search services, halls, resources..."
            />
          </div>

          <button className="notification-button">
            <span className="notification-icon">♧</span>
            <span className="notification-badge">{announcements.length}</span>
          </button>

          <div className="profile-area">
            <div className="profile-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-details">
              <strong>{displayName}</strong>
              <span>{faculty?.branch || "CSE Department"}</span>
            </div>

            <span className="profile-arrow">⌄</span>
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

+++      <main className="dashboard-content">
        {/* HERO */}

        <section className="hero-layout">
          <div className="welcome-hero">
            <div className="hero-overlay"></div>

            <div className="hero-content">
              <p className="hero-greeting">GOOD MORNING,</p>

              <h2>Welcome, {firstName}!</h2>

              <p className="hero-quote">
                "Empowering educators to create a better tomorrow."
              </p>

              <div className="hero-line"></div>
            </div>
          </div>

          <div className="date-card">
            <div className="date-icon">▣</div>

            <div className="date-content">
              <strong>
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>

              <div className="date-divider"></div>

              <p>“Great learning spaces build greater minds.”</p>

              <div className="date-line"></div>
            </div>
          </div>
        </section>

        {/* SERVICES HEADER */}

        <div className="services-header">
          <div>
            <h2>Our Services</h2>

            <p>Access all faculty services in one place</p>
          </div>

          <div className="quick-actions">
            <button>
              <span>?</span>
              Need Help?
            </button>

            <div className="action-divider"></div>

            <button>
              <span>♧</span>
              Have a suggestion?
            </button>
          </div>
        </div>

        {/* SERVICES */}

        <section className="services-grid">
          {services.map((service) => (
            <article
              className={`service-card ${service.color}`}
              key={`${service.title}-${service.subtitle}`}
            >
              <div className="service-card-top">
                <div className="service-icon">{service.icon}</div>

                <div className="service-title">
                  <h3>{service.title}</h3>
                  <h4>{service.subtitle}</h4>
                </div>
              </div>

              <p className="service-description">{service.description}</p>

              <button
                className="service-open"
                onClick={() => {
                  if (service.path) {
                    navigate(service.path);
                  }
                }}
              >
                <span>Open</span>
                <span className="open-arrow">→</span>
              </button>
            </article>
          ))}
        </section>

        {/* =================================================
            LOWER PANELS
        ================================================= */}

        <section className="dashboard-panels">
          {/* =================================================
              ANNOUNCEMENTS
          ================================================= */}

          <div className="dashboard-panel announcements-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-icon">⚑</span>

                <h3>Announcements</h3>
              </div>

              <button
                className="view-all"
                onClick={() => setShowAllAnnouncements(!showAllAnnouncements)}
              >
                {showAllAnnouncements ? "Show Less ↑" : "View All →"}
              </button>
            </div>

            <div className="announcement-list">
              {visibleAnnouncements.map((item) => (
                <button
                  className="announcement-item"
                  key={item.id}
                  onClick={() => setSelectedAnnouncement(item)}
                >
                  <div className={`announcement-dot ${item.color}`}></div>

                  <div className="announcement-content">
                    <strong>{item.title}</strong>

                    <p>{item.description}</p>
                  </div>

                  <span className="announcement-date">{item.date}</span>
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              UPCOMING BOOKINGS
          ================================================= */}

          <div className="dashboard-panel bookings-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-icon">▣</span>

                <h3>Upcoming Bookings</h3>
              </div>

              <button className="view-all">View All →</button>
            </div>

            <div className="booking-list">
              {bookings.map((booking) => (
                <div
                  className="booking-item"
                  key={`${booking.day}-${booking.title}`}
                >
                  <div className="booking-date">
                    <strong>{booking.day}</strong>

                    <span>{booking.month}</span>
                  </div>

                  <div className="booking-details">
                    <strong>{booking.title}</strong>

                    <span>{booking.time}</span>

                    <small>● {booking.location}</small>
                  </div>

                  <span className={`booking-status ${booking.statusType}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              CALENDAR
          ================================================= */}

          <div className="dashboard-panel calendar-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-icon">▣</span>

                <h3>Quick Calendar</h3>
              </div>

              <button
                className="view-all"
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date().getDate());
                }}
              >
                Today →
              </button>
            </div>

            <div className="calendar-navigation">
              <button
                type="button"
                onClick={previousMonth}
                aria-label="Previous month"
              >
                ‹
              </button>

              <strong>
                {monthName} {year}
              </strong>

              <button type="button" onClick={nextMonth} aria-label="Next month">
                ›
              </button>
            </div>

            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div className="calendar-weekday" key={day}>
                  {day}
                </div>
              ))}

              {calendarDays.map((item, index) => (
                <button
                  type="button"
                  key={`${year}-${month}-${index}`}
                  disabled={item.empty}
                  className={`
                    calendar-day
                    ${item.empty ? "empty" : ""}
                    ${selectedDate === item.day ? "active" : ""}
                  `}
                  onClick={() => {
                    if (!item.empty) {
                      setSelectedDate(item.day);
                    }
                  }}
                >
                  {item.day}
                </button>
              ))}
            </div>

            {selectedDate && (
              <div className="selected-date-info">
                Selected:
                <strong>
                  {" "}
                  {monthName} {selectedDate}, {year}
                </strong>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =================================================
          ANNOUNCEMENT MODAL
      ================================================= */}

      {selectedAnnouncement && (
        <div
          className="announcement-modal-overlay"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="announcement-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedAnnouncement(null)}
            >
              ×
            </button>

            <span className={`modal-dot ${selectedAnnouncement.color}`}></span>

            <span className="modal-type">{selectedAnnouncement.type}</span>

            <h2>{selectedAnnouncement.title}</h2>

            <p>{selectedAnnouncement.description}</p>

            <small>Published on {selectedAnnouncement.date}</small>
          </div>
        </div>
      )}

      {/* FOOTER */}

      <footer className="portal-footer">
        <span>Narasaraopet Engineering College</span>

        <span className="footer-separator">|</span>

        <span>Faculty Portal</span>

        <div className="footer-right">
          <span>Learn</span>
          <span>·</span>
          <span>Innovate</span>
          <span>·</span>
          <span>Lead</span>
        </div>
      </footer>

      {/* Logout is currently available through future profile menu */}
    </div>
  );
}

export default Dashboard;
