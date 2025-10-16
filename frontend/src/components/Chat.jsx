import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import MessageBubble from "./MessageBubble";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("ai-message-response", (response) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    socket.emit("ai-message", input);
    setInput("");
    setIsTyping(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col w-full max-w-2xl h-[90vh] bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-center font-bold text-lg">
        🦗 AI Chatbot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-400 text-sm animate-pulse">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
            <span>AI is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/50 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={sendMessage}
          className="ml-3 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold shadow-md transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}
