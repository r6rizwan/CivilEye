import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const testSchema = new mongoose.Schema({
  name: String
});

const Test = mongoose.model("Test", testSchema);

router.get("/create", async (req, res) => {
  try {
    const doc = await Test.create({ name: "Hello MongoDB" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
