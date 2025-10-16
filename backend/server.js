require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const generateResponse = require('./src/services/ai.service');

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const chatHistory = [];

io.on('connection', (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on('disconnect', () => {
    console.log("❌ A user disconnected:", socket.id);
  });

  socket.on('ai-message', async (data) => {
    console.log("💬 Received AI message:", data);
    chatHistory.push({ role: 'user', parts: [{ text: data }] });

    try {
      const response = await generateResponse(chatHistory);
      chatHistory.push({ role: 'model', parts: [{ text: response }] });
      socket.emit('ai-message-response', response);
    } catch (error) {
      console.error("⚠️ Error generating AI response:", error.message);
      socket.emit('ai-message-response', "Sorry, I ran into an issue.");
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
