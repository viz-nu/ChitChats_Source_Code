import express from "express";
import config from "config"
import "./dbConnect.js"
import { fileURLToPath } from 'url';

import cors from "cors"



const port = config.get("Port")
const app = express();
app.use(cors())

//......................................................deployement...............................................
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});





//.................................................................................................................


app.use(express.json());
import userRouter from "./controllers/user/index.js";
app.use("/api/user", userRouter);
import chatRouter from "./controllers/chats/index.js";
app.use("/api/chat", chatRouter);
import messageRouter from "./controllers/messages/index.js";
app.use("/api/message", messageRouter);

const server = app.listen(port, () => console.log(`server up and running on ${port}`))

import { Server } from "socket.io";
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        // credentials: true, 
    },
});


io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected")
    })
    socket.on("join chat", (room) => socket.join(room))
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.participants) return console.log("chat.users not defined");
        chat.participants.forEach(ele => {
            if (ele._id == newMessageRecieved.sender._id) { return;}
            socket.to(ele._id).emit("message recieved", newMessageRecieved);
        })
    })
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})