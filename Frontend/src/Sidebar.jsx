import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setCurrThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setPrevChats,
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const data = await response.json();
            const filterData = data.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title,
            }));
            setAllThreads(filterData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv4());
        setPrevChats([]);
    };

    const changeThread = async (newthreadId) => {
        setCurrThreadId(newthreadId);
        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${newthreadId}`
            );
            const data = await response.json();
            console.log(data);
            setPrevChats(data);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img
                    src="./src/assets/blacklogo.png"
                    alt="GPT Logo"
                    className="logo"
                ></img>
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="thread">
                {allThreads?.map((thread) => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                    >
                        {thread.title}
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Mihir Petkar &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;
