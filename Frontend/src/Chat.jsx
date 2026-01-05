import "./Chat.css";
import { useState, useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import { SyncLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, loading, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }
        if (!prevChats.length) return;

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            setLatestReply(content.slice(0, idx + 1).join(" "));

            if (idx >= content.length) {
                clearInterval(interval);
            }
        }, 120);

        return () => clearInterval(interval);
    }, [reply, prevChats]);

    return (
        <>
            {newChat && (
                <div className="emptyState">
                    <h1>Start a New Chat</h1>
                </div>
            )}
            <div className="chats">
                {prevChats?.slice(0, -1).map((chat, idx) => {
                    return (
                        <div
                            className={
                                chat.role === "user" ? "userDiv" : "gptDiv"
                            }
                            key={idx}
                        >
                            {chat.role === "user" ? (
                                <p className="userMessage">{chat.content}</p>
                            ) : (
                                <div className="gptMessage">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                        {chat.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    );
                })}

                {prevChats.length > 0 && latestReply !== null && (
                    <div className="gptDiv" key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {latestReply}
                        </ReactMarkdown>
                    </div>
                )}

                {prevChats.length > 0 && latestReply === null && (
                    <div className="gptDiv" key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {prevChats[prevChats.length - 1].content}
                        </ReactMarkdown>
                    </div>
                )}

                {loading && (
                    <div className="gptDiv loaderWrapper">
                        <SyncLoader
                            className="loader"
                            color="#d7dbd4"
                            speedMultiplier={0.5}
                            size={9}
                            margin={3.5}
                            loading={loading}
                            style={{ marginBottom: "1rem" }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default Chat;
