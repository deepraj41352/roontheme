import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routers/userRouter.js';
import seedRouter from './routers/seed.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import categoryRouter from './routers/categoryRouter.js';
import NotificationRouter from './routers/NotificationRouter.js';
import conversationRouter from './routers/conversationRouter.js';
import MessageRouter from './routers/MessageRoute.js';
import cron from 'node-cron';
import Imap from 'node-imap';
import nodemailer from 'nodemailer';
import Notification from './Models/notificationModel.js';
import http from 'http';
import fs from 'fs';
import { Server } from 'socket.io';
import { uploadDoc } from './routers/userRouter.js';
import TaskRouter from './routers/TaskRouter.js';
import { isAuth } from './util.js';

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, // Make this also true
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(err.message);
  });

const app = express();
const server = http.createServer(app);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RoonBerg',
      version: '1.0.6',
    },
    contact: {
      email: 'deepraj41352@gmail.com',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV !== 'production'
            ? 'http://localhost:5000'
            : 'https://roonberg.onrender.com',
      },
    ],
    schemes: ['https', 'http'],
  },
  apis: ['./server.js', './routers/userRouter.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', MessageRouter);
app.use('/api/notification', NotificationRouter);
app.use('/api/task', TaskRouter);
app.get('/is-auth', isAuth, (req, res) => {
  res.send({ message: 'Authentication successful', user: req.user });
});
app.get('/api', (req, res) => {
  res.send('Welcome to Roonberg World');
});
const transporter = nodemailer.createTransport({
  service: 'SMTP',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_KEY,
  },
});

function sendEmail(to, subject, message) {
  const mailOptions = {
    from: 'deepraj41352@email.com',
    to,
    subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export async function storeNotification(message, notifyUser, status, type) {
  const newNotification = new Notification({
    type,
    userId: notifyUser,
    status,
    message,
  });

  const notify = await newNotification.save();
  return notify;
}

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, 'frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(_dirname, 'frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send({ message: err.message });
});

const io = new Server(server, {
  cors: {
    origin: [
      'https://roontheme.onrender.com',
      'http://localhost:3000',
      'http://localhost:5000',
    ],
  },
});

const port = process.env.PORT || 5000;
app.use('/uploads', express.static(path.join(_dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('Server is running and Socket.IO is ready.');
});

let users = [];
const addUser = (userId, socketId, role) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, role });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  socket.on('message', (role) => {
    io.emit('message', role);
  });
  socket.on('addUser', (userId, role) => {
    addUser(userId, socket.id, role);
    io.emit('getUsers', users);
  });
  socket.on('video', (data) => {
    if (data.receiverdId.length == 2) {
      const video = data.video;
      const senderId = getUser(data.senderId);
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      io.to(senderId.socketId).emit('video', {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        video,
      });
      if (agent) {
        io.to(agent.socketId).emit('video', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit('video', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      }
    } else {
      const video = data.video;
      const senderId = getUser(data.senderId);
      const user = getUser(data.receiverdId);
      const AdminUser = users.filter(
        (item) => item.role === 'admin' || item.role === 'superadmin'
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit('video', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      });
      io.to(senderId.socketId).emit('video', {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        video,
      });
      if (user) {
        io.to(user.socketId).emit('video', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      }
    }
  });

  socket.on('audio', (data) => {
    if (data.receiverdId.length == 2) {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      if (senderId) {
        io.to(senderId.socketId).emit('audio', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
      if (agent) {
        io.to(agent.socketId).emit('audio', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit('audio', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    } else {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const user = getUser(data.receiverdId);
      const AdminUser = users.filter(
        (item) => item.role === 'admin' || item.role === 'superadmin'
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit('audio', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      });
      io.to(senderId.socketId).emit('audio', {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        audio,
      });
      if (user) {
        io.to(user.socketId).emit('audio', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    }
  });
  socket.on('audioFile', (data) => {
    if (data.receiverdId.length == 2) {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      io.to(senderId.socketId).emit('audioFile', {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        audio,
      });

      if (agent) {
        io.to(agent.socketId).emit('audioFile', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit('audioFile', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    } else {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const user = getUser(data.receiverdId);
      io.to(senderId.socketId).emit('audioFile', {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        audio,
      });
      const AdminUser = users.filter(
        (item) => item.role === 'admin' || item.role === 'superadmin'
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit('audioFile', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      });
      if (user) {
        io.to(user.socketId).emit('audioFile', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    }
  });

  socket.on('image', async (data) => {
    const base64Image = data.image;
    const senderId = getUser(data.senderId);

    io.to(senderId.socketId).emit('image', {
      senderFirstName: data.senderFirstName,
      senderLastName: data.senderLastName,
      Sender_Profile: data.Sender_Profile,
      senderId: data.senderId,
      image: data.image,
      ImagewithMessage: data.ImagewithMessage,
    });

    if (data.receiverdId.length == 2) {
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      if (agent) {
        io.to(agent.socketId).emit('image', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: data.image,
          ImagewithMessage: data.ImagewithMessage,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit('image', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: data.image,
          ImagewithMessage: data.ImagewithMessage,
        });
      }
    } else {
      const user = getUser(data.receiverdId);
      const AdminUser = users.filter(
        (item) => item.role === 'admin' || item.role === 'superadmin'
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit('image', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: data.image,
          ImagewithMessage: data.ImagewithMessage,
        });
      });
      if (user) {
        io.to(user.socketId).emit('image', {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: data.image,
          ImagewithMessage: data.ImagewithMessage,
        });
      }
    }
  });

  // send and get message
  socket.on(
    'sendMessage',
    ({
      senderFirstName,
      senderLastName,
      Sender_Profile,
      senderId,
      receiverdId,
      text,
    }) => {
      if (receiverdId.length == 2) {
        const agent = getUser(receiverdId[0]);
        const contractor = getUser(receiverdId[1]);
        if (agent) {
          io.to(agent.socketId).emit('getMessage', {
            senderFirstName,
            senderLastName,
            Sender_Profile,
            senderId,
            text,
          });
        }
        if (contractor) {
          io.to(contractor.socketId).emit('getMessage', {
            senderFirstName,
            senderLastName,
            Sender_Profile,
            senderId,
            text,
          });
        }
      } else {
        const user = getUser(receiverdId);
        if (user) {
          io.to(user.socketId).emit('getMessage', {
            senderFirstName,
            senderLastName,
            Sender_Profile,
            senderId,
            text,
          });
        } else {
          console.log('karannn');
        }
        const AdminUser = users.filter(
          (item) => item.role === 'admin' || item.role === 'superadmin'
        );
        AdminUser.map((item) => {
          io.to(item.socketId).emit('getMessage', {
            senderFirstName,
            senderLastName,
            Sender_Profile,
            senderId,
            text,
          });
        });
      }
    }
  );

  socket.on('connectionForNotify', () => {});

  socket.on('notifyProjectBackend', (notifyUser, message) => {
    console.log('notify and mesage', notifyUser, message);
    io.emit('notifyProjectFrontend', notifyUser, message);
  });
  socket.on('notifyUserBackend', (notifyUser, message) => {
    console.log('notify and mesage for user', notifyUser, message);
    io.emit('notifyUserFrontend', notifyUser, message);
  });

  // when disconnect
  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
