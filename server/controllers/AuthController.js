import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 10000 * 10000 * 19999;

function createToken(email, userId) {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
}

export const signup = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }

    // while creating the user password will be hashed
    const user = await UserModel.create({ email, password });

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true, // Must be true if SameSite=None
      sameSite: "None",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        bio: user.bio,
        color: user.color,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).send("Email and Password is requied.");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send("No user available with that email");
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).send("Invalid credentials");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true, // Must be true if SameSite=None
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        bio: user.bio,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).send("User with the given id not found.");
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        bio: user.bio,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;

    const { firstName, lastName, color, bio } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .send("First Name, Last Name and Color are required");
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        bio,
        profileSetup: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
      bio: user.bio,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImg = async (req, res) => {
  try {
    const { userId } = req;

    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();

    let fileName = "uploads/profiles/" + date + req.file.originalname;

    renameSync(req.file.path, fileName);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        image: fileName,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      image: user.image,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const deleteProfileImg = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).send("user not found");
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;

    await user.save();

    return res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      secure: true, // Must be true if SameSite=None
      sameSite: "None",
    });
    res.status(200).send("Logout successful.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getSelectedUserInfoForShowingBio = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(404).send("Please provide id");
    }

    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).send("No user with that id");
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        bio: user.bio,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
