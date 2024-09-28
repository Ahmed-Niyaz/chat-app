import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import ChannelModel from "../models/ChannelModel.js";


export const createChannel = async (req, res) => {
    try {
        const {name, members} = req.body;
        const userId = req.userId;

        const admin = await UserModel.findById(userId);

        if (!admin) {
            return res.status(400).send('Admin user not found.')
        }
        
        const validMembers = await UserModel.find( { _id: { $in: members } })
        
        if (validMembers.length !== members.length) {
            return res.status(400).send('Some members are not valid users.')
        }

        const newChannel = new ChannelModel({
            name,
            members,
            admin: userId
        });

        await newChannel.save();

        return res.status(201).json({ channel: newChannel });

    } catch (error) {
        res.status(500).send("internal error")
    }
}

export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const channels = await ChannelModel.find({
            $or: [{ admin: userId}, {members: userId}]
        }).sort({ updatedAt: -1 })


        return res.status(201).json({ channels });

    } catch (error) {
        res.status(500).send("internal error")
    }
}