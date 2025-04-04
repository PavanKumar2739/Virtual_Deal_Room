import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Container, TextField, Button, Typography, Paper, Box, Drawer, Avatar, ListItemText, List, ListItem, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setProductData, setShowChat } from "../../pages/pageSlice";
import { ServiceRequest } from "../../app/apis/serviceReq";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";

const socket = io(import.meta.env.REST_URL || "http://localhost:4000");

function Chat({ currentUser, buyerId }) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [users, setUsers] = useState([]); // Store list of users with conversations
    const [selectedChat, setSelectedChat] = useState(null); // Store selected user to chat
    const [chatPartner, setChatPartner] = useState();
    const product = useSelector(state => state.page.product);


    const isOpen = useSelector(state => state.page.showChat);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        socket.emit("register_user", currentUser);
        fetchMessages();

        // Listen for new messages
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // Listen for typing event
        socket.on("deliver", (data) => {

            console.log(data.senderId, "typing")
            if (data.senderId === chatPartner) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000); // Hide after 2 sec
            }
        });

        return () => {
            socket.off("receive_message");
            socket.off("deliver");
        };
    }, [currentUser, chatPartner]);


    useEffect(() => {
        fetchUsers();
        if (!buyerId) {

            if (product) {
                handleUserClick(product.sellerId);
            }
        }
        else {
            setChatPartner(buyerId);
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const resp = await ServiceRequest.callPostApi(`/getChatUsers/${currentUser}`, {});
            setUsers(resp); // List of users who had conversations
        } catch (e) {
            if (e.response?.status === 403) {
                navigate('/login');
            }
            console.log(e);
        }
    };

    const fetchMessages = async () => {
        try {
            const resp = await ServiceRequest.callPostApi(`/chat/${currentUser}/${chatPartner}`, {});
            setMessages(resp);
            socket.emit("mark_as_read", { senderId: chatPartner, receiverId: currentUser });
        } catch (e) {
            if (e.response?.status === 403) {
                navigate('/login');
            }
            console.log(e);
        }
    };

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                senderId: currentUser,
                receiverId: chatPartner,
                message,
                read: false
            };

            socket.emit("send_message", msgData);
            setMessages((prev) => [...prev, { ...msgData, read: true }]); // Assume read instantly for sender
            setMessage("");
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", { senderId: currentUser, receiverId: chatPartner });
    };
    const handleUserClick = (user) => {
        setChatPartner(user);
    }
    const handleBack = () => {
        setChatPartner(null);
        dispatch(setProductData(null));
    }

    return (
        <Drawer anchor="right" open={isOpen} onClose={() => dispatch(setShowChat(false))}>
            <Container sx={{ width: "400px", mt: 2 }}>
                {chatPartner ? (
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                        {/* Header - Back Button + Avatar + Username */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 2 }}>
                            {/* Back Button */}
                            <IconButton onClick={() => handleBack()} sx={{ mr: 1 }}>
                                <ArrowBackIcon />
                            </IconButton>

                            {/* Avatar & Username - Aligned Properly */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Avatar sx={{ bgcolor: "#1976d2" }}>
                                    {chatPartner?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="h6">{chatPartner}</Typography>
                            </Box>
                        </Box>

                        {/* Messages Box */}
                        <Box sx={{
                            height: "400px",
                            overflowY: "auto",
                            mb: 2,
                            p: 1,
                            bgcolor: "#f5f5f5",
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {messages.map((msg, index) => (
                                <Box key={index} sx={{
                                    textAlign: msg.senderId === currentUser ? "right" : "left",
                                    backgroundColor: msg.senderId === currentUser ? "#1976d2" : "#e0e0e0",
                                    color: msg.senderId === currentUser ? "white" : "black",
                                    borderRadius: 2,
                                    p: 1,
                                    maxWidth: "75%",
                                    alignSelf: msg.senderId === currentUser ? "flex-end" : "flex-start",
                                    m: "5px",
                                    position: "relative"
                                }}>
                                    <Typography variant="body1">{msg.message}</Typography>

                                    {/* Timestamp & Read Receipts */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontSize: "0.7rem",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: "4px",
                                            mt: 0.5,
                                            color: msg.senderId === currentUser ? "rgba(255,255,255,0.7)" : "gray"
                                        }}
                                    >
                                        {msg.timestamp ? format(new Date(msg.timestamp), "p") : ""}
                                        {msg.senderId === currentUser && (msg.isRead ? "✔✔" : "✔")}
                                    </Typography>
                                </Box>
                            ))}  <div ref={messagesEndRef} />
                        </Box>

                        {/* Typing Indicator */}
                        {isTyping && (
                            <Typography sx={{ color: "gray", fontStyle: "italic" }}>
                                {chatPartner} is typing...
                            </Typography>
                        )}

                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Type a message"
                            value={message}
                            onChange={handleTyping}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button variant="contained" color="primary" onClick={sendMessage} sx={{ mt: 2 }} fullWidth>
                            Send
                        </Button>
                    </Paper>
                ) : (
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center", width: "100%", maxWidth: "400px", margin: "auto" }}>
                        <Typography variant="h6" gutterBottom>Chats History</Typography>
                        <List>
                            {users.map((user) => (
                                <ListItem key={user} button onClick={() => handleUserClick(user)}>
                                    <ListItemText primary={user} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Container>
        </Drawer>
    );
}

export default Chat;
