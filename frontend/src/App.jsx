import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transport from "./pages/Transport";
import TransportRequests from "./pages/TransportRequests";
import Maintenance from "./pages/Maintenance";
import MaintenanceRequests from "./pages/MaintenanceRequests";
import SeminarHall from "./pages/SeminarHall";
import MySeminarBookings from "./pages/MySeminarBookings";
import Accommodation from "./pages/Accommodation";
import MyAccommodationRequests from "./pages/MyAccommodationRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/transport/requests" element={<TransportRequests />} />
        <Route path="/maintenance" element={<Maintenance />}/>
        <Route path="/maintenance/requests" element={<MaintenanceRequests />}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/seminar-hall" element={<SeminarHall/>}/>
        <Route path="/my-seminar-bookings" element={<MySeminarBookings/>}/>
        <Route path="/transport" element={<Transport />} />
        <Route path="/transport/requests" element={<TransportRequests />}/>
        <Route path="/accommodation" element={<Accommodation />} />
        <Route
  path="/my-accommodation-requests"
  element={<MyAccommodationRequests />}
/>
      </Routes>
    </BrowserRouter>
  
);
}

export default App;