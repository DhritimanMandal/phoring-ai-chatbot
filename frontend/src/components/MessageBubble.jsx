import React from "react";
import { motion } from "framer-motion";

export default function MessageBubble({ role, text }) {
  const isUser = role === "user";
  const avatar = isUser
    ? "https://api.iconify.design/mdi:account-circle.svg?color=white"
    : "https://api.iconify.design/mdi:robot-outline.svg?color=white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <img src={avatar} alt="AI" className="w-8 h-8 rounded-full" />}

      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm md:text-base leading-relaxed shadow-md ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        {text}
      </div>

      {isUser && <img src={avatar} alt="User" className="w-8 h-8 rounded-full" />}
    </motion.div>
  );
}
