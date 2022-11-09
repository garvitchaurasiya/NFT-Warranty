import Account from '../../models/Account';
import connectToMongoDB from '../../middleware/database';

const handler = async (req, res) => {

    if (req.method === 'POST') {

      try {
        
        const {accountAddress, sendTo, tokenId} = req.body;
        toString(tokenId);

        const user = await Account.findOne({accountAddress});
        console.log(user);

        let warranties = user.warranties;
        console.log('prev', warranties);
        for(var index=0; index<warranties.length; index++){
            if(warranties[index]===tokenId){
                warranties.splice(index, 1);
                break;
            }
        }
        console.log('next', warranties);

        
        await Account.findOneAndUpdate({accountAddress}, {warranties});
        // console.log(user);

        await Account.findOneAndUpdate({accountAddress: sendTo}, { "$push": { "warranties": tokenId } })

        res.status(200).json({success: true});

      } catch (error) {
        console.log(error.message);
        return res.status(500).json( {success: false, error: "Something Went Wrong!"});
      }  


    } else {
      // Handle any other HTTP method
      res.status(500).send(req.method + " request is not allowed.");
    }
  
  }
  export default connectToMongoDB(handler);