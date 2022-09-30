// const connectToMongoDB = require('../../middleware/database'); not working when using require. why?
import connectToMongoDB from "../../middleware/database";
import { serialize } from 'cookie';

const handler = async (req, res) => {
    try {

        res.setHeader('Set-Cookie', serialize('token', '', {
            path: '/',
            httpOnly: true,
            maxAge: -1
        }));
        
        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false, error: "Something Went Wrong!" });
    }
}

export default connectToMongoDB(handler);