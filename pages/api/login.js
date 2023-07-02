import connectToMongoDB from "../../middleware/database";
import Account from '../../models/Account';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
import { serialize } from 'cookie';

const handler = async (req, res) => {
    try {
        const { accountAddress, password } = req.body;
        let user = await Account.findOne({ accountAddress });
        if (!user) {
            return res.status(400).json({ success: false, error: "Account doesn't exists. Please try to Sign Up!" });
        }

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (password != decryptedPassword) {
            return res.status(400).json({ success: false, error: "Invalid Credentials" });
        }

        // user = await Account.findOne({ accountAddress }).select('-password');
        const { accountType} = user;

        const token = jwt.sign({ user: {accountAddress, accountType} }, process.env.JWT_SECRET);

        res.setHeader('Set-Cookie', serialize('token', token, {
            path: '/',
            httpOnly: true,
            // maxAge: 60*60*24
        }));
        
        res.json({ success: true, token });

    } catch (error) {
        res.status(500).json({ success: false, error: "Something Went Wrong!" });
    }
}

export default connectToMongoDB(handler);