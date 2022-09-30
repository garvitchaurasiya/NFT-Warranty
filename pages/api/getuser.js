import connectToMongoDB from '../../middleware/database';
const cookie = require('cookie');

const handler = async (req, res) => {

    if (req.method === 'GET') {

      try {

        let cookies = cookie.parse(req.headers.cookie || '');
        // Get the visitor name set in the cookie
        const token = cookies.token;
        
        res.status(200).json({success: true});

      } catch (error) {
        return res.status(500).json( {success: false, error: "Something Went Wrong!"});
      }  


    } else {
      // Handle any other HTTP method
      res.status(500).send(req.method + " request is not allowed.");
    }
  
  }
  export default connectToMongoDB(handler);