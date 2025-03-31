const {validateToken} = require('./server/controller/validator');
const initializeSocket = require("./server/controller/socketConn");

const express = require('express');

const app = express();

const http = require('http');
const cors = require('cors');

const server = http.createServer(app);

require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(cors());

const login = require('./server/routers/login');
const register = require('./server/routers/register');
const vdRoom = require('./server/routers/virtualRoom');
const chat = require('./server/routers/chat');
const product = require('./server/routers/productRoutes');
const bid = require('./server/routers/bidRoutes');
const { connection } = require('./server/database/connection');

app.use('/api/', validateToken,login);
app.use('/api/', validateToken, register);
app.use('/api/', validateToken, vdRoom);
app.use('/api/', validateToken, chat);
app.use('/api/', validateToken, product);
app.use('/api/', validateToken, bid);

// Import and initialize Socket.io

initializeSocket(server);

connection();

const port = process.env.PORT || '4000';

app.set('port', port);

server.listen(port, '0.0.0.0', ()=>{
    console.log(`Server is running at ${port} `);
})




