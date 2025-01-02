import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { FaUser, FaIdCard, FaMoneyBillAlt, FaKey } from "react-icons/fa"; // Importing React icons
import { toast, Toaster } from "react-hot-toast";

import axios from "axios";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS styles

const Profile = () => {
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState({});
  const [newPassword, setNewPassword] = useState("");

  // Dark toast configuration
  const toastConfig = {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#191B24", // Dark background
      color: "#fff", // White text
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
    }
  };

  const getUserData = async () => {
    const userid = parseInt(localStorage.getItem("user"));
    try {
      const responce = await axios.get(
        `http://localhost:5000/user/getuser/${userid}`
      );
      setuserdata(responce.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      localStorage.setItem("page", "profile");
      getUserData();
    }

    // Initialize AOS after component mounts
    AOS.init({
      duration: 500, // Animation duration (in milliseconds) - Increased speed
      once: true, // Run animation only once
      easing: "ease-in-out", // Smooth easing
      delay: 100, // Delay before animation starts (for consistent flow)
    });
  }, [navigate]);

  const handleChangePassword = async () => {
    if (newPassword) {
      const userid = parseInt(localStorage.getItem("user"));
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to change the password",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it",
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const responce = await axios.put(
              `http://localhost:5000/user/changepassword/${userid}`,
              { password: newPassword }
            );
            toast.success("Password changed successfully", toastConfig); // Apply dark theme toast
          } catch (error) {
            toast.error("Error changing password", toastConfig); // Apply dark theme toast
          }
        }
      });
    } else {
      toast.error("Password cannot be blank", toastConfig); // Apply dark theme toast
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 "></div> {/* Dark overlay */}
      <div
        className="relative w-full max-w-2xl p-8 sm:bg-none bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 text-white"
        data-aos="fade-up" // Add AOS fade-up animation
      >
        <h2
          className="text-3xl font-semibold text-center mb-8"
          data-aos="zoom-in" // Add zoom-in animation
        >
          Profile
        </h2>
        {/* Profile Info */}
        <div className="space-y-6">
          <div
            className="flex items-center space-x-4"
            data-aos="fade-right" // Fade-in animation from right
          >
            <FaUser size={24} className="text-blue-400" />
            <div>
              <h3 className="text-xl font-semibold">Name:</h3>
              <p className="text-lg text-gray-300">{userdata.name}</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-4"
            data-aos="fade-left" // Fade-in animation from left
          >
            <FaIdCard size={24} className="text-blue-400" />
            <div>
              <h3 className="text-xl font-semibold">ID:</h3>
              <p className="text-lg text-gray-300">{userdata.id}</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-4"
            data-aos="fade-up" // Fade-in animation from top
          >
            <FaMoneyBillAlt size={24} className="text-green-400" />
            <div>
              <h3 className="text-xl font-semibold">Current Deductions:</h3>
              <p className="text-lg text-green-400 font-bold">
                ₹{userdata.deductions}
              </p>
            </div>
          </div>

          {/* Change Password Section */}
          <div data-aos="fade-in">
            {" "}
            {/* Fade-in animation */}
            <h3 className="text-xl font-semibold">Change Password:</h3>
            <input
              type="text"
              className="w-full p-2 mt-2 bg-transparent border border-gray-400 rounded-lg text-white focus:outline-none focus:border-blue-400"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
            >
              <FaKey size={20} className="inline mr-2" />
              Change Password
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Profile;
