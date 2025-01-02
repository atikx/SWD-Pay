import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import OrderStatus from "./pages/OStatus/OrderStatus";
import Login from "./pages/Login/Login";
import Outlets from "./pages/Outlets/Outlets";
import Vlogin from "./pages/vlogin/Vlogin";
import SpecificOutlet from "./pages/Outlets/SpecificOutlet";
import VendorPage from "./pages/Vendor/Vendor";
import Faq from "./pages/Faq/Faq";
import Profile from "./pages/Profile/Profile";
import Deduction from "./pages/Deduction/Deduction";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (

      <div className="text-white  ">
        <Routes>
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/vlogin" element={<Vlogin />} />
          <Route path="/vendor" element={<VendorPage />} />
          <Route path="/faqs" element={<Faq />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/deduction" element={<Deduction />} />
          <Route path="/outlets/:name" element={<SpecificOutlet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/outlets" element={<Outlets />} />
        </Routes>
      </div>

  );
}

export default App;
