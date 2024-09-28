import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).send("You are not authenticated");

    // console.log('this is request',request);
    
    jwt.verify(token, process.env.JWT_KEY, async(err, payload) => {
        if (err) return response.status(403).send('Invalid token');

        request.userId = payload.userId;
        // console.log('this is from auth middleware',payload);
        // console.log('second request', request);
        
        
        next();
    })
}