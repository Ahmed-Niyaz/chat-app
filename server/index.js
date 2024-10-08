import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'
import contactsRoutes from './routes/ContactsRoutes.js'
import setupSocket from './socket.js'
import messagesRoutes from './routes/MessagesRoute.js'
import channelRoutes from './routes/ChannelsRoute.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.MONGO_URI;

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use('/uploads/profiles', express.static('uploads/profiles'))
app.use('/uploads/files', express.static('uploads/files'))

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/channel', channelRoutes);

app.get('/', (req, res) => {
    res.send("Api is working fine")
})

const startServer = async () => {
    try {
        const server = app.listen(port, async () => {
            await mongoose.connect(databaseURL);
            console.log(`Server is running at http://localhost:${port}`);
            console.log('DB connected');
        });

        setupSocket(server);

    } catch (error) {
        console.log(error);
    }
}

startServer();
