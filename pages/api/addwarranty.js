import connectToMongoDB from '../../middleware/database';
import User from '../../models/User'

const handler = async (req, res) => {

    if (req.method === 'POST') {

      try {

        const {accountAddress, tokenId} = req.body;
        await User.findOneAndUpdate({accountAddress}, { "$push": { "warranties": tokenId } })

        res.status(200).json({success: true});

      } catch (error) {
        return res.status(500).json( {success: false, error: error.message});
      }  


    } else {
      // Handle any other HTTP method
      res.status(500).send(req.method + " request is not allowed.");
    }
  
  }
  export default connectToMongoDB(handler);