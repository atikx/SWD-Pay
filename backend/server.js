import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import userrouter from "./routes/userroutes.js";
import outletrouter from "./routes/outletroutes.js";
import questionsrouter from "./routes/questionsroutes.js";
import cors from "cors";

configDotenv(); 

const app = express();
const PORT = process.env.PORT ;
const url = process.env.MONGO_URL;


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userrouter);
app.use("/outlet", outletrouter);
app.use("/question", questionsrouter);

mongoose.connect(url);

app.get("/", (req, res) => {
    res.json("Server is running");
});

app.listen(parseInt(PORT), () => {
    console.log(`Server is running on port ${PORT}`);
})
