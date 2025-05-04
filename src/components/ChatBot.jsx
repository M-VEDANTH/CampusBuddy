import React, { useEffect, useRef, useState } from "react";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import "./styles/ChatBot.css";

// Lex config
const REGION = import.meta.env.REGION;
const BOT_ID = import.meta.env.BOT_ID;
const BOT_ALIAS_ID = import.meta.env.BOT_ALIAS_ID;
const LOCALE_ID = import.meta.env.LOCALE_ID;

const SESSION_ID = crypto.randomUUID();


const client = new LexRuntimeV2Client({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.SECRET_ACCESS_KEY,
  },
});

// Lex client


const LexChatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m CampusBuddy — how can I help you today?" },
  ]);
  const chatWindowRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔁 Return all messages from Lex
  const sendMessageToLex = async (text) => {
    const command = new RecognizeTextCommand({
      botId: BOT_ID,
      botAliasId: BOT_ALIAS_ID,
      localeId: LOCALE_ID,
      sessionId: SESSION_ID,
      text,
    });

    try {
      const response = await client.send(command);
      return (
        response.messages?.map((msg) => msg.content) ||
        ["🤔 Hmm... I’m not sure how to respond."]
      );
    } catch (err) {
      console.error("Lex Error:", err);
      return ["⚠️ Sorry, something went wrong while contacting CampusBuddy."];
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botReplies = await sendMessageToLex(trimmed);
    const botMessages = botReplies.map((text) => ({ from: "bot", text }));

    setMessages((prev) => [...prev, ...botMessages]);
  };

  return (
    <div className="chatbot-container">
    {/* Title */}
    
    <div className="chat-title">Campus Buddy</div>
  
    {/* Chat area */}
    <div className="chat-window" ref={chatWindowRef}>
      {messages.map((m, idx) => (
        <div
          key={idx}
          className={`chat-message ${m.from === "user" ? "user" : "bot"}`}
        >
          {m.text.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      ))}
    </div>
  
    {/* Input bar */}
    <div className="chat-input-bar">
      <input
        type="text"
        placeholder="Ask anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>➤</button>
    </div>
  </div>
  
  );
};

export default LexChatbot;
