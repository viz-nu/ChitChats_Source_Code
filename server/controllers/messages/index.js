// route: /api/message/


import authMiddleware from "../../middlewares/auth.js";
import express from "express";
import Chats from "../../models/chatModels.js";
import users from "../../models/userModel.js";
import Message from "../../models/messageModel.js"
const messageRouter = express.Router()





// route: /api/message/
//Access:protected
//API for sending message
// req.body={content: , chatId:}
//req.user= yes
messageRouter.post("/", authMiddleware, async (req, res) => {
    const { content, chatId } = req.body
    if (!content || !chatId) res.status(400).json({ message: "invalid content or chatID" })
    try {
        let message = await Message.create({ sender: req.user._id, content: content, chat: chatId, })
        message = await message.populate("sender", "name picture")
        message = await message.populate("chat")
        message = await users.populate(message, { path: "chat.participants", select: "name email picture" })
        await Chats.findByIdAndUpdate(chatId, { latestMessage: message });
        res.status(200).json(message)


    } catch (error) {
        console.log(error);
        res.status(400).json({ messsage: "error at messageRouter while posting a message" })
    }
})



// route: /api/message/
//Access:protected
//API for getting all messages

messageRouter.get("/:chatId", authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name picture email").populate("chat")
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(400).json({ messsage: "error at messageRouter while fetching all messages" })
    }
})


export default messageRouter
