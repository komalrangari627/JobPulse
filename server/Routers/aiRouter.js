import express from "express";

const router = express.Router();

router.get("/questions", async (req, res) => {
    const topic = req.query.topic;

    res.json({
        questions: `Generated questions for ${topic}`
    });
});

export default router;
