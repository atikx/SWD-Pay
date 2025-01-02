import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import bg from "../../assets/imgs/loginbg.jpg";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
    AOS.init();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const navigate = useNavigate();

  const onSubmitLogin = async (data) => {
    try {
      const isUser = await axios.post(`${localStorage.getItem("api")}/user/login`, data);
      if (isUser.status === 200) {
        localStorage.setItem("user", data.id);
        toast.success("Login Successful", toastConfig);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(error.response?.data || "Login failed", toastConfig);
    }
  };

  const onSubmitRegister = async (data) => {
    try {
      const response = await axios.post(
        `${localStorage.getItem("api")}/user/adduser`,
        data
      );
      console.log(response.data);
      toast.success("Registration Successful", toastConfig);
      setIsRegister(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data, toastConfig); // Display specific error
      } else {
        toast.error("Registration Failed", toastConfig);
      }
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInCenter {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

      <div
        className="h-screen flex justify-center items-center w-screen"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "fadeInCenter 0.5s ease-in-out",
        }}
      >
        <div
          data-aos="fade-up"
          data-aos-duration="200"
          data-aos-easing="ease-in-out"
          className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg p-8 w-80"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {isRegister ? "Register" : "Login"}
          </h2>

          <form
            onSubmit={handleSubmit(
              isRegister ? onSubmitRegister : onSubmitLogin
            )}
            className="space-y-4"
          >
            {isRegister && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                  >
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                    className="w-full mt-1 px-4 py-2 rounded-lg bg-white/70 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-white"
              >
                User Id
              </label>
              <input
                id="id"
                type="text"
                placeholder="Enter your id"
                {...register("id", {
                  required: "Id is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "ID must contain only numbers",
                  },
                })}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/70 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.id && (
                <p className="text-sm text-red-500 mt-1">{errors.id.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
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
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                {isRegister ? "Register" : "Login"}
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-white mt-4">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={() => setIsRegister(false)}
                  className="text-blue-300 hover:underline"
                >
                  Login
                </a>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={() => setIsRegister(true)}
                  className="text-blue-300 hover:underline"
                >
                  Register
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
