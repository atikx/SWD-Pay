import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

function Outlets() {
  const navigate = useNavigate();
  const [outlets, setoutlets] = useState([]);

  const getOutlets = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/checkStatus/${localStorage.getItem("user")}`
      );
      if (res.data == "in-progress") {
        Swal.fire({
          // title: "Are you sure?",
          title: "you can not order while your other order is in progress ",
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          allowOutsideClick: false,
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
            navigate("/order-status");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const responce = await axios.get(
        "http://localhost:5000/outlet/getoutlets"
      );
      setoutlets(responce.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 300, // Animation duration in ms
      once: true, // Run animation only once
    });

    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      localStorage.setItem("page", "outlets");
      getOutlets();
    }
  }, []);

  return (
    <div className="h-screen w-screen sm:w-auto flex items-center justify-center overflow-hidden">
      <div
        className="outlets-container bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-6"
        data-aos="fade-up" // Container animation
      >
        <h1
          className="text-3xl font-bold text-white text-center mb-8"
          data-aos="zoom-in" // Title animation
        >
          Our Outlets
        </h1>
        <div className="outlets-grid h-96 overflow-y-scroll grid grid-cols-1 lg:grid-cols-3 gap-6 justify-center glassmorphism-scrollbar w-full">
          {outlets.map((outlet) => (
            <div
              key={outlet._id}
              className="outlet-card relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-6 flex flex-col justify-between items-center transition hover:bg-opacity-20 hover:shadow-xl"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.18)",
                width: "250px", // Fixed width for square shape
                height: "250px", // Fixed height for square shape
              }}
            >
              <img
                src="https://via.placeholder.com/150"
                alt={outlet.name}
                className="rounded-lg w-24 h-24 object-cover"
              />
              <div className="text-center mt-4">
                <h2 className="text-lg font-semibold text-white">
                  {outlet.name}
                </h2>
              </div>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={() => navigate(`/outlets/${outlet.name}`)}
              >
                Order Here
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Outlets;
