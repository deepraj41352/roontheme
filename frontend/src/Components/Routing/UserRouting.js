import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminList from '../../Screens/Admins/admin/AdminList';
import AdminCreate from '../../Screens/Admins/admin/AdminCreate';
import AdminUpdate from '../../Screens/Admins/admin/AdminUpdate';
import AgentCreate from '../../Screens/Admins/agent/AgentCreate';
import AgentList from '../../Screens/Admins/agent/AgentList';
import AgentUpdate from '../../Screens/Admins/agent/AgentUpdate';
import ContractorCreate from '../../Screens/Admins/contractor/ContractorCreate';
import ContractorList from '../../Screens/Admins/contractor/ContractorList';
import ContractorUpdate from '../../Screens/Admins/contractor/ContractorUpdate';
import CategoryCreate from '../../Screens/Admins/category/CategoryCreate';
import CategoryList from '../../Screens/Admins/category/CategoryList';
import CategoryUpdate from '../../Screens/Admins/category/CategoryUpdate';
import ProjectList from '../../Screens/Admins/project/ProjectList';
import TasksCreate from '../../Screens/Admins/task/TaskCreate';
import TasksList from '../../Screens/Admins/task/TaskList';
import AgentsProjectList from '../../Screens/Agents/project/Project';
import AgentTasksList from '../../Screens/Agents/task/Task';
import ContractorProjectList from '../../Screens/Contractors/project/Project';
import ContractorTasksList from '../../Screens/Contractors/task/Task';
import ContractorTasksCreate from '../../Screens/Contractors/task/TaskCreate';
import Profile from '../../Screens/Profile/Profile';
import ProfileUpdate from '../../Screens/Profile/ProfileUpdate';
import Dashboard from '../../Screens/Dashboard';
import ChatWindowScreen from '../../Screens/ChatWindowScreen';
import NotificationScreen from '../../Screens/NotificationScreen';
import TaskAddButton from '../TaskAddButton';
import ChatBotScreen from '../../Screens/ChatBotScreen';
import { useMediaQuery } from 'react-responsive';

export default function UserRouting() {
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  return (
    <>
      <Routes>
        <Route path="/admin-screen" element={<AdminList />} />
        <Route path="/admin/create-screen" element={<AdminCreate />} />
        <Route path="/admin/:id" element={<AdminUpdate />} />
        <Route path="/agent-screen" element={<AgentList />} />
        <Route path="/agent/create-screen" element={<AgentCreate />} />
        <Route path="/agent/:id" element={<AgentUpdate />} />
        <Route path="/client-screen" element={<ContractorList />} />
        <Route path="/client/create-screen" element={<ContractorCreate />} />
        <Route path="/client/:id" element={<ContractorUpdate />} />
        <Route path="/category-screen" element={<CategoryList />} />
        <Route path="/category/create-screen" element={<CategoryCreate />} />
        <Route path="/category/:id" element={<CategoryUpdate />} />
        <Route path="/admin/project-screen" element={<ProjectList />} />
        <Route path="/admin/task-screen" element={<TasksList />} />
        <Route path="/admin/task/create-screen" element={<TasksCreate />} />
        <Route path="/agent/project-screen" element={<AgentsProjectList />} />
        <Route path="/agent/task-screen" element={<AgentTasksList />} />
        <Route
          path="/client/project-screen"
          element={<ContractorProjectList />}
        />
        <Route
          path="/client/task/create-screen"
          element={<ContractorTasksCreate />}
        />
        <Route path="/client/task-screen" element={<ContractorTasksList />} />
        <Route path="/profile-screen" element={<Profile />} />
        <Route path="/profile/picture" element={<ProfileUpdate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatWindowScreen/:id" element={<ChatWindowScreen />} />
        <Route path="/notification-screen" element={<NotificationScreen />} />
        <Route
          path="/help-screen"
          element={isSmallScreen ? <ChatBotScreen /> : <Navigate to="/" />}
        />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
      <TaskAddButton />
    </>
  );
}
