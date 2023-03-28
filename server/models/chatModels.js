import mongoose from "mongoose"

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
    },
    { timestamps: true }
);


const Chats = mongoose.model("Chat", chatModel);

export default Chats