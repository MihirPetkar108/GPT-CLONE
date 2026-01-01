import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB!");
    } catch (err) {
        console.log(`Failed to connect to DB ${err}`);
    }
};

// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             input: [
//                 {
//                     role: "user",
//                     content: [{ type: "input_text", text: req.body.message }],
//                 },
//             ],
//         }),
//     };

//     try {
//         const response = await fetch(
//             "https://api.openai.com/v1/responses",
//             options
//         );
//         const data = await response.json();
//         res.send(data.output[0].content[0].text);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "OpenAI request failed" });
//     }
// });

app.listen(PORT, (req, res) => {
    console.log(`Server listening at port ${PORT}`);
    connectDB();
});
