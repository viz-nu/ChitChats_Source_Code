

// route: /api/chat/


import authMiddleware from "../../middlewares/auth.js";
import express from "express";
import Chats from "../../models/chatModels.js";
import users from "../../models/userModel.js"
const chatRouter = express.Router()





// route: /api/chat/
//Access:protected
//API for post chats
// req.body=id of his friend
//req.user=logged in user
chatRouter.post("/", authMiddleware, async (req, res) => {
    const { friendId } = req.body
    if (!friendId) {
        console.log("friend Id not sent");
        return res.sendStatus(400)
    }
    try {
        let isChat = await Chats.find({
            isGroupChat: false,
            $and: [
                { participants: { $elemMatch: { $eq: req.user._id } } },
                { participants: { $elemMatch: { $eq: friendId } } }
            ]
        }).populate("participants", "name email picture").populate("latestMessage");
        isChat = await users.populate(isChat, { path: "latestMessage.sender", select: "name email picture", })
        if (isChat.length > 0) res.send(isChat[0])
        else {
            let chatData = { chatname: "sender", isGroupChat: false, participants: [req.user._id, friendId] };
            const createdChat = await Chats.create(chatData)
            const FullChat = await Chats.findOne({ _id: createdChat._id }).populate("participants", "name email picture")
            res.status(200).send(FullChat)
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
})
//API to fetch chats
chatRouter.get("/", authMiddleware, async (req, res) => {
    try {

        let result = await Chats.find({ participants: { $eq: req.user._id } })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
        result = await users.populate(result, {
            path: "latestMessage.sender",
            select: "name picture email"
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
})
// API for create groupchats
//req.user=decoded user with name , email and _id
//req.body={name:"groupname",
// participants=[{fulldetails},{fulldetails},{fulldetails}]
// }
chatRouter.post("/addGroup", authMiddleware, async (req, res) => {
    const { name, participants } = req.body
    if (participants.length < 2) { res.status(400).json({ message: "add atleast 2 members excluding you" }) }
    participants.push({ _id: req.user._id })
    try {
        const groupChat = await Chats.create({
            chatName: name,
            isGroupChat: true,
            participants: participants,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chats.findOne({ _id: groupChat._id }).populate("participants", "-password").populate("groupAdmin", "-password");
        // console.log(fullGroupChat);
        res.status(200).json(fullGroupChat)
    } catch (error) {
        console.log(error);
    }





})
// API for renaming

//req.body={ChatId,chatNewName}
chatRouter.put("/rename", authMiddleware, async (req, res) => {
    try {
        const { ChatId, chatNewName } = req.body
        const updatedName = await Chats.findByIdAndUpdate(ChatId, { chatName: chatNewName }, { new: true }).populate("participants", "-password").populate("groupAdmin", "-password");
        if (!updatedName) { res.status(404).json({ message: "Chat not found" }) }
        else { res.status(200).json(updatedName) }
    } catch (error) {
        console.log(error);
    }

})
// Api for adding to grp
//req.body={ChatId,NewParticipant}
chatRouter.put("/addPersonToGroup", async (req, res) => {
    try {
        const { ChatId, NewParticipant } = req.body
        const updatedParticipant = await Chats.findByIdAndUpdate(ChatId, { $push: { participants: NewParticipant } }, { new: true }).populate("participants", "-password").populate("groupAdmin", "-password");
        if (!updatedParticipant) { res.status(404).json({ message: "Chat not found" }) }
        else { res.status(200).json(updatedParticipant) }
    } catch (error) {
        console.log(error);
    }
})
// API for remove person
//req.body={ChatId,BadParticipant}
chatRouter.put("/removePersonFromGroup", async (req, res) => {
    try {
        const { ChatId, BadParticipant } = req.body
        const updatedParticipant = await Chats.findByIdAndUpdate(ChatId, { $pull: { participants: BadParticipant } }, { new: true }).populate("participants", "-password").populate("groupAdmin", "-password");
        if (!updatedParticipant) { res.status(404).json({ message: "Chat not found" }) }
        else { res.status(200).json(updatedParticipant) }
    } catch (error) {
        console.log(error);
    }
})


export default chatRouter
