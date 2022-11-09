import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccountSchema = new Schema({
    accountAddress: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    warranties: {
        type: Array
    }
}, {timestamps: true});

mongoose.models = {}
export default mongoose.model('Account', AccountSchema);