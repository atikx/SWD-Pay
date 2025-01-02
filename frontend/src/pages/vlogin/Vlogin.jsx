import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css"; // Import AOS styles
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import bg from "../../assets/imgs/vloginbg.jpg";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AOS from "aos"; // Import AOS
import axios from "axios";

function Vlogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 300 });
    if (localStorage.getItem("vname")) {
      navigate("/vendor");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toastConfig = {
    pauseOnHover: false,
    theme: "dark",
    autoClose: 2000,
  };

  const onSubmit = async (data) => {
    try {
      const isVendor = await axios.post("http://localhost:5000/outlet/login", data);
      if (isVendor.status === 200) {
        localStorage.setItem("vname", data.name);
        navigate("/vendor");
        toast("Login Successful", toastConfig);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast(error.response?.data || "Login failed", toastConfig);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="fade-in" // Background animation
        className="h-screen w-screen flex justify-center items-center"
      >
        <div
          className="backdrop-blur-md bg-white/10 rounded-xl shadow-lg p-8 w-80"
          data-aos="zoom-in" // Animation for the form container
        >
          <h2
            className="text-2xl font-bold text-white text-center mb-6"
            data-aos="fade-up" // Animation for the heading
          >
            Vendor Login
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            data-aos="fade-up" // Animation for the form
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                })}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/70 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/70 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                data-aos="flip-up" // Animation for the button
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Vlogin;
