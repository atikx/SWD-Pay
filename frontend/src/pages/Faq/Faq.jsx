import axios from "axios";
import React, { useState, useEffect } from "react";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Faq = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("answered");

  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/question/getquestions`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

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

  const handleAskQuestion = async () => {
    if (newQuestion) {
      try {
        const response = await axios.post(
          `http://localhost:5000/question/addquestion`,
          { question: newQuestion, askedby: localStorage.getItem("user") }
        );
        if (response.status === 200) {
          toast.success(response.data, toastConfig);
          setNewQuestion("");
          getQuestions();
        }
      } catch (error) {
        toast.error("Question cannot be asked now", toastConfig);
      }
    } else {
      toast.error("Question cannot be empty!", toastConfig);
    }
  };

  const handleAnswerQuestion = async (id) => {
    const { value: answer } = await MySwal.fire({
      title: "Provide your answer",
      input: "textarea",
      inputPlaceholder: "Type your answer here...",
      showCancelButton: true,
      confirmButtonText: "Submit Answer",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide an answer!";
        }
      },
      customClass: {
        popup:
          "bg-white bg-opacity-10 backdrop-blur-lg text-white shadow-lg rounded-lg",
        overlay: "bg-black bg-opacity-60",
        input: "text-white",
        title: "text-white",
        confirmButton:
          "bg-blue-500 text-white hover:bg-blue-600 rounded-md px-6 py-2",
        cancelButton:
          "bg-gray-700 text-white hover:bg-gray-600 rounded-md px-6 py-2",
      },
    });

    if (answer) {
      try {
        const response = await axios.put(
          `http://localhost:5000/question/answerquestion/${id}`,
          { answer: answer, answeredby: localStorage.getItem("user") }
        );
        if (response.status === 200) {
          toast.success(response.data, toastConfig);
        }
        getQuestions();
      } catch (error) {
        toast.error("Question cannot be answered now", toastConfig);
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      localStorage.setItem("page", "home");
      getQuestions();
      AOS.init({
        duration: 300,
        easing: "ease-in-out",
        once: true,
      });
    }
  }, [navigate]);

  return (
    <div className="faq-page flex items-center justify-center min-h-screen p-4">
      <div
        className="faq-container w-96 sm:w-[30rem] lg:w-[40rem] flex flex-col justify-center items-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-6 md:p-8"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.18)",
          height: "37.5rem",
        }}
        data-aos="fade-in"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          FAQs <span className="text-2xl">({questions.length})</span>
        </h1>

        <div className="tab-buttons flex justify-center space-x-2 md:space-x-4 mb-6">
          <button
            className={`flex-1 md:flex-none px-3 py-2 text-sm md:px-4 md:py-2 rounded-full font-semibold ${
              currentTab === "answered"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setCurrentTab("answered")}
            data-aos="fade-up"
          >
            Answered
          </button>
          <button
            className={`flex-1 md:flex-none px-3 py-2 text-sm md:px-4 md:py-2 rounded-full font-semibold ${
              currentTab === "unanswered"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setCurrentTab("unanswered")}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Unanswered
          </button>
          <button
            className={`flex-1 md:flex-none px-3 py-2 text-sm md:px-4 md:py-2 rounded-full font-semibold ${
              currentTab === "ask"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setCurrentTab("ask")}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Ask
          </button>
        </div>

        <div className="tab-content w-full flex-grow flex items-center justify-center">
          <div className="content-box w-full">
            {currentTab === "answered" && (
              <div
                className="answered-questions overflow-y-scroll h-[22rem] glassmorphism-scrollbar"
                data-aos="fade-right"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Answered Questions ({questions.filter((q) => q.status).length}
                  )
                </h2>
                <ul className="space-y-4">
                  {questions
                    .filter((q) => q.status)
                    .map((q) => (
                      <li
                        key={q._id}
                        className="mb-4 p-4 rounded-lg bg-white bg-opacity-20"
                      >
                        <strong className="text-lg text-white">
                          {q.question}
                        </strong>
                        <p className="text-gray-300 mt-2">{q.answer}</p>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {currentTab === "unanswered" && (
              <div
                className="unanswered-questions overflow-y-scroll h-[22rem] glassmorphism-scrollbar"
                data-aos="fade-left"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Unanswered Questions (
                  {questions.filter((q) => !q.status).length})
                </h2>
                <ul className="space-y-4">
                  {questions
                    .filter((q) => !q.status)
                    .map((q) => (
                      <li
                        key={q._id}
                        className="mb-4 p-4 rounded-lg bg-white bg-opacity-20"
                      >
                        <strong className="text-lg text-white">
                          {q.question}
                        </strong>
                        <div className="mt-2">
                          <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                            onClick={() => handleAnswerQuestion(q._id)}
                          >
                            Submit Answer
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {currentTab === "ask" && (
              <div
                className="ask-question flex flex-col items-center w-full"
                data-aos="fade-down"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Ask a Question
                </h2>
                <textarea
                  className="w-full p-4 rounded-lg bg-white bg-opacity-20 text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none shadow-inner h-32 glassmorphism-scrollbar"
                  placeholder="Type your question here..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <button
                  className="mt-4 px-6 py-3 bg-blue-500 text-white text-sm md:text-base rounded-lg shadow-md hover:bg-blue-600 transition-all"
                  onClick={handleAskQuestion}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
