import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS styles

function Home() {
  const [userdata, setuserdata] = useState({});
  const navigate = useNavigate();

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
      localStorage.setItem("page", "home");
      getUserData();
    }

    // Initialize AOS after component mounts
    AOS.init({
      duration: 500, // Animation duration (in milliseconds) - Increased speed
      once: true, // Run animation only once
      easing: "ease-in-out", // Smooth easing
      delay: 100, // Delay before animation starts (for consistent flow)
      offset: 100, // Offset to trigger animation before reaching the target
    });
  }, [navigate]);

  const menuItems = [
    { name: "Pasta", category: "Main Course" },
    { name: "Salad", category: "Appetizer" },
    { name: "Brownie", category: "Dessert" },
  ];

  return (
    <div className="mt-16 flex items-start justify-center bg-cover bg-center bg-no-repeat">
      {/* Glassmorphic Card */}
      <div
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-10 max-w-5xl w-full"
        data-aos="fade-up" // Apply fade-up animation to the main card
      >
        {/* Header Section */}
        <div data-aos="fade-up">
          <h1 className="text-4xl font-extrabold text-gray-100 mb-4">
            Welcome, <span className="text-blue-400">{userdata.name}</span>!
          </h1>
          <p className="text-lg text-gray-300">
            Your Current Deductions:{" "}
            <span className="text-green-400 font-bold">
              ₹{userdata.deductions}
            </span>
          </p>
        </div>

        {/* Today's Menu Section */}
        <div data-aos="fade-up">
          {" "}
          {/* Apply fade-up animation to the section */}
          <h2 className="text-3xl font-semibold text-gray-100 mb-6">
            Today's Menu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-md border border-white/10 text-center"
                data-aos="fade-up" // Apply fade-up animation to each menu item
              >
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-300">{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
