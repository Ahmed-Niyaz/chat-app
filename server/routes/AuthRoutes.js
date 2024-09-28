import { Router } from "express";
import { addProfileImg, deleteProfileImg, getSelectedUserInfoForShowingBio, getUserInfo, login, logout, signup, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/profiles/' })

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/add-profile-image', verifyToken, upload.single('profile-image'), addProfileImg);
authRoutes.delete('/delete-profile-image', verifyToken, deleteProfileImg);
authRoutes.post('/logout', logout);

authRoutes.post('/get-selected-user-info', getSelectedUserInfoForShowingBio);


export default authRoutes;