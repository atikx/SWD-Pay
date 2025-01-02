import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineDelete,
} from "react-icons/ai"; // Import delete icon
import { FaPlus, FaMinus } from "react-icons/fa"; // Import add and minus icons
import {  toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

function SpecificOutlet() {
  const [oData, setOData] = useState({ name: "", items: [] });
  const [grandTotal, setGrandTotal] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { name } = useParams();
  const [orderid, setorderid] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
    AOS.refresh();
    getOData();
  }, [name]);

  useEffect(() => {
    // Update grandTotal whenever the cart changes
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setGrandTotal(total.toFixed(2));
  }, [cart]);

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

  const getOData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${localStorage.getItem("api")}/outlet/getodata/${name}`
      );
      setOData(response.data);
    } catch (error) {
      console.error("Error fetching outlet data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      const isItemInCart = prevCart.some(
        (cartItem) => cartItem.name === item.name
      );
      return isItemInCart
        ? updatedCart
        : [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.name === item.name && cartItem.quantity > 1
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const getItemQuantity = (item) => {
    const cartItem = cart.find((cartItem) => cartItem.name === item.name);
    return cartItem ? cartItem.quantity : 0;
  };

  const updateUserOrder = async (oid) => {
    try {
      const user = localStorage.getItem("user");
      await axios.post(`${localStorage.getItem("api")}/user/neworder/${user}`, {
        outlet: name,
        oid, // Use the passed-in `oid`
        items: cart,
        grandTotal: parseFloat(grandTotal),
      });
    } catch (error) {
      console.error("Error updating user order:", error);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty", toastConfig);
    } else {
      try {
        const oid = Math.round(Math.random() * 10000); // Generate a unique order ID
        setorderid(oid);

        // Place the order with the generated ID
        const oplaced = await axios.post(
          `${localStorage.getItem("api")}/outlet/neworder/${name}`,
          {
            oid,
            orderedBy: localStorage.getItem("user"),
            items: cart,
            grandTotal: parseFloat(grandTotal),
          }
        );

        if (oplaced.status === 200) {
          toast.success(oplaced.data, toastConfig);
          await updateUserOrder(oid); // Pass the same `oid` here as well
        }
      } catch (error) {
        toast.error("Order failed", toastConfig);
        console.error("Order failed:", error);
      }

      // Clear the cart and hide the modal
      setCart([]);
      setShowCart(false);
      navigate("/order-status");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter items based on the search query
  const filteredItems = oData.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-screen sm:w-auto flex items-center justify-center min-h-screen">
  

      {isLoading ? (
        <div className="text-white text-xl">Loading...</div>
      ) : (
        <>
          {showCart && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowCart(false)}
              />
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-[90%] max-w-md p-6 z-50 text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cart.length > 0 ? (
                  <ul className="space-y-4">
                    {cart.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center border-b pb-2 border-gray-600"
                      >
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span className="text-green-400 font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-red-500"
                            onClick={() => removeFromCart(item)}
                          >
                            <FaMinus />
                          </button>
                          <button
                            className="text-blue-500"
                            onClick={() => addToCart(item)}
                          >
                            <FaPlus />
                          </button>
                          <button
                            className="text-gray-500"
                            onClick={() => {
                              setCart((prevCart) =>
                                prevCart.filter(
                                  (cartItem) => cartItem.name !== item.name
                                )
                              );
                            }}
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Your cart is empty.</p>
                )}
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="text-xl text-green-400">
                      ₹{grandTotal}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition"
                      onClick={() => setShowCart(false)}
                    >
                      Close
                    </button>
                    <button
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
                      onClick={placeOrder}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div
            className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-4 relative z-30"
            data-aos="fade-up"
            data-aos-duration="300"
          >
            <div className="absolute z-50 top-4 right-4">
              <button
                className="relative bg-white/30 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/50 transition"
                onClick={() => setShowCart((prev) => !prev)}
              >
                <AiOutlineShoppingCart className="text-gray-800 text-2xl" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            <div
              className="container mx-auto"
              data-aos="fade-up"
              data-aos-duration="300"
            >
              <h1 className="text-3xl text-center font-bold text-white mb-6">
                {oData.name || "Loading..."}
              </h1>

              {/* Search bar with icon */}
              <div className="mb-6 relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <input
                  type="text"
                  className="w-full p-2 pl-10 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Scrollable container for items */}
              <div className="grid grid-cols-1 h-[22rem] overflow-y-scroll md:grid-cols-2 lg:grid-cols-3 gap-6 glassmorphism-scrollbar">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 border border-gray-700 h-44 w-52 rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg hover:shadow-gray-600 transition transform"
                    >
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {item.name}
                        </h2>
                        <p className="text-gray-400 mt-2">{item.description}</p>
                        <p className="text-green-400 font-bold mt-4">
                          ₹{item.price}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                          onClick={() => removeFromCart(item)}
                          disabled={getItemQuantity(item) === 0}
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-4 text-white">
                          {getItemQuantity(item)}
                        </span>
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                          onClick={() => addToCart(item)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No items match your search.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SpecificOutlet;
