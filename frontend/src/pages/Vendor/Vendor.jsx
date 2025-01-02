import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClipboardList } from "react-icons/fa"; // Importing react-icons
import vendorbg from "../../assets/imgs/vendorbg.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2"; // Import SweetAlert2
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // AOS styles

function VendorPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const toastConfig = {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#191B24", // Dark background
      color: "#fff", // White text
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
    },
  };

  const getOrders = async () => {
    try {
      const vname = localStorage.getItem("vname");
      const response = await axios.get(
        `${localStorage.getItem("api")}/outlet/getorders/${vname}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 500 });
    if (localStorage.getItem("vname")) {
      getOrders();
    } else {
      navigate("/vlogin");
    }
  }, []);

  const handleComplete = async (user, id) => {
    try {
      const res = await axios.patch(
        `${localStorage.getItem("api")}/user/completeOrder/${user}`
      );
      toast.success("order completed", toastConfig);
    } catch (error) {
      toast.error("error", toastConfig);
    }
    // delete from vendor side
    try {
      const vres = await axios.patch(
        `${localStorage.getItem("api")}/outlet/completeOrder/${id}`,
        {
          name: localStorage.getItem("vname"),
        }
      );
      if (vres.data == "done") {
        getOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
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
        localStorage.removeItem("vname");
        navigate("/vlogin");
      }
    });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${vendorbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      data-aos="fade-in" // Animation for the background
      className="h-screen w-screen flex items-center sm:p-20 p-4 justify-center"
    >
      <div
        className="bg-white/10 w-[90%] backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 flex flex-col items-center py-8 px-4"
        data-aos="zoom-in" // Animation for the main container
      >
        <div
          className="flex justify-between w-full max-w-6xl items-center mb-6"
          data-aos="fade-up" // Animation for the header section
        >
          <h1 className="text-white text-3xl font-bold">Order Requests</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl overflow-y-auto h-[70vh] glassmorphism-scrollbar"
          data-aos="fade-up" // Animation for the orders grid
        >
          {orders.length === 0 ? (
            <p className="text-white text-center w-full">
              No requests available
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.oid}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-md text-white flex flex-col justify-between"
              >
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold mb-2">
                    Order ID: {order.oid}
                  </h2>
                </div>
                <h3 className="text-sm mb-4">
                  Items:
                  {order.items.map((item) => (
                    <p key={Math.random()}>
                      {item.name} (x{item.quantity})
                    </p>
                  ))}
                </h3>
                <button
                  onClick={() =>
                    handleComplete(parseInt(order.orderedBy), order.oid)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <FaCheckCircle className="text-white" />
                  <span>Mark as Completed</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorPage;
