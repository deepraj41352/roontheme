import express from 'express';
import { isAuth, sendEmailNotify } from '../util.js';
import expressAsyncHandler from 'express-async-handler';
import projectTask from '../Models/projectTaskModel.js';
import Task from '../Models/taskModel.js';
import Category from '../Models/categoryModel.js';
import User from '../Models/userModel.js';
import Conversation from '../Models/conversationModel.js';
import { storeNotification } from '../server.js';
import { Socket, io } from 'socket.io-client';
const SocketUrl = process.env.SOCKETURL || 'ws://localhost:8900';
const socket = io(SocketUrl);

// const io = require('../socket/index.js');
// import io from '../../socket/index.js'

socket.emit('connectionForNotify', () => {
  console.log('connectionForNotif user connnercted');
});

const TaskRouter = express.Router();

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    // If the text exceeds the maxLength, truncate and append "..."
    return text.slice(0, maxLength) + '...';
  }
};

TaskRouter.get(
  '/project',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const projects = await projectTask.find().sort({ createdAt: -1 });
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

TaskRouter.get(
  '/tasks',
  expressAsyncHandler(async (req, res) => {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

// Addmin & superAdmin add project

TaskRouter.post(
  '/admin',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      function capitalizeFirstLetter(data) {
        return data && data.charAt(0).toUpperCase() + data.slice(1);
      }
      const contractorId = req.body.contractorId;
      const selectProjectName = capitalizeFirstLetter(
        req.body.selectProjectName
      );
      const projectName = capitalizeFirstLetter(req.body.projectName);
      const taskName = capitalizeFirstLetter(req.body.taskName);
      const taskCategory = capitalizeFirstLetter(req.body.taskCategory);
      const userRole = req.user.role;

      if (userRole === 'admin' || userRole === 'superadmin') {
        let user = await User.findOne({
          _id: contractorId,
        });
        // if (user === null) {
        //   res.status(200).json({
        //     message: 'Contractor Not Exists',
        //   });
        // }

        let selectProject = await projectTask.findOne({
          projectName: selectProjectName,
        });

        let project = await projectTask.findOne({ projectName });
        let task = await Task.findOne({ taskName });
        let category = await Category.findOne({ categoryName: taskCategory });
        if (category === null) {
          res.status(200).json({
            message: 'Category Not Exists',
          });
        }
        let agent = await User.findOne({ agentCategory: category._id });
        if (agent === null) {
          res.status(200).json({
            message: 'Category Not Assign Any Agent',
          });
        }
        if (project && project.projectName === projectName) {
          res.status(200).json({
            message: ' A Project With The Same Name Already Exists.',
          });
        } else if (task && task.taskName === taskName) {
          res.status(200).json({
            message: 'A Task With The Same Name Already Exists.',
          });
        } else if (selectProject) {
          if (selectProject === null) {
            res.status(200).json({
              message: 'Project Not Exists',
            });
          }
          let userSelect = await User.findOne({
            _id: selectProject.userId,
          });
          if (agent === null) {
            res.status(200).json({
              message: 'Contractor Not Exists Any Project',
            });
          }
          const newTask = await new Task({
            taskName: taskName,
            projectName: selectProjectName,
            taskDescription: req.body.taskDescription,
            projectId: selectProject._id,
            taskCategory: category._id,
            userId: userSelect._id,
            agentId: agent._id,
            userName: userSelect.first_name,
            agentName: agent.first_name,
          }).save();
          const options = {
            to: [userSelect.email, agent.email],
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: selectProjectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user: userSelect,
          };
          const checkMail = await sendEmailNotify(options);
          if (checkMail) {
            const notifyUser = [userSelect._id, agent._id];
            const message = `New Task Created <div><div><b>Project Name</b> - ${truncateText(
              options.projectName,
              30
            )}</div>  <div><b>Task Name</b> - ${truncateText(
              options.taskName,
              30
            )}</div>  <div><b>Task Description</b> - ${truncateText(
              options.taskDescription,
              30
            )}</div></div>`;
            const status = 'unseen';
            const type = 'project';
            for (const adminemailid of notifyUser) {
              storeNotification(message, adminemailid, status, type);
              socket.emit('notifyProjectBackend', adminemailid, message);
            }
          } else {
            console.log('email not send');
          }

          const existingConversation = await Conversation.findOne({
            members: [agent._id, userSelect._id],
            projectId: selectProject._id,
            taskId: newTask._id,
          });
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, userSelect._id],
              projectId: selectProject._id,
              taskId: newTask._id,
            });

            await newConversation.save();
            // Use savedConversation as needed
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }
          res
            .status(201)
            .json({ message: 'Task Created Successfully!!', task: newTask });
        } else {
          project = await new projectTask({
            projectName,
            userId: user._id,
            agentId: agent._id,
          }).save();

          const newTask = await new Task({
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            projectName: projectName,
            projectId: project._id,
            taskCategory: category._id,
            userId: user._id,
            agentId: agent._id,
            userName: user.first_name,
            agentName: agent.first_name,
          }).save();
          const options = {
            to: [user.email, agent.email],
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: projectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user,
          };
          const checkMail = await sendEmailNotify(options);
          if (checkMail) {
            // for (const adminemailid of options.to) {

            const notifyUser = [user._id, agent._id];
            const message = `New Task Created <div><div><b>Project Name</b> - ${truncateText(
              options.projectName,
              30
            )}</div>  <div><b>Task Name</b> - ${truncateText(
              options.taskName,
              30
            )}</div>  <div><b>Task Description</b> - ${truncateText(
              options.taskDescription,
              30
            )}</div></div>`;
            const status = 'unseen';
            const type = 'project';
            for (const adminemailid of notifyUser) {
              storeNotification(message, adminemailid, status, type);
              socket.emit('notifyProjectBackend', adminemailid, message);
            }
          } else {
            console.log('email not send');
          }

          const existingConversation = await Conversation.findOne({
            members: [agent._id, user._id],
            projectId: project._id,
            taskId: newTask._id,
          });
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, user._id],
              projectId: project._id,
              taskId: newTask._id,
            });

            await newConversation.save();
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }

          res
            .status(201)
            .json({ message: 'Task Created Successfully!', task: newTask });
        }
      } else {
        res.status(200).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error creating Task', error: error.message });
    }
  })
);

// Contractor add project

TaskRouter.post(
  '/contractor',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      function capitalizeFirstLetter(data) {
        return data && data.charAt(0).toUpperCase() + data.slice(1);
      }
      const user = req.user;
      const selectProjectName = capitalizeFirstLetter(
        req.body.selectProjectName
      );
      const projectName = capitalizeFirstLetter(req.body.projectName);
      const taskName = capitalizeFirstLetter(req.body.taskName);
      const taskCategory = capitalizeFirstLetter(req.body.taskCategory);
      if (user.role === 'contractor') {
        let selectProject = await projectTask.findOne({
          projectName: selectProjectName,
        });
        const adminEmails = await User.find({ role: 'admin' }).select(
          'email _id'
        );
        const superAdminEmails = await User.find({ role: 'superadmin' }).select(
          'email _id'
        );

        const adminEmailAddresses = adminEmails.map((user) => user.email);
        const superAdminEmailAddresses = superAdminEmails.map(
          (user) => user.email
        );
        const adminIds = adminEmails.map((user) => user._id);
        const superAdminIds = superAdminEmails.map((user) => user._id);
        let project = await projectTask.findOne({ projectName });
        let task = await Task.findOne({ taskName });
        let category = await Category.findOne({ categoryName: taskCategory });
        if (category === null) {
          res.status(200).json({
            message: 'Category Not Exists',
          });
        }
        let agent = await User.findOne({ agentCategory: category._id });
        if (agent === null) {
          res.status(200).json({
            message: 'Category Not Assign Any Agent',
          });
        }
        if (project && project.projectName === projectName) {
          res.status(200).json({
            message: ' A Project With The Same Name Already Exists.',
          });
        } else if (task && task.taskName === taskName) {
          res.status(200).json({
            message: 'A Task With The Same Name Already Exists.',
          });
        } else if (selectProject) {
          const newTask = await new Task({
            taskName: taskName,
            projectName: selectProjectName,
            taskDescription: req.body.taskDescription,
            projectId: selectProject._id,
            taskCategory: category._id,
            userId: user._id,
            agentId: agent._id,
            userName: user.first_name,
            agentName: agent.first_name,
          }).save();

          const allEmails = [
            ...adminEmailAddresses,
            ...superAdminEmailAddresses,
            agent.email,
          ];
          const allIds = [...adminIds, ...superAdminIds, agent._id];
          const options = {
            to: allEmails,
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: selectProjectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user,
          };
          const checkMail = await sendEmailNotify(options);
          if (checkMail) {
            for (const adminemailid of allIds) {
              const notifyUser = adminemailid;
              const message = `New Task Created <div><div><b>Project Name</b> - ${truncateText(
                options.projectName,
                30
              )}</div>  <div><b>Task Name</b> - ${truncateText(
                options.taskName,
                30
              )}</div>  <div><b>Task Description</b> - ${truncateText(
                options.taskDescription,
                30
              )}</div></div>`;
              const status = 'unseen';
              const type = 'project';
              storeNotification(message, notifyUser, status, type);
              socket.emit('notifyProjectBackend', notifyUser, message);
            }
          } else {
            console.log('email not send');
          }

          const existingConversation = await Conversation.findOne({
            members: [agent._id, user._id],
            projectId: selectProject._id,
            taskId: newTask._id,
          });
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, user._id],
              projectId: selectProject._id,
              taskId: newTask._id,
            });

            await newConversation.save();
            // Use savedConversation as needed
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }
          res
            .status(201)
            .json({ message: 'Task Created Successfully!!', task: newTask });
        } else {
          project = await new projectTask({
            projectName,
            userId: user._id,
            agentId: agent._id,
          }).save();

          const newTask = await new Task({
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            projectName: projectName,
            projectId: project._id,
            taskCategory: category._id,
            userId: user._id,
            agentId: agent._id,
            userName: user.first_name,
            agentName: agent.first_name,
          }).save();
          const allEmails = [
            ...adminEmailAddresses,
            ...superAdminEmailAddresses,
            agent.email,
          ];
          const allIds = [...adminIds, ...superAdminIds, agent._id];
          const options = {
            to: allEmails,
            subject: 'New Task Create✔ ',
            template: 'ADDTASK-CONTRACTOR',
            projectName: projectName,
            taskName: taskName,
            taskDescription: req.body.taskDescription,
            user,
          };
          const checkMail = await sendEmailNotify(options);

          if (checkMail) {
            for (const adminemailid of allIds) {
              const notifyUser = adminemailid;
              const message = `New Task Created <div><div><b>Project Name</b> - ${truncateText(
                options.projectName,
                30
              )}</div>  <div><b>Task Name</b> - ${truncateText(
                options.taskName,
                30
              )}</div>  <div><b>Task Description</b> - ${truncateText(
                options.taskDescription,
                30
              )}</div></div>`;
              const status = 'unseen';
              const type = 'project';
              storeNotification(message, notifyUser, status, type);
              socket.emit('notifyProjectBackend', notifyUser, message);
            }
          } else {
            console.log('email not send');
          }

          const existingConversation = await Conversation.findOne({
            members: [agent._id, user._id],
            projectId: project._id,
            taskId: newTask._id,
          });
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agent._id, user._id],
              projectId: project._id,
              taskId: newTask._id,
            });

            await newConversation.save();
          } else {
            res.status(500).json({ message: 'Conversation Already Exists' });
          }

          res
            .status(201)
            .json({ message: 'Task Created Successfully!', task: newTask });
        }
      } else {
        res.status(200).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error creating Task', error: error.message });
    }
  })
);

// delete all project and task

TaskRouter.delete(
  '/',
  expressAsyncHandler(async (req, res) => {
    await projectTask.deleteMany({});
    await Task.deleteMany({});
    res.send('deleted');
  })
);

// delete task

TaskRouter.delete(
  '/:taskId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.taskId);
      res.status(200).json('Task Deleted Successfully !');
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

// update task

TaskRouter.put(
  '/updateStatus/:taskId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { taskStatus } = req.body;
      if (!taskStatus) {
        return res.status(400).json({ message: 'Task status is required.' });
      }
      const updateStatus = await Task.findOneAndUpdate(
        { _id: req.params.taskId },
        { taskStatus },
        { new: true }
      );
      if (!updateStatus) {
        return res.status(404).json({ message: 'Task not found.' });
      }
      res.status(200).json({
        message: 'Update status successful',
        updatedTask: updateStatus,
      });
      const adminEmails = await User.find({ role: 'admin' }).select(
        'email _id'
      );
      const superAdminEmails = await User.find({ role: 'superadmin' }).select(
        'email _id'
      );
      const adminIds = adminEmails.map((user) => user._id);
      const superAdminIds = superAdminEmails.map((user) => user._id);
      if (updateStatus) {
        // for (const adminemailid of options.to) {
        const notifyUser = [
          updateStatus.userId,
          updateStatus.agentId,
          ...adminIds,
          ...superAdminIds,
        ];
        const message = `Task Status Update <div><div><b>Task Status</b> - ${truncateText(
          updateStatus.taskStatus,
          30
        )}</div>  <div><b>Project Name</b> - ${truncateText(
          updateStatus.projectName,
          30
        )}</div>  <div><b>Task Name</b> - ${truncateText(
          updateStatus.taskName,
          30
        )}</div>
        <div><b>Task Description</b> - ${truncateText(
          updateStatus.taskDescription,
          30
        )}</div></div>`;
        const status = 'unseen';
        const type = 'project';
        for (const adminemailid of notifyUser) {
          storeNotification(message, adminemailid, status, type);
          socket.emit('notifyProjectBackend', adminemailid, message);
        }
      } else {
        console.log('email not send');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
      console.log('error', error);
    }
  })
);

// get single project
TaskRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        res.status(400).json({ message: 'Project not found' });
      }
      const conversions = await Conversation.find({ taskId: req.params.id });
      const { ...other } = task._doc;
      res.json({
        ...other,
        conversions: conversions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

// TaskRouter.get(
//   '/getproject/:userId',
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const projects = await Task.find({
//         $or: [
//           { projectOwner: userId },
//           {
//             'assignedAgent.agentId': userId,
//           },
//         ],
//       });

//       if (!projects) {
//         res.status(404).json({ message: 'No projects found for this user' });
//         // return; // Return early to avoid further execution
//       }

//       for (const project of projects) {
//         if (Array.isArray(project.assignedAgent)) {
//           for (const assignee of project.assignedAgent) {
//             const agentId = assignee.agentId;
//             const categoryId = assignee.categoryId;
//             const agent = await User.findById(agentId, 'first_name');
//             const category = await Category.findById(
//               categoryId,
//               'categoryName'
//             );

//             assignee.agentName = agent?.first_name;
//             assignee.categoryName = category?.categoryName;
//           }
//         }
//       }

//       const projectIds = projects.map((project) => project._id);
//       const conversations = await Conversation.find({
//         projectId: { $in: projectIds },
//       });

//       res.json({ projects, conversations });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   })
// );
export default TaskRouter;
