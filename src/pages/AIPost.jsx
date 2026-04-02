import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AIPost.css";

const AIPost = () => {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋 Tell me what work you want to post."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // CHAT SCROLL REF
  const chatRef = useRef(null);

  const userId = localStorage.getItem("userId");

  // AUTO SCROLL CHAT ONLY
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {

      const res = await axios.post(
        "https://taskora-backend-aejx.onrender.com/api/ai/chat",
        { messages: updatedMessages ,
            userId: userId,
        }
      );

      const aiMessage = {
        role: "assistant",
        content: res.data.reply
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error("AI Error:", err);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="ai-container">

      <div className="chat-card">

        {/* HEADER */}
        <div className="ai-header">
          🤖 TaskOra AI Assistant
        </div>

        {/* CHAT AREA */}
        <div className="chat-area" ref={chatRef}>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? "chat-message user"
                  : "chat-message ai"
              }
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="chat-message ai">
              Typing...
            </div>
          )}

        </div>

        {/* INPUT AREA */}
        <div className="chat-input">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
};

export default AIPost;


