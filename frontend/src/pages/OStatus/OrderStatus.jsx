import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS styles
import axios from "axios";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa"; // FontAwesome Icons

function OrderStatus() {
  const navigate = useNavigate();
  const [userdata, setuserdata] = useState({});
  const [userOrders, setuserOrders] = useState([]);
  const [latestorder, setlatestorder] = useState(null);

  const getostatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/getostatus/${localStorage.getItem("user")}`
      );
      const data = response.data;

      setuserdata(data);
      setuserOrders(data.orders);

      // Safely get the latest order
      if (data.orders && data.orders.length > 0) {
        setlatestorder(data.orders[data.orders.length - 1]);
      } else {
        setlatestorder(null); // No orders
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      localStorage.setItem("page", "orderstatus");
      // Initialize AOS after component mounts
      AOS.init({
        duration: 400, // Animation duration
        easing: "ease-in-out", // Smooth easing
        once: true, // Run animation only once
        delay: 100, // Delay before animation starts
        offset: 100, // Offset for animation trigger
      });
      getostatus();
    }
  }, [navigate]);

  const renderOrderStatus = () => {
    if (!userdata || userdata.orderStatus === "none") {
      return (
        <div
          className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-lg text-center shadow-lg transform transition duration-500 hover:scale-105"
          data-aos="fade-up"
        >
          <FaTimesCircle size={50} className="text-red-500 mb-4" />
          <h1 className="text-xl text-gray-200">No current orders</h1>
        </div>
      );
    } else {
      return (
        <div
          className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-lg text-center shadow-lg transform transition duration-500 hover:scale-105"
          data-aos="fade-up"
        >
          <div
            className="flex justify-center items-center mb-6"
            data-aos="zoom-in"
          >
            {userdata.orderStatus === "in-progress" ? (
              <>
                <FaHourglassHalf size={50} className="text-yellow-500" />
                <h1 className="text-2xl text-gray-200 ml-4">
                  Order In Progress
                </h1>
              </>
            ) : (
              <>
                <FaCheckCircle size={50} className="text-green-500" />
                <h1 className="text-2xl text-gray-200 ml-4">Order Completed</h1>
              </>
            )}
          </div>
          <div data-aos="fade-up">
            <h1 className="text-4xl font-bold text-gray-100">
              {latestorder && latestorder.outlet}
            </h1>
            <p className="font-semibold mt-2 ">
              (Order ID: {latestorder ? latestorder.oid : "N/A"})
            </p>
            <div className="mt-4">
              <ul className="space-y-2">
                {latestorder &&
                  latestorder.items.map((item, index) => (
                    <li
                      key={Math.random()}
                      className="text-gray-200 bg-gray-800 p-3 rounded-md shadow-sm "
                      data-aos="fade-left"
                      data-aos-delay={index * 100}
                    >
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center text-white p-6"
      data-aos="fade-in"
    >
      {renderOrderStatus()}
    </div>
  );
}

export default OrderStatus;
