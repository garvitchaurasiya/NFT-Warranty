import mongoose from 'mongoose';
// const connectToMongoDB = require('../../middleware/database'); not working when using require. why?
import connectToMongoDB from "../../middleware/database";
import User from '../../models/User';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const handler = async (req, res)=>{
    try {
        const {accountAddress, password} = req.body;
        let user = await User.findOne({accountAddress});
        if(!user){
            return res.status(400).json({success: false, error: "Invalid CredentialsA"});
        }

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(password != decryptedPassword){
            return res.status(400).json({success: false, error: "Invalid CredentialsP"});
        }

        const token = jwt.sign({accountAddress}, process.env.JWT_SECRET);
        // res.cookie('jwt', token, {
        //     expires: new Date(Date.now() + 100000),
        //     httpOnly: true
        // });
        res.json({success: true, token});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
}

export default connectToMongoDB(handler);