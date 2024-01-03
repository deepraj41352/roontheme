import express from 'express';
import User from '../Models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import {
  generateToken,
  sendEmailNotify,
  isAuth,
  isAdminOrSelf,
  baseUrl,
} from '../util.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { storeNotification } from '../server.js';
import { Socket, io } from 'socket.io-client';
import mongoose from 'mongoose';
// import translate, { TranslateResult } from 'google-translate-api';

const userRouter = express.Router();
const upload = multer();
const SocketUrl = process.env.SOCKETURL || 'ws://localhost:8900';
const socket = io(SocketUrl);

socket.emit('connectionForNotify', () => {
  console.log('connectionForNotif user connnercted');
});

userRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const role = req.body.role;
    try {
      const confirmedUsers = await User.find({ role }).sort({ createdAt: -1 });
      const users = confirmedUsers.filter((user) => user.isConfirmed === true);
      const sanitizedUsers = users.map(
        ({ password, passresetToken, ...other }) => other._doc
      );
      res.json(sanitizedUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

userRouter.put(
  '/update/:id',
  isAuth,
  isAdminOrSelf,
  upload.single('file'),
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.file) {
        const profile_picture = await uploadDoc(req);
        req.body.profile_picture = profile_picture;
      }

      const user = await User.findById(req.params.id);
      if (user._id == req.params.id) {
        function capitalizeFirstLetter(data) {
          return data && data.charAt(0).toUpperCase() + data.slice(1);
        }

        const {
          first_name,
          last_name,
          email,
          agentCategory,
          userStatus,
          profile_picture,
        } = req.body;
        const lowerCaseEmail = email.toLowerCase();
        const updatedData = {
          first_name: capitalizeFirstLetter(first_name),
          last_name: capitalizeFirstLetter(last_name),
          email: lowerCaseEmail,
          profile_picture,
          userStatus,
          agentCategory,
        };
        await user.updateOne({ $set: updatedData });

        res.status(200).json('update successfully');
      } else {
        res.status(403).json('you can not update');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const email = req.body.email;
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      user.passresetToken = token;
      await user.save();

      const resetLink = `${baseUrl()}/reset-password/${token}`;
      const options = {
        to: `<${user.email}>`,
        subject: 'Reset Password ✔',
        template: 'RESET-PASS',
        resetLink,
      };

      // Send the email
      const checkMail = await sendEmailNotify(options);

      if (checkMail) {
        res.send({
          message: `We sent a reset password link to your email.`,
        });
      } else {
        res.status(404).send({ message: 'Email sending failed' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ passresetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const email = req.body.email;
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        if (user.isConfirmed) {
          const updatedUser = await User.findOneAndUpdate(
            { email: lowerCaseEmail },
            { lastLogin: new Date() },
            { new: true }
          );

          const { password, passresetToken, ...other } = updatedUser._doc;
          const userData = { ...other, token: generateToken(updatedUser) };
          res.send(userData);
          return;
        } else {
          res.status(401).send({
            message: 'User not confirmed. Please confirm your email.',
          });
          return;
        }
      } else {
        res.status(401).send({ message: 'Incorrect password' });
        return;
      }
    }

    res.status(401).send({ message: 'User not found' });
  })
);

function generateUniqueToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    try {
      const { first_name, last_name, email, role } = req.body;
      const lowerCaseEmail = email.toLowerCase();
      const existingUser = await User.findOne({ email: lowerCaseEmail });

      if (existingUser) {
        return res
          .status(400)
          .send({ message: 'Email is already registered.' });
      }
      const confirmationToken = generateUniqueToken();
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      function capitalizeFirstLetter(data) {
        return data && data.charAt(0).toUpperCase() + data.slice(1);
      }
      const newUser = new User({
        first_name: capitalizeFirstLetter(first_name),
        last_name: capitalizeFirstLetter(last_name),
        email: lowerCaseEmail,
        password: hashedPassword,
        role,
        confirmationToken,
      });
      const user = await newUser.save();
      const { password, ...other } = user._doc;

      const confirmationLink = `${baseUrl()}/confirm/${confirmationToken}`;
      const emailSubject = 'Confirm your registration';
      const UserName = user.first_name;
      const options = {
        to: `<${user.email}>`,
        subject: emailSubject,
        template: 'CONFIRM-REG',
        confirmationLink,
        UserName,
      };

      // Send the email
      const checkMail = await sendEmailNotify(options);

      if (checkMail) {
        res.send({
          message: `We sent a Confirmation link to your email.`,
          other,
        });
      } else {
        res.status(404).send({ message: 'Email sending failed' });
      }
      if (user) {
        const notifyUser = user._id;
        const message = `welcome ${user.first_name}`;
        const status = 'unseen';
        const type = 'User';
        storeNotification(message, notifyUser, status, type);
        socket.emit('notifyUserBackend', notifyUser, message);
      }
      res
        .status(201)
        .send({ message: 'User registered successfully. please Login', other });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Registration failed. Please try again later.' });
    }
  })
);

// confirm sigup
userRouter.post(
  '/confirm',
  expressAsyncHandler(async (req, res) => {
    try {
      const { token } = req.body;
      const user = await User.findOne({ confirmationToken: token });
      if (!user) {
        return res.status(400).send({ message: 'Invalid confirmation token.' });
      }
      if (user.isConfirmed) {
        return res.status(401).send({ message: 'User is already confirmed.' });
      }
      user.isConfirmed = true;
      await user.save();
      res.status(200).send({
        message: 'Email confirmed successfully. You can now log in.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Confirmation failed. Please try again later.',
      });
    }
  })
);

userRouter.post(
  '/massege',
  expressAsyncHandler(async (req, res) => {
    try {
      const { token } = req.body;
      const user = await User.findOne({ confirmationToken: token });
      const isConfirmed = user.isConfirmed;
      // Check if the user is already confirmed
      if (isConfirmed) {
        return res.status(400).send({ message: 'User is already confirmed.' });
      }

      res.status(200).send({
        message: 'Are you sure you want to register?',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Confirmation failed. Please try again later.',
      });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  upload.single('file'),
  expressAsyncHandler(async (req, res) => {
    try {
      const userdata = await User.findById(req.user._id);
      if (userdata) {
        if (req.file) {
          const profile_picture = await uploadDoc(req);
          req.body.profile_picture = profile_picture;
        }

        if (req.body.password) {
          req.body.password = bcrypt.hashSync(req.body.password, 8);
        }
        function capitalizeFirstLetter(data) {
          return data && data.charAt(0).toUpperCase() + data.slice(1);
        }
        capitalizeFirstLetter(req.body.first_name);
        capitalizeFirstLetter(req.body.last_name);

        const {
          first_name,
          last_name,
          email,
          role,
          profile_picture,
          userStatus,
          phone_number,
          gender,
          dob,
          address,
          country,
        } = req.body;
        const updatedData = {
          first_name: capitalizeFirstLetter(first_name),
          last_name: capitalizeFirstLetter(last_name),
          email,
          role,
          profile_picture,
          userStatus,
          phone_number,
          gender,
          dob,
          address,
          country,
        };
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.user._id },
          { $set: updatedData },
          { new: true }
        );
        const { password, passresetToken, ...other } = updatedUser._doc;
        const userData = { ...other, token: generateToken(updatedUser) };
        res.send({
          userData,
        });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      console.log('Error ', error);
    }
  })
);

export const uploadDoc = async (req, mediaType) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: mediaType, // 'video' or 'audio'
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const profileUri = await streamUpload(req);

    return profileUri.url;
  } catch (error) {
    console.log('Cloudinary Error ', error);
  }
};

userRouter.post(
  '/add',
  isAuth,
  isAdminOrSelf,
  upload.single('file'),
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.file) {
        const profile_picture = await uploadDoc(req);
        req.body.profile_picture = profile_picture;
      }

      function capitalizeFirstLetter(data) {
        return data && data.charAt(0).toUpperCase() + data.slice(1);
      }
      const {
        first_name,
        last_name,
        email,
        role,
        agentCategory,
        userStatus,
        profile_picture,
      } = req.body;
      const lowerCaseEmail = email.toLowerCase();
      console.log('agentCategory', agentCategory);
      const existingUser = await User.findOne({ email: lowerCaseEmail });
      if (existingUser) {
        return res
          .status(400)
          .send({ message: 'Email is already registered.' });
      }
      if (role === 'agent') {
        if (agentCategory == '' || agentCategory == null) {
          return res.status(400).send({ message: 'Wrong Category Provided' });
        }
      }
      const hashedPassword = await bcrypt.hash('RoonBerg@123', 8);

      const data = {
        first_name: capitalizeFirstLetter(first_name),
        last_name: capitalizeFirstLetter(last_name),
        email: lowerCaseEmail,
        password: hashedPassword,
        role: capitalizeFirstLetter(role),
        profile_picture,
        agentCategory,
        userStatus,
        isConfirmed: true,
        ...(role === 'agent' ? { agentCategory } : {}),
      };
      const newUser = new User(data);
      const userinfo = await newUser.save();
      const user = await User.findOne({ email: lowerCaseEmail });
      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '3d',
        });

        user.passresetToken = token;
        await user.save();

        const resetLink = `${baseUrl()}/reset-password/${token}`;
        const options = {
          to: `<${user.email}>`,
          subject: 'Create Password ✔',
          template: 'RESET-PASS-ADD',
          resetLink: resetLink,
          first_name: user.first_name,
        };
        await sendEmailNotify(options);
      } else {
        res.status(404).send({ message: 'User not found' });
      }
      const { password, ...other } = userinfo._doc;
      res.status(200).send({ message: 'User created successfully', other });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'User creation failed. Please try again later.' });
    }
  })
);

// get single user

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(400).json({ message: 'user not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

// get User Role
userRouter.get(
  '/role/:userId',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select('role');
      if (!user) {
        res.status(400).json({ message: 'user not found' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

userRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

export default userRouter;
