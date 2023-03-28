import express from "express";
import asyncHandler from "express-async-handler"
import users from "../../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userRegisterValidations, errorMiddleware, userLoginValidations } from "../../middlewares/validations.js"
import authMiddleware from "../../middlewares/auth.js"
import config from "config"
const { JWT, Google_key } = config.get("SECRET_KEYS")
const userRouter = express.Router()

userRouter.post('/auth', authMiddleware, async (req, res) => {
    try {
        let user = await users.findOne({ email: req.user.email });
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
    }

});
userRouter.get('/key', (req, res) => {
    try {
        res.status(200).json({ key: Google_key })
    } catch (error) {
        console.log(error);
    }
});
userRouter.post('/OauthRegister', async (req, res) => {
    try {
        var user = await users.findOne({ email: req.body.email })
        if (!user) {
            var user = new users(req.body)
            await user.save()
        }
        let token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, JWT, { expiresIn: "1h" })
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
userRouter.post('/register', userRegisterValidations(), errorMiddleware, asyncHandler(async (req, res) => {
    try {
        let user = await users.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ error: "user already exists" });
        const userDetails = new users(req.body);
        userDetails.password = await bcrypt.hash(userDetails.password, 12);
        await userDetails.save();
        let token = jwt.sign({ _id: userDetails._id, name: userDetails.name, email: userDetails.email }, JWT, { expiresIn: "1h" })
        res.status(200).json({ success: "Welcome", token })
    } catch (error) {
        res.status(500);
        console.log(error);
        throw new Error("Failed to create user due to internal Server error")
    }
}));
userRouter.post('/login', userLoginValidations(), errorMiddleware, asyncHandler(async (req, res) => {
    try {
        let user = await users.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ err: "Oops! we dont find your details in your Database, Please do register" });
        if (!(await bcrypt.compare(req.body.password, user.password))) return res.status(400).json({ error: "invalid credintials. please try again" });
        let token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, JWT, { expiresIn: "1h" })
        res.status(200).json({ success: "Welcome", token })
    } catch (error) {
        res.status(500);
        console.log(error);
        throw new Error("User failed to login  due to internal Server error")
    }
}));



//SEARCH API 
// route:/api/user/
// method:get
// 
// req.user={
// "_id": "640359bca3c7948a1e2eadf5",
//     "name": "Guest",
//         "email": "guest@example.com",
//             "iat": 1677950487,
//                 "exp": 1677954087
//     }
userRouter.get("/", authMiddleware, asyncHandler(async (req, res) => {
    const keyword = req.query.search ? { $or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }] } : {}

    const searchResults = await users.find(keyword).find({ _id: { $ne: req.user._id } })

    // console.log(req.user);

    res.status(200).json({ users: searchResults })
    // res.status(200).json({body:req.body,headers:req.headers,parms:req.params,query:req.query})
}))

userRouter.get("/mainUser", authMiddleware, asyncHandler(async (req, res) => {
    try {
        const mainUser = await users.findOne({ _id: req.user._id })
        res.status(200).json(mainUser)
    } catch (error) {
        console.log(error, "error at fetching main user");
    }


}))



export default userRouter