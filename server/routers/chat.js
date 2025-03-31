const express = require("express");
const router = express.Router();
const Message = require("../database/messages");

// Get chat history between two users
router.post("/chat/:user1/:user2", async (req, res) => {
    const { user1, user2 } = req.params;
    
    try {
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
});

// **API: Fetch users with whom the current user has chatted**
router.post("/getChatUsers/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const users = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderId: username }, { receiverId: username }]
                }
            },
            {
                $group: {
                    _id: null,
                    chatPartners: {
                        $addToSet: {
                            $cond: {
                                if: { $eq: ["$senderId", username] },
                                then: "$receiverId",
                                else: "$senderId"
                            }
                        }
                    }
                }
            }
        ]);

        res.json(users.length > 0 ? users[0].chatPartners : []);
    } catch (error) {
        console.error("Error fetching chat users:", error);
        res.status(500).json({ error: "Failed to fetch chat users" });
    }
});


module.exports = router;
