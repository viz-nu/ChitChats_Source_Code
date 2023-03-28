import mongoose from "mongoose";
import config from 'config';
dbConnect();
async function dbConnect() {
    try {
        const conn = await mongoose.connect(config.get("MongoURL"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected`);
        
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

