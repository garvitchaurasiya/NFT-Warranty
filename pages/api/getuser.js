import connectToMongoDB from '../../middleware/database';
const cookie = require('cookie');
const jwt = require('jsonwebtoken');


const handler = async (req, res) => {

    if (req.method === 'GET') {

      try {

        let cookies = cookie.parse(req.headers.cookie || '');
        // Get the visitor name set in the cookie
        const token = cookies.token;
        // console.log(token);

        if(!token){
          return res.status(401).json({error: "Authenticate the user using valid token"});
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({success: true, user: data.user});

      } catch (error) {
        return res.status(500).json( {success: false, error: error.message});
      }  


    } else {
      // Handle any other HTTP method
      res.status(500).send(req.method + " request is not allowed.");
    }
  
  }
  export default connectToMongoDB(handler);