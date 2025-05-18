import express from "express";
import { getAIResponse } from "../lib/aiService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const aiReply = await getAIResponse(message);
    res.json({ reply: aiReply });
  } catch (error) {
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
