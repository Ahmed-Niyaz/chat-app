import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
    },
    color: {
        type: Number,
        default: 1,
    },
    profileSetup: {
        type: Boolean,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    bio: {
        type: String,
        default: "Hey I'm on react chat app",
    }
});


userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const UserModel = mongoose.model('users', userSchema);

export default UserModel;