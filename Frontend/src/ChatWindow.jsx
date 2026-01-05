import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useRef } from "react";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        currThreadId,
        setCurrThreadId,
        newChat,
        setNewChat,
        prevChats,
        setPrevChats,
        loading,
        setLoading,
        allThreads,
        setAllThreads,
    } = useContext(MyContext);

    const getReply = async () => {
        if (!prompt.trim()) return;

        // Add thread to sidebar immediately on first prompt
        if (newChat) {
            setAllThreads((prev) => [
                {
                    threadId: currThreadId,
                    title: prompt,
                },
                ...prev,
            ]);
            setNewChat(false);
        }

        setPrevChats((prevChats) => {
            return [
                ...prevChats,
                {
                    role: "user",
                    content: prompt,
                },
            ];
        });
        setPrompt("");
        setLoading(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                threadId: currThreadId,
                message: prompt,
            }),
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );
            const data = await response.json();
            setPrevChats((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply,
                },
            ]);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>
                    Mihir GPT <i className="fa-solid fa-chevron-down"></i>
                </span>
                <div className="userIconDiv">
                    <span className="userIcon">
                        <i className="fa-solid fa-circle-user"></i>
                    </span>
                </div>
            </div>

            <div className="chatMessages">
                <Chat />
            </div>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask Anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            e.key === "Enter" ? getReply() : "";
                        }}
                    ></input>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    ChatGPT Clone can make mistakes. Check important info. See
                    Cookie Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
