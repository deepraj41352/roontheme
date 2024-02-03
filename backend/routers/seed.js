import express from 'express';
import User from '../Models/userModel.js';
import Category from '../Models/categoryModel.js';
import bcrypt from 'bcryptjs';
import data from '../seedData.js';
import Task from '../Models/taskModel.js';
import projectTask from '../Models/projectTaskModel.js';
import Conversation from '../Models/conversationModel.js';
import Message from '../Models/messageModel.js';
import Notification from '../Models/notificationModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Conversation.deleteMany({});
  await Message.deleteMany({});
  await Notification.deleteMany({});
  await projectTask.deleteMany({});
  await Task.deleteMany({});

  const updatedCategoryData = await Promise.all(
    data.category.map(async (el) => {
      return {
        categoryName: el.categoryName,
        categoryDescription: el.categoryDescription,
      };
    })
  );
  const Categories = await Category.insertMany(updatedCategoryData);
  if (Categories) {
    const updatedUserData = await Promise.all(
      data.users.map(async (el, index) => {
        const hashedPassword = await bcrypt.hash(el.password, 8);
        return {
          first_name: el.first_name,
          last_name: el.last_name,
          email: el.email,
          password: hashedPassword,
          role: el.role,
          isConfirmed: true,
          ...(el.role === 'agent'
            ? { agentCategory: [Categories[index % Categories.length]._id] }
            : {}),
        };
      })
    );

    const Users = await User.insertMany(updatedUserData);
    res.send({ Users, Categories });
  }
});

export default seedRouter;
