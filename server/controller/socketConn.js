const { Server } = require("socket.io");
const Message = require("../database/messages"); // Import Message Model

module.exports = function initializeSocket(server) {
    const appUrl = process.env.APP_URL// || "http://localhost:5173";
    const io = new Server(server, {
        cors: {
            origin: appUrl, // Adjust based on frontend URL
            methods: ["GET", "POST"]
        }
    });

    const users = {}; // Track connected users

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Store userId and socket.id for direct messaging
        socket.on("register_user", (userId) => {
            users[userId] = socket.id;
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });
        socket.on("typing", (data) => {
            console.log(`User ${data.receiverId} Typing`);
            io.to(users[data.receiverId]).emit("deliver", data);
        });

        socket.on("mark_as_read", async (data) => {
            await Message.updateMany(
                { senderId: data.senderId, receiverId: data.receiverId, isRead: false },
                { $set: { isRead: true } }
            );
        });
        
        // Handle private messages
        socket.on("send_message", async (data) => {
            const { senderId, receiverId, message } = data;
            console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

            // Save message in MongoDB
            const newMessage = new Message({
                senderId,
                receiverId,
                message,
                timestamp: new Date(),
                isRead: false // Initially unread
            });
            await newMessage.save();

            // Send message to the receiver if online
            const receiverSocketId = users[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", data);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            Object.keys(users).forEach((userId) => {
                if (users[userId] === socket.id) {
                    delete users[userId];
                }
            });
        });
    });

    return io;
};
