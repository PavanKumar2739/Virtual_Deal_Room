const { Server } = require("socket.io");
const Message = require("../database/messages"); // Import Message Model
const client = require('./redisClient');
const { redisSetAllMessages, redisSetMessage } = require("../utility/redisUtility");

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
        socket.on("register_user", async(userId) => {
            users[userId] = socket.id;
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            //emit online users count
           if(Object.keys(users).length>0){//redis impl for register users
            await client.hset('chat:registerUser', users);
            await client.expire('chat:registerUser', 600);
            io.emit("online_users",userId);
           }
        });

        socket.on("typing", (data) => {
            console.log(`User ${data.receiverId} Typing`);
            io.to(users[data.receiverId]).emit("deliver", data);
        });

     

        socket.on("mark_as_read", async ({ senderId, receiverId }) => {
            // Update unread messages
            const updated = await Message.updateMany(
                { senderId, receiverId, isRead: false },
                { $set: { isRead: true } }
            );
        
            // Optionally fetch the updated messages (for detailed UI updates)
            const updatedMessages = await Message.find({
                senderId,
                receiverId,
                isRead: true,
            });

            //update redis isRead value
            await client.del(`messages:${senderId}:${receiverId}`);
            await redisSetAllMessages(senderId,receiverId, updatedMessages);

        
            // Emit to sender so they can update UI
            if (users[senderId]) {

                const senderSocket = io.sockets.sockets.get(users[senderId]);
                senderSocket.emit("message_status_update", {
                    senderId,
                    receiverId,
                    updatedMessages,
                });
            }
        });
        

        // socket.on("message_status_update", ({ updatedMessages }) => {
        //     setMessages((prevMessages) =>
        //         prevMessages.map((msg) => {
        //             const updated = updatedMessages.find((um) => um._id === msg._id);
        //             return updated ? { ...msg, ...updated } : msg;
        //         })
        //     );
        // });
        
        
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

            //redis save new record
            await redisSetMessage(senderId,receiverId, newMessage);

            // Send message to the receiver if online
            const receiverSocketId = users[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", data);
            }
        });

        // Handle disconnection
        socket.on("disconnect", async() => {
            console.log("User disconnected:", socket.id);
            Object.keys(users).forEach(async(userId) => {
                if (users[userId] === socket.id) {
                    delete users[userId];
                     // Remove user from Redis hash
                    await client.hdel("chat:registerUser", userId);
                }
            });
        });
    });

    return io;
};
