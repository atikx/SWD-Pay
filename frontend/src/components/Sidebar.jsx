import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaClipboardList,
  FaTimes,
  FaHome,
  FaUser,
  FaMoneyBillAlt,
  FaStore,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa"; // Import the icons
import Swal from "sweetalert2"; // Import SweetAlert2

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[1]; // Get the active page from the URL
    setActivePage(path);
  }, [location.pathname]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle active page change and navigation
  const handlePageChange = (page, route) => {
    setActivePage(page);
    navigate(route);
    if (isOpen) toggleSidebar(); // Close sidebar on mobile after navigation
  };

  // Handle sign-out logic with confirmation
  const handleSignOut = () => {
    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, sign out",
      cancelButtonText: "Cancel",
      background: "#000000", // Solid black background for the dialog
      backdrop: `rgba(0, 0, 0, 0.5)`, // Slightly darken the background
      confirmButtonColor: "#28a745", // Green color for confirm button
      cancelButtonColor: "#dc3545", // Red color for cancel button
      customClass: {
        popup: "solidDialog", // Adding class for solid theme
        title: "text-white", // White text for the title
        content: "text-white", // White text for the content
        actions: "flex justify-between", // Style for action buttons
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  const navItems = [
    { name: "Home", route: "/home", key: "home", icon: <FaHome /> },
    { name: "Profile", route: "/profile", key: "profile", icon: <FaUser /> },
    { name: "Deduction", route: "/deduction", key: "deduction", icon: <FaMoneyBillAlt /> },
    { name: "Outlets", route: "/outlets", key: "outlets", icon: <FaStore /> },
    { name: "Order Status", route: "/order-status", key: "order-status", icon: <FaClipboardList /> }, // Updated key for Order Status
    { name: "FAQs", route: "/faqs", key: "faqs", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className={`relative ${localStorage.getItem("user") ? "flex" : "hidden"} h-full`}>
      {/* Sidebar */}
      <div
        className={`sm:fixed absolute top-0 left-0 z-50 h-full bg-black/30 backdrop-blur-lg text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:static sm:translate-x-0 w-64`}
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
          <button onClick={toggleSidebar} className="text-gray-300 sm:hidden">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <ul className="mt-6 space-y-4 px-4">
          {navItems.map((item) => (
            <li
              key={item.key}
              className={`py-3 px-4 rounded-lg text-gray-300 flex items-center space-x-3 ${
                activePage === item.key
                  ? "bg-white/20 text-white shadow-lg"
                  : "hover:bg-white/10 hover:text-white"
              } transition-all duration-200 ease-in-out`}
            >
              <button
                onClick={() => handlePageChange(item.key, item.route)}
                className="w-full text-left text-lg sm:text-xl flex items-center space-x-3"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Sign Out Button */}
        <div className="mt-auto p-4">
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <FaSignOutAlt size={20} /> {/* Add the sign-out icon */}
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 p-6 sm:static absolute transition-all duration-200 ${
          isOpen ? "ml-0" : "sm:ml-64"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-white bg-black/50 p-2 rounded-lg shadow-md fixed top-4 left-4 z-10"
        >
          <FaBars size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
