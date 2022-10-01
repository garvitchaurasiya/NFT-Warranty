import connectToMongoDB from '../../middleware/database';
import User from '../../models/User'

const handler = async (req, res) => {

    if (req.method === 'POST') {

        try {
            const { accountAddress } = req.body;
            const user = await User.findOne({ accountAddress })

            res.status(200).json({ success: true, warranties: user.warranties });

        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }


    } else {
        // Handle any other HTTP method
        res.status(500).send(req.method + " request is not allowed.");
    }

}
export default connectToMongoDB(handler);