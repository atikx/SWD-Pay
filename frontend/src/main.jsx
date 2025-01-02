import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import bg1 from "./assets/imgs/bg1.jpg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Sidebar from "./components/Sidebar.jsx";
import Watermark from "./components/Watermark.jsx";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <ToastContainer />
    <div
      className="h-screen w-screen justify-center items-center sm:justify-normal sm:items-start flex "
      style={{
        backgroundImage: `url(${bg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar />
      <Watermark />

      {/* {localStorage.getItem("user")?<Sidebar/>:null} */}
      <App />
    </div>
  </Router>
);
