import express from "express";
import { Router } from "express";
import Question from "../models/Questions.js";

const router = express.Router();

router.post("/addquestion", async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    const savedQuestion = await newQuestion.save();
    res.status(200).json("Question has been added");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getquestions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/answerquestion/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    question.answer = req.body.answer;
    question.status = true;
    question.answeredby = req.body.answeredby;
    await question.save();
    res.status(200).json("The question has been answered");
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
