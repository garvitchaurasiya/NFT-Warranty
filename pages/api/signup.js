import User from '../../models/User';
import connectToMongoDB from '../../middleware/database';
const CryptoJS = require('crypto-js');

const handler = async (req, res) => {

    if (req.method === 'POST') {

      try {
        let user = await User.findOne({accountAddress: req.body.accountAddress});
        if(user){
          return res.status(500).json({error: "Account already exists."});
        }

        const securedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.AES_SECRET).toString();

        user = new User({
            accountAddress: req.body.accountAddress,
            accountType: req.body.accountType,
            password: securedPassword
        })
        await user.save();
        res.status(200).json({user});

      } catch (error) {
        return res.status(500).send(error.message);
      }  


    } else {
      // Handle any other HTTP method
      res.status(500).send(req.method + " request is not allowed.");
    }
  
  }
  export default connectToMongoDB(handler);