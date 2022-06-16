require('dotenv').config();
const express = require('express');
const {chats} = require('./data');
const {connectdb} = require('./config/connectdb')
const {router} = require('./routes/userRoutes')
const chatRouter = require('./routes/chatRoutes')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");


const app = express();
connectdb;

app.use(express.json());

app.use('/api/user',router)
app.use('/api/chat',chatRouter)
app.use("/api/message", messageRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT,console.log('Server listening on port 5000'));