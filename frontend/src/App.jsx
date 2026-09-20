import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
<<<<<<< HEAD
import SeminarHall from "./pages/SeminarHall";
import MySeminarBookings from "./pages/MySeminarBookings";
=======
import Transport from "./pages/Transport";
>>>>>>> f69d3a48fa625e8cbd26c4fe685d3af57bc72b01

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
<<<<<<< HEAD
        <Route path="/seminar-hall" element={<SeminarHall />} />
        <Route path="/my-seminar-bookings" element={<MySeminarBookings />} />
=======
        <Route path="/transport" element={<Transport />} />
>>>>>>> f69d3a48fa625e8cbd26c4fe685d3af57bc72b01
      </Routes>
    </BrowserRouter>
  );
}

export default App;