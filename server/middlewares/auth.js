import jwt from "jsonwebtoken";
import config from "config";
let { JWT } = config.get("SECRET_KEYS")
async function authMiddleware(req, res, next) {
    try {
        // console.log(req);
        let decoded = jwt.verify(req.headers["user-info"], JWT);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("error at auth middleware (token invalid)");
        return res.status(401).json({ error: 'Unauthorised or Token Expired' });
    }
}

export default authMiddleware;