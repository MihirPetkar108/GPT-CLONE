import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing Thread",
            messages: [
                {
                    role: "user",
                    content: "hello this is a test api call",
                },
            ],
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save to DB!" });
    }
});

// Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.send(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to Fetch Threads!" });
    }
});

// Get a particular thread
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res
                .status(404)
                .json({ error: "This thread was not found!" });
        }

        res.send(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to Fetch Chat!" });
    }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const threadDeleted = await Thread.findOneAndDelete({ threadId });

        if (!threadDeleted) {
            return res.status(404).json({
                error: "Thread not found!",
            });
        }

        res.status(200).json({ success: "Thread Deleted Successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to Fetch Chat!" });
    }
});

// New Chat / Update Chat
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields!" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // create a new thread
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to Fetch Chat!" });
    }
});

export default router;
