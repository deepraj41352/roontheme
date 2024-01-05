import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import emailTemplate from './emailTemplate.js';
// import translate from '@iamtraction/google-translate';
import translate from 'google-translate-api-x';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_KEY,
  },
});
transporter.verify().then(console.log).catch(console.error);

export const sendEmailNotify = async (options) => {
  try {
    //options.from = 'BigCommerce <abhay.vyas25@gmail.com>';
    options.from = '"RoonBerg" <dodiyadsvv@gmail.com>';
    options.html = emailTemplate(options);
    const info = transporter.sendMail(options);
    return info;
  } catch (err) {
    console.log('Email Error ', err);
    return err;
  }
};

export const baseUrl = () =>
  process.env.NODE_ENV == 'devlopment'
    ? 'http://localhost:3000'
    : 'https://roontheme.onrender.com';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7); // Remove 'Bearer ' prefix
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token' });
  }
};

export const isAdminOrSelf = async (req, res, next) => {
  const currentUser = req.user; // Current user making the request
  const userId = req.params.id; // User ID in the route parameter
  try {
    // Assuming you have a method to retrieve the project owner's ID

    if (
      currentUser.role === 'superadmin' ||
      currentUser.role === 'admin' ||
      currentUser._id === userId
    ) {
      next();
    } else {
      if (currentUser._id == projectOwnerId) {
        next();
      } else {
        res.status(401).json({ message: 'Permission Denied' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// export const languageChange = async (data, headers, fieldsToTranslate) => {
//   try {
//     const acceptLanguage = headers['accept-language'];
//     const primaryLanguage = acceptLanguage
//       ? acceptLanguage.split(',')[0].split('-')[0]
//       : 'en';
//     const translateCategoryItem = async (item) => {
//       for (const field of fieldsToTranslate) {
//         const translation = await translate(item[field], {
//           from: 'en',
//           to: primaryLanguage,
//         });
//         item[field] = translation.text;
//       }

//       return item;
//     };

//     if (Array.isArray(data)) {
//       const translatedCategory = await Promise.all(
//         data.map(translateCategoryItem)
//       );
//       return translatedCategory;
//     } else {
//       const translatedCategory = await translateCategoryItem(data);
//       return translatedCategory;
//     }
//   } catch (error) {
//     return { message: 'Internal Server Error', error };
//   }
// };
export const languageChange = async (data, headers, fieldsToTranslate) => {
  try {
    const acceptLanguage = headers['accept-language'];
    const primaryLanguage = acceptLanguage
      ? acceptLanguage.split(',')[0].split('-')[0]
      : 'en';

    const translateText = async (text) => {
      try {
        const chunks = [];
        for (let i = 0; i < text.length; i += 400) {
          chunks.push(text.substring(i, i + 400));
        }
        const translatedChunks = await Promise.all(
          chunks.map((chunk) =>
            translate(chunk, { from: 'en', to: primaryLanguage })
          )
        );
        const translatedText = translatedChunks
          .map((chunk) => chunk.text)
          .join('');

        return translatedText;
      } catch (error) {
        console.error('Translation error:', error);
        throw error;
      }
    };

    const translateDataItem = async (dataItem) => {
      for (const field of fieldsToTranslate) {
        if (dataItem[field]) {
          const translation = await translateText(dataItem[field]);
          dataItem[field] = translation;
        }
      }

      return dataItem;
    };

    if (Array.isArray(data)) {
      const translatedData = await Promise.all(data.map(translateDataItem));
      return translatedData;
    } else {
      const translatedData = await translateDataItem(data);
      return translatedData;
    }
  } catch (error) {
    return { message: 'Internal Server Error', error };
  }
};
