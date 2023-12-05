import express from 'express';
import User from '../Models/userModel.js';
import Category from '../Models/categoryModel.js';
import bcrypt from 'bcryptjs';
import data from '../seedData.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await User.deleteMany({});
  await Category.deleteMany({});

  const updatedUserData = await Promise.all(
    data.users.map(async (el) => {
      const hashedPassword = await bcrypt.hash(el.password, 8);
      return {
        first_name: el.first_name,
        last_name: el.last_name,
        email: el.email,
        password: hashedPassword,
        role: el.role,
        isConfirmed: true,
      };
    })
  );

  const updatedCategoryData = await Promise.all(
    data.category.map(async (el) => {
      return {
        categoryName: el.categoryName,
        categoryDescription: el.categoryDescription,
      };
    })
  );

  const Users = await User.insertMany(updatedUserData);
  const Categories = await Category.insertMany(updatedCategoryData);

  res.send({ Users, Categories });
});

export default seedRouter;
