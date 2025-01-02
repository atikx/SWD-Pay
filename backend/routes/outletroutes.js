import express from "express";
import mongoose from "mongoose";
import outlet from "../models/Outlet.js";
import Outlet from "../models/Outlet.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello outlet");
  const Newutlet = new outlet({
    name: "Ishtara",
    password: "ishtara",
    items: [
      {
        name: "burger",
        price: 55,
      },
      {
        name: "onion dosa",
        price: 50,
      },
      {
        name: "momos",
        price: 30,
      },
      {
        name: "chawmein",
        price: 45,
      },
    ],
  });
  Newutlet.save();
});

router.get("/getoutlets", async (req, res) => {
  try {
    const outlets = await outlet.find();
    res.json(outlets);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getodata/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const oData = await outlet.findOne({ name: name });
    res.json(oData);
  } catch (error) {
    console.log(error);
  }
});

router.post("/neworder/:oname", async (req, res) => {
  const oname = req.params.oname;
  try {
    const vendor = await outlet.findOne({ name: oname });
    const newOrder = req.body;
    vendor.orders.push(newOrder);
    await vendor.save();
    res.status(200).send("Order placed successfully");
  } catch (error) {
    console.log(error);
    res.send("server error");
  }
});

router.get("/getorders/:vname", async (req, res) => {
  const vname = req.params.vname;
  try {
    const ooutlet = await outlet.findOne({ name: vname });
    res.json(ooutlet.orders);
  } catch (error) {
    console.log(error);
  }
});

// login

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const outlet = await Outlet.findOne({ name });
    if (outlet) {
      if (outlet.password === password) {
        console.log(`${name} logged in at ${new Date()}`);
        res.status(200).send(outlet);
      } else {
        console.log("Login Failed");
        res.status(401).send("Incorrect password");
      }
    } else {
      console.log(" not found");
      res.status(404).send("Invalid name");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error");
  }
});

// delete completed order
router.patch("/completeOrder/:id", async (req, res) => {
  try {
    const outlet = await Outlet.findOne({ name: req.body.name });
    if (outlet) {
      outlet.orders = outlet.orders.filter((order) => {
        return order.oid !== parseInt(req.params.id);
      });
      await outlet.save();
      res.send("done");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
export default router;
