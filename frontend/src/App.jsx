import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SeminarHall from "./pages/SeminarHall";
import MySeminarBookings from "./pages/MySeminarBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/seminar-hall" element={<SeminarHall />} />
        <Route path="/my-seminar-bookings" element={<MySeminarBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;