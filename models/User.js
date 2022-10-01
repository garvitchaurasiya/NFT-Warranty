import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
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
export default mongoose.model('User', UserSchema);