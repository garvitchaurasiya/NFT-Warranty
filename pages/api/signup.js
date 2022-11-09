import Account from '../../models/Account';
import connectToMongoDB from '../../middleware/database';
const CryptoJS = require('crypto-js');

const handler = async (req, res) => {

    if (req.method === 'POST') {

      try {
        let user = await Account.findOne({accountAddress: req.body.accountAddress});
        if(user){
          return res.status(500).json({success: false, error: "Account already exists."});
        }

        const securedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.AES_SECRET).toString();

        user = new Account({
            accountAddress: req.body.accountAddress,
            accountType: req.body.accountType,
            password: securedPassword
        })
        await user.save();
        res.status(200).json({success: true, user});

      } catch (error) {
        return res.status(500).json( {success: false, error: "Something Went Wrong!"});
      }  


    } else {
      // Handle any other HTTP method
      res.status(500).send(req.method + " request is not allowed.");
    }
  
  }
  export default connectToMongoDB(handler);