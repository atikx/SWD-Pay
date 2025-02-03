import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaDollarSign } from "react-icons/fa"; // React Icons
import { GiHamburger, GiCupcake, GiFrenchFries } from "react-icons/gi"; // Food-related icons
import AOS from 'aos';
import 'aos/dist/aos.css';

function Deduction() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const getUserOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/getorders/${localStorage.getItem("user")}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      localStorage.setItem("page", "deduction");
      getUserOrders();
    }

    AOS.init({ duration: 500 }); // Initialize AOS with the desired duration
  }, [navigate]);

  // Function to calculate the total for each order
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-6 rounded-lg w-screen sm:w-auto flex justify-center items-center h-screen">
      <div
        className="w-full sm:w-[30rem] lg:w-[80%] flex flex-col justify-center items-center bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-6 md:p-8"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Deductions
        </h1>

        <div
          className="flex flex-wrap gap-6 justify-center glassmorphism-scrollbar h-[30rem] overflow-y-scroll"
          data-aos="fade-up" // Animation applied to the whole order list
        >
          {orders.reverse().map((order, index) => (
            <div
              key={index}
              className="w-full sm:w-[80%] lg:w-[90%] xl:w-[75%] p-6 bg-white bg-opacity-10 rounded-lg shadow-lg backdrop-blur-md flex flex-col space-y-6"
              style={{ minWidth: "20rem", maxWidth: "50rem" }}
            >
              <div className="flex items-center justify-center space-x-6">
                <GiHamburger className="text-white text-3xl" />{" "}
                {/* Food-related icon */}
                <h2 className="text-white text-xl font-semibold">
                  {order.outlet}
                </h2>
              </div>

              <div className="flex flex-col space-y-6">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-6 bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30 transition-all"
                  >
                    <GiCupcake className="text-white text-3xl" />{" "}
                    {/* Food item icon */}
                    <div className="flex flex-col text-white">
                      <span className="text-lg font-semibold">{item.name}</span>
                      <div className="flex space-x-6 mt-2">
                        <span>
                          <strong>Qty: </strong>
                          {item.quantity}
                        </span>
                        <span>
                          <strong>Total: </strong>
                          <FaDollarSign className="inline text-white" />
                          {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Displaying the grand total for the current order */}
              <div className="flex justify-between flex-col  items-center bg-opacity-30 p-4 rounded-lg mt-4">
                <div className="w-full flex justify-between">
                  <span className="text-white font-semibold">Grand Total :</span>
                  <span className="text-white">
                    <FaDollarSign className="inline text-white" />
                    {calculateOrderTotal(order.items)}
                  </span>
                </div>
                <div className="w-full flex justify-center">
                  <span className="text-white">{order.ordered}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Deduction;
