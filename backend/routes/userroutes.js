import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// Add User Route
router.post("/adduser", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ id: req.body.id }, { email: req.body.email }],
    });

    if (existingUser) {
      if (existingUser.id === req.body.id) {
        return res.status(400).send("User ID already taken");
      }
      if (existingUser.email === req.body.email) {
        return res.status(400).send("Email already taken");
      }
    }

    const newUser = new User({
      id: req.body.id,
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });

    await newUser.save();
    res.status(200).send("User saved successfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Server error");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ id });
    if (user) {
      if (user.password === password) {
        console.log(`${id} logged in at ${new Date()}`);
        res.status(200).send(user);
      } else {
        console.log("Login Failed");
        res.status(401).send("Incorrect password");
      }
    } else {
      console.log("User not found");
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error");
  }
});

// Get User Route
router.get("/getuser/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const user = await User.findOne({ id: uid });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Server error");
  }
});

// Change Password Route
router.put("/changepassword/:uid", async (req, res) => {
  const uid = req.params.uid;
  const { password } = req.body;

  try {
    const user = await User.findOneAndUpdate({ id: uid }, { password });
    if (user) {
      res.status(200).send("Password changed successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Server error");
  }
});

// add orders

router.post("/neworder/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const user = await User.findOne({ id: uid });
    const newOrder = req.body;
    user.orders.push({
      oid: newOrder.oid,
      outlet: newOrder.outlet,
      items: newOrder.items,
      ordered: new Date().toString().split(" ").slice(0, 5).join(" "),
    });
    user.deductions += newOrder.grandTotal;
    user.orderStatus = "in-progress";
    await user.save();
    res.status(200).send("Order saved successfully");
  } catch (error) {
    console.log(error);
    res.send("server error");
  }
});

// get orders

router.get("/getorders/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.uid });
    res.json(user.orders);
  } catch (error) {
    console.log(error);
    res.send("server error");
  }
});

// get order status

router.get("/getostatus/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.uid });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.send("server error");
  }
});

// complete order

router.patch("/completeOrder/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.uid });
    if (user) {
      user.orderStatus = "completed";
      await user.save();
      res.send("order completed");
    } else {
      res.send("error");
    }
  } catch (error) {
    console.log(error);
    res.send("error");
  }
});

// check status
router.get("/checkStatus/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.uid });
    if (user) {
      res.send(user.orderStatus);
    } else {
      res.send("error");
    }
  } catch (error) {
    res.send("error");
  }
});

export default router;
