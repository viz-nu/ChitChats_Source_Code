import mongoose from "mongoose"

const userModel = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        picture: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }
    },
    { timestamps: true }
);

const users = mongoose.model("users", userModel);

export default users