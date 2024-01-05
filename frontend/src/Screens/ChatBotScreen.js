import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
} from 'react-bootstrap';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoSendSharp } from 'react-icons/io5';
import { ColorRing } from 'react-loader-spinner';
import { RxCross1 } from 'react-icons/rx';

function ChatBotScreen({ onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, helpToggle, languageName } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [isOpen, setIsOpen] = useState(true);
  function lastLoginDate(lastLogin) {
    const lastLoginTimestamp = lastLogin;
    const now = new Date();
    const lastLoginDate = new Date(lastLoginTimestamp);
    const minutesAgo = Math.floor((now - lastLoginDate) / (1000 * 60));
    const hours = Math.floor(minutesAgo / 60);
    const remainingMinutes = minutesAgo % 60;
    const formattedLastLogin = `Last Login: ${
      hours > 0 ? `${hours} ${hours === 1 ? 'Hour' : 'Hours'}` : ''
    }${hours > 0 && remainingMinutes > 0 ? ', ' : ''}${
      remainingMinutes > 0
        ? `${remainingMinutes} ${remainingMinutes === 1 ? 'Minute' : 'Minutes'}`
        : '0 Minute'
    } ago`;

    return formattedLastLogin;
  }

  const onCloseHelp = async () => {
    if (helpToggle == true) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    ctxDispatch({ type: 'HELPTOGGLE', payload: isOpen });
  }, [isOpen]);
  //API Call Code
  const FatchcategoryData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/task/tasks`, {
        headers: { 'Accept-Language': languageName },
      });
      return data;
    } catch (error) {
      toast.error(error.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const FatchuserData = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/${id}`);
      console.log('dataa2', data);
      return data; // Return the data here
    } catch (error) {
      toast.error(error.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const FatchProject = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/task/project`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Accept-Language': languageName,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const FatchAgentData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/`, { role: 'agent' });
      return data;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const FatchContractorData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
      return data;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const FatchAdminData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/`, { role: 'admin' });
      return data;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  //Messages
  // ------------------UserStepMSg-------------
  const U_Msg1 = 'Select your choice';
  // -----------userSteps-------------
  const userStep1 = [
    {
      id: 'u1',
      label: 'Himself',
      action: () => handleButtonUser1('Himself', userInfo),
    },
    { id: 'u2', label: 'Admin', action: () => handleButtonUser7('Admin') },
    {
      id: 'u3',
      label: 'Contractor',
      action: () => handleButtonUser5('Contractor'),
    },
    { id: 'u4', label: 'Agent', action: () => handleButtonUser2('Agent') },
  ];
  const userStep2 = [
    {
      id: 'u1',
      label: 'Himself',
      action: () => handleButtonUser1('Himself', userInfo),
    },
    {
      id: 'u3',
      label: 'Contractor',
      action: () => handleButtonUser5('Contractor'),
    },
    { id: 'u4', label: 'Agent', action: () => handleButtonUser2('Agent') },
  ];
  const userStep3 = [
    {
      id: 'u1',
      label: 'Himself',
      action: () => handleButtonUser1('Himself', userInfo),
    },

    { id: 'u4', label: 'Agent', action: () => handleButtonUser2('Agent') },
  ];
  const userStep4 = [
    {
      id: 'u1',
      label: 'Himself',
      action: () => handleButtonUser1('Himself', userInfo),
    },
    {
      id: 'u3',
      label: 'Contractor',
      action: () => handleButtonUser5('Contractor'),
    },
  ];

  const taskStep1 = [
    {
      id: 't1',
      label: 'Active Task',
      action: () => handleButtonTask2('Active Task'),
    },
    {
      id: 't2',
      label: 'Parked Task',
      action: () => handleButtonTask2('Parked Task'),
    },
    {
      id: 't3',
      label: 'Completed Task',
      action: () => handleButtonTask2('Completed Task'),
    },
  ];

  // -----------userSteps-------------
  // ------------------UserStepMSg-------------

  const initialMsg = [
    {
      id: 1.1,
      label: 'Project',
      action: () => handleButtonProject1('Project'),
    },
    {
      id: 1.2,
      label: 'Task',
      action: () => handleButtonTask1('Task'),
    },
    {
      id: 1.3,
      label: 'User',
      action: () => handleButtonUser('User', U_Msg1),
    },
  ];
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Bot', message: `Hi ${userInfo.first_name} ` },
    { sender: 'Bot', message: 'Welcome to Roonberg ' },
    { sender: 'Bot', message: 'How can I help you?' },
    {
      sender: 'Bot',
      message: (
        <div className="d-flex flex-column w-50">
          <div> {`Select the field you want information about.`}</div>
          <div className="globalBtnParentDiv">
            {initialMsg.map((button) => (
              <Button
                className="chatBot-globalBtn"
                key={button.id}
                onClick={button.action}
                variant="secondary"
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      ),
    },
  ]);
  const chatbotBodyRef = useRef(null);
  useEffect(() => {
    // Scroll to the bottom whenever chatHistory changes
    scrollToBottom();
  }, [chatHistory]);
  const scrollToBottom = () => {
    if (chatbotBodyRef.current) {
      chatbotBodyRef.current.scrollTop = chatbotBodyRef.current.scrollHeight;
    }
  };
  // ----------------------
  const getRandomNumber = () => Math.floor(Math.random() * 5) + 1;
  const randomNumber = getRandomNumber();
  const botResponses = [
    "I'm sorry, I didn't understand your question.",
    'Could you please provide more details?',
    'Sorry, please reframe your question',
    "I'm not sure I can help with that.",
    'Please try asking in a different way.',
  ];
  const randomBotResponse = botResponses[randomNumber - 1];
  const handleSendMessage = (e, message) => {
    e.preventDefault();
    if (message.trim() !== '') {
      setChatHistory([...chatHistory, { sender: 'You', message }]);
      setMessage(''); // Clear the input field after sending a message

      // ------------

      const lowercasedMessage = message.toLowerCase();
      const keyword = 'roonberg';

      if (lowercasedMessage.includes(keyword)) {
        setChatHistory([
          ...chatHistory,
          { sender: 'You', message },
          { sender: 'Bot', message: 'Welcome to Roonberg' },
          {
            sender: 'Bot',
            message: 'Roonberg can help you to manage your tasks easily.',
          },
        ]);
      } else if (lowercasedMessage.includes('agent')) {
        handleButtonUser2('notRequire');
      } else if (lowercasedMessage.includes('project')) {
        handleButtonProject1('notRequire');
      } else if (lowercasedMessage.includes('task')) {
        handleButtonTask1('notRequire');
      } else if (lowercasedMessage.includes('user')) {
        handleButtonUser('notRequire', U_Msg1);
      } else {
        setChatHistory([
          ...chatHistory,
          { sender: 'You', message },
          { sender: 'Bot', message: randomBotResponse },
        ]);
      }
    }
  };
  // -----------------------------------------------
  const handleButtonUser = (buttonLabel, Msg) => {
    let userStep = [];
    if (userInfo.role == 'superadmin') {
      userStep = userStep1;
    } else if (userInfo.role == 'admin') {
      userStep = userStep2;
    } else if (userInfo.role == 'contractor') {
      userStep = userStep3;
    } else if (userInfo.role == 'agent') {
      userStep = userStep4;
    }
    if (buttonLabel != 'notRequire') {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);
    }
    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <>
            <div className="w-50">
              {`${Msg}`}
              <div className="globalBtnParentDiv">
                {userStep.map((button) => (
                  <Button
                    className="chatBot-globalBtn"
                    key={button.id}
                    onClick={button.action}
                    variant="secondary"
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        ),
      },
    ]);
  };

  //User Handelers
  const handleButtonUser1 = (buttonLabel, userInfo) => {
    // Handle button click logic here

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${buttonLabel}` },
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>First Name : {`${userInfo.first_name}`} </p>
              <p>Last Name : {`${userInfo.last_name}`} </p>
              <p>Email : {`${userInfo.email}`} </p>
              <p>Role : {userInfo.role} </p>
              <p>{lastLoginDate(userInfo.lastLogin)} </p>
              <Link to="/profile-screen">Go to Profile</Link>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleButtonUser2 = async (buttonLabel) => {
    try {
      // Update chat history with the user's message
      if (buttonLabel != 'notRequire') {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: 'You', message: ` ${buttonLabel}` },
        ]);
      }
      let filteredData1inner = [];
      let filteredData1 = [];
      console.log('filteredData1inner', filteredData1inner);

      if (userInfo.role == 'superadmin' || userInfo.role == 'admin') {
        filteredData1inner = await FatchAgentData();
      } else {
        const fetchedData = await FatchcategoryData();
        filteredData1 = await fetchedData.filter(
          (item) => item.userId === userInfo._id
        );
        const seenUserIds = new Set();
        filteredData1inner = await filteredData1.filter((item) => {
          if (!seenUserIds.has(item.agentId)) {
            seenUserIds.add(item.agentId);
            return true;
          }
          return false;
        });
      }
      console.log('filteredData1inner', filteredData1inner);
      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {filteredData1inner.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Agent`}
                    <div className="globalBtnParentDiv">
                      {filteredData1inner.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() => {
                            userInfo.role == 'contractor'
                              ? handleButtonUser3(item.agentId, item.agentName)
                              : handleButtonUser4(
                                  item._id,
                                  item.first_name,
                                  filteredData1inner
                                );
                          }}
                        >
                          {userInfo.role == 'contractor'
                            ? item.agentName
                            : item.first_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Agent found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonUser2:', error);
    }
  };
  const handleButtonUser5 = async (buttonLabel) => {
    try {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);
      let fetchedData = [];
      let filteredData2 = [];
      console.log('fetchedData5', fetchedData);

      if (userInfo.role == 'agent') {
        fetchedData = await FatchcategoryData();
        const filteredData1 = await fetchedData.filter(
          (item) => item.agentId === userInfo._id
        );
        console.log('fetchedData5', filteredData1);
        const seenUserIds = new Set();
        filteredData2 = await filteredData1.filter((item) => {
          if (!seenUserIds.has(item.userId)) {
            seenUserIds.add(item.userId);
            return true;
          }
          return false;
        });
        console.log('fetchedData5', filteredData2);
      } else if (userInfo.role == 'superadmin' || userInfo.role == 'admin') {
        fetchedData = await FatchContractorData();
        filteredData2 = fetchedData;
        console.log('qq', filteredData2);
      }

      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {filteredData2.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Contractor`}
                    <div className="globalBtnParentDiv">
                      {filteredData2.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() => {
                            userInfo.role == 'agent'
                              ? handleButtonUser6(item.userId, item.userName)
                              : handleButtonUser6(item._id, item.first_name);
                          }}
                        >
                          {userInfo.role == 'agent'
                            ? item.userName
                            : item.first_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Contractor found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonUser5:', error);
    }
  };
  const handleButtonUser7 = async (buttonLabel) => {
    try {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);
      const fetchedData = await FatchAdminData();
      console.log('fetchedData', fetchedData);
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {fetchedData.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Admin`}
                    <div className="globalBtnParentDiv">
                      {fetchedData.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() => {
                            buttonLabel == 'Admin'
                              ? handleButtonUser8(item._id, item.first_name)
                              : handleButtonUser6(item._id, item.first_name);
                          }}
                        >
                          {userInfo.role == 'agent'
                            ? item.userName
                            : item.first_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Admin found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonUser7:', error);
    }
  };
  const handleButtonTask1 = async (buttonLabel) => {
    try {
      if (buttonLabel != 'notRequire') {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: 'You', message: ` ${buttonLabel}` },
        ]);
      }
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          sender: 'Bot',
          message: (
            <>
              <div className="w-50">
                {`Select Category`}
                <div className="globalBtnParentDiv">
                  {taskStep1.map((button) => (
                    <Button
                      className="chatBot-globalBtn"
                      key={button.id}
                      onClick={button.action}
                      variant="secondary"
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask2:', error);
    }
  };
  const handleButtonTask2 = async (buttonLabel) => {
    try {
      // Update chat history with the user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);

      // Fetch data and wait for it
      const fetchedData = await FatchcategoryData();
      console.log('222', fetchedData);
      let filteredData1 = [];
      if (buttonLabel == 'Active Task') {
        filteredData1 = fetchedData.filter(
          (item) => item.taskStatus == 'waiting'
        );
      } else if (buttonLabel == 'Parked Task') {
        filteredData1 = fetchedData.filter(
          (item) => item.taskStatus == 'pending'
        );
      } else if (buttonLabel == 'Completed Task') {
        filteredData1 = fetchedData.filter(
          (item) => item.taskStatus == 'completed'
        );
      }
      let filteredData2 = [];
      console.log('222', fetchedData);
      if (userInfo.role == 'contractor') {
        filteredData2 = filteredData1.filter(
          (item) => item.userId === userInfo._id
        );
      } else if (userInfo.role == 'agent') {
        filteredData2 = filteredData1.filter(
          (item) => item.agentId === userInfo._id
        );
        console.log('2222', filteredData2);
      } else {
        filteredData2 = filteredData1;
        console.log('object');
      }
      // ------------------------------------------------------

      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {filteredData2.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Task`}
                    <div className="globalBtnParentDiv">
                      {filteredData2.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() =>
                            handleButtonTask3(
                              item._id,
                              item.taskName,
                              filteredData1
                            )
                          }
                        >
                          {item.taskName}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Task found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask1:', error);
    }
  };
  const handleButtonTask4 = async (buttonLabel, id) => {
    try {
      // Update chat history with the user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);

      // Fetch data and wait for it
      const fetchedData = await FatchcategoryData();
      console.log('223', fetchedData);
      const filteredData = fetchedData.filter((item) => item.userId == id);
      console.log('2233', filteredData);

      let filteredData1 = [];
      if (buttonLabel == 'Active Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'waiting'
        );
      } else if (buttonLabel == 'Parked Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'pending'
        );
      } else if (buttonLabel == 'Completed Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'completed'
        );
      }
      let filteredData2 = [];
      console.log('222', fetchedData);
      if (userInfo.role == 'superadmin' || userInfo.role == 'admin') {
        filteredData2 = filteredData1.filter((item) => item.userId === id);
      } else if (userInfo.role == 'agent') {
        filteredData2 = filteredData1.filter(
          (item) => item.agentId === userInfo._id
        );
        console.log('2222', filteredData2);
      } else {
        filteredData2 = filteredData1;
        console.log('object');
      }
      // ------------------------------------------------------

      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {filteredData2.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Task`}
                    <div className="globalBtnParentDiv">
                      {filteredData2.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() =>
                            handleButtonTask3(
                              item._id,
                              item.taskName,
                              filteredData1
                            )
                          }
                        >
                          {item.taskName}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Task found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask1:', error);
    }
  };
  const handleButtonProject6 = async (buttonLabel, id) => {
    try {
      // Update chat history with the user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);

      // Fetch data and wait for it
      const fetchedData = await FatchcategoryData();
      console.log('223', fetchedData);
      const filteredData = fetchedData.filter((item) => item.projectId == id);
      console.log('2233', filteredData);

      let filteredData1 = [];
      if (buttonLabel == 'Active Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'waiting'
        );
      } else if (buttonLabel == 'Parked Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'pending'
        );
      } else if (buttonLabel == 'Completed Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'completed'
        );
      }
      let filteredData2 = [];
      console.log('222', fetchedData);
      if (userInfo.role == 'superadmin' || userInfo.role == 'admin') {
        filteredData2 = filteredData1;
        console.log('2233', filteredData2);
      } else if (userInfo.role == 'agent') {
        filteredData2 = filteredData1.filter(
          (item) => item.agentId === userInfo._id
        );
        console.log('2222', filteredData2);
      } else {
        filteredData2 = filteredData1;
        console.log('object');
      }
      // ------------------------------------------------------
      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {filteredData2.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Task`}
                    <div className="globalBtnParentDiv">
                      {filteredData2.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() =>
                            handleButtonTask3(
                              item._id,
                              item.taskName,
                              filteredData1
                            )
                          }
                        >
                          {item.taskName}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Task found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask1:', error);
    }
  };
  const handleButtonUser9 = async (buttonLabel, id) => {
    try {
      // Update chat history with the user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);

      // Fetch data and wait for it

      const fetchedData = await FatchcategoryData();
      let filteredData = [];
      console.log('224', id, fetchedData);
      if (userInfo.role == 'superadmin' || userInfo.role == 'admin') {
        filteredData = fetchedData.filter((item) => item.agentId == id);
      } else if (userInfo.role == 'contractor') {
        filteredData = fetchedData.filter(
          (item) => item.agentId == id && item.userId == userInfo._id
        );
        console.log('2244', filteredData);
      }

      let filteredData1 = [];
      if (buttonLabel == 'Active Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'waiting'
        );
      } else if (buttonLabel == 'Parked Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'pending'
        );
      } else if (buttonLabel == 'Completed Task') {
        filteredData1 = filteredData.filter(
          (item) => item.taskStatus == 'completed'
        );
      }

      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div>
              {filteredData1.length > 0 ? (
                <>
                  <div className="w-50">
                    {`Select Task`}
                    <div className="globalBtnParentDiv">
                      {filteredData1.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() =>
                            handleButtonTask3(
                              item._id,
                              item.taskName,
                              filteredData1
                            )
                          }
                        >
                          {item.taskName}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                'No Task found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask1:', error);
    }
  };
  const handleButtonProject4 = async (buttonLabel, id) => {
    try {
      // Update chat history with the user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);

      // Fetch data and wait for it
      const fetchedData = await FatchcategoryData();
      console.log('fetchedDataP4', id, fetchedData);
      const filteredData1 = fetchedData.filter((item) => {
        return (
          (userInfo.role === 'contractor' &&
            item.userId === userInfo._id &&
            item.projectId === id) ||
          (userInfo.role === 'admin' && item.projectId === id) ||
          (userInfo.role === 'superadmin' && item.projectId === id) ||
          (userInfo.role === 'agent' &&
            item.projectId === id &&
            item.agentId === userInfo._id)
        );
      });

      console.log('filteredDataP41', filteredData1);
      // ------------------------------------------------------

      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div className="w-50">
              {filteredData1.length > 0 ? (
                <>
                  {`Select Task`}
                  <div className="globalBtnParentDiv">
                    {filteredData1.map((item) => (
                      <Button
                        className="chatBot-globalBtn"
                        key={item._id}
                        variant="secondary"
                        onClick={() =>
                          handleButtonTask3(
                            item._id,
                            item.taskName,
                            filteredData1
                          )
                        }
                      >
                        {item.taskName}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                'No Task found'
              )}
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask1:', error);
    }
  };
  const handleButtonProject5 = async (buttonLabel, id) => {
    try {
      // Update chat history with the user's message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'You', message: ` ${buttonLabel}` },
      ]);

      // // Fetch data and wait for it
      // const fetchedData = await FatchcategoryData();
      // console.log("fetchedDataP4", id, fetchedData);
      // const filteredData1 = fetchedData.filter((item) => {
      //   return (
      //     (userInfo.role === "contractor" &&
      //       item.userId === userInfo._id &&
      //       item.projectId === id) ||
      //     (userInfo.role === "admin" && item.projectId === id) ||
      //     (userInfo.role === "superadmin" && item.projectId === id) ||
      //     (userInfo.role === "agent" &&
      //       item.projectId === id &&
      //       item.agentId === userInfo._id)
      //   );
      // });

      // ------------------------------------------------------

      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <div className="w-50">
              {`Select Category`}
              <div className="globalBtnParentDiv">
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonProject6('Active Task', id)}
                  variant="secondary"
                >
                  Active Task
                </Button>
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonProject6('Parked Task', id)}
                  variant="secondary"
                >
                  Parked Task
                </Button>
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonProject6('Completed Task', id)}
                  variant="secondary"
                >
                  Completed Task
                </Button>
              </div>
            </div>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonProject5:', error);
    }
  };
  const handleButtonProject1 = async (buttonLabel) => {
    try {
      if (buttonLabel != 'notRequire') {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: 'You', message: ` ${buttonLabel}` },
        ]);
      }
      // Fetch data and wait for it

      const fetchedData = await FatchProject();
      console.log('fetchedDataP1', fetchedData);
      let filteredData = [];
      if (userInfo.role == 'superadmin' || userInfo.role == 'admin') {
        filteredData = fetchedData;
      } else if (userInfo.role == 'contractor') {
        filteredData = fetchedData.filter(
          (item) => item.userId === userInfo._id
        );
      } else if (userInfo.role == 'agent') {
        console.log('fetchedDataP1', 'jay ho');
        filteredData = fetchedData.filter((item) =>
          item.agentId.some((value) => value === userInfo._id)
        );
        console.log('fetchedDataP1', filteredData);
        console.log('fetchedDataP1', 'jay ho');
      }

      // ------------------------------------------------------
      // Update chat history with the fetched data
      setChatHistory((prevHistory) => [
        ...prevHistory,

        {
          sender: 'Bot',
          message: (
            <>
              <div className="w-50">
                {filteredData.length > 0 ? (
                  <>
                    {`Select Project`}
                    <div className="globalBtnParentDiv">
                      {filteredData.map((item) => (
                        <Button
                          className="chatBot-globalBtn"
                          key={item._id}
                          variant="secondary"
                          onClick={() =>
                            handleButtonProject3(
                              item._id,
                              item.projectName,
                              filteredData
                            )
                          }
                        >
                          {item.projectName}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  'No Project found'
                )}
              </div>
            </>
          ),
        },
      ]);
    } catch (error) {
      console.error('Error in handleButtonTask1:', error);
    } finally {
    }
  };
  const handleButtonUser3 = async (id, name) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${name}` },
    ]);
    //tt
    const filteredData2 = await FatchuserData(id);
    console.log('filteredData2', filteredData2);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>First Name : {`${filteredData2.first_name}`} </p>
              <p>Last Name : {`${filteredData2.last_name}`} </p>
              <p>Email : {`${filteredData2.email}`} </p>
              <p>Role : {`${filteredData2.role}`} </p>
              <p>{lastLoginDate(filteredData2.lastLogin)} </p>
            </div>
            <div>
              <div className="w-50">
                {`Select Category`}
                <div className="globalBtnParentDiv">
                  <Button
                    className="chatBot-globalBtn"
                    onClick={() => handleButtonUser9('Active Task', id)}
                    variant="secondary"
                  >
                    Active Task
                  </Button>
                  <Button
                    className="chatBot-globalBtn"
                    onClick={() => handleButtonUser9('Parked Task', id)}
                    variant="secondary"
                  >
                    Parked Task
                  </Button>
                  <Button
                    className="chatBot-globalBtn"
                    onClick={() => handleButtonUser9('Completed Task', id)}
                    variant="secondary"
                  >
                    Completed Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleButtonUser6 = async (id, name) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${name}` },
    ]);

    const fetchedData = await FatchuserData(id);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>First Name : {`${fetchedData.first_name}`} </p>
              <p>Last Name : {`${fetchedData.last_name}`} </p>
              <p>Email : {`${fetchedData.email}`} </p>
              <p>Role : {`${fetchedData.role}`} </p>
              <p>{lastLoginDate(fetchedData.lastLogin)} </p>
            </div>
            <div className="w-50">
              {`Select Category`}
              <div className="globalBtnParentDiv">
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonTask4('Active Task', id)}
                  variant="secondary"
                >
                  Active Task
                </Button>
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonTask4('Parked Task', id)}
                  variant="secondary"
                >
                  Parked Task
                </Button>
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonTask4('Completed Task', id)}
                  variant="secondary"
                >
                  Completed Task
                </Button>
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleButtonUser8 = async (id, name) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${name}` },
    ]);

    const fetchedData = await FatchuserData(id);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>First Name : {`${fetchedData.first_name}`} </p>
              <p>Last Name : {`${fetchedData.last_name}`} </p>
              <p>Email : {`${fetchedData.email}`} </p>
              <p>Role : {`${fetchedData.role}`} </p>
              <p>{lastLoginDate(fetchedData.lastLogin)} </p>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleButtonUser4 = async (id, name, filteredData) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${name}` },
    ]);
    // const fetchedData = await FatchcategoryData();
    // console.log("taskdata", fetchedData);
    // const filteredData2 = fetchedData.filter((item) => item.agentId === id);
    // console.log("filteredDataa2", filteredData2);

    const [filteredData1] = filteredData.filter((item) => item._id === id);
    console.log('filteredDaa1', filteredData1);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>First Name : {`${filteredData1.first_name}`} </p>
              <p>Last Name : {`${filteredData1.last_name}`} </p>
              <p>Email : {`${filteredData1.email}`} </p>
              <p>Role : {`${filteredData1.role}`} </p>
              <p>Status : {`${filteredData1.userStatus}`} </p>
              <p>{lastLoginDate(filteredData1.lastLogin)} </p>
              {/* <div>
                {filteredData2.map((item) => (
                  <p>
                    <Link to={`/chatWindowScreen/${item._id}`}>
                      {item.taskName} Link
                    </Link>
                  </p>
                ))}
              </div> */}
            </div>
            <div className="w-50">
              {`Select Category`}
              <div className="globalBtnParentDiv">
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonUser9('Active Task', id)}
                  variant="secondary"
                >
                  Active Task
                </Button>
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonUser9('Parked Task', id)}
                  variant="secondary"
                >
                  Parked Task
                </Button>
                <Button
                  className="chatBot-globalBtn"
                  onClick={() => handleButtonUser9('Completed Task', id)}
                  variant="secondary"
                >
                  Completed Task
                </Button>
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleButtonTask3 = async (id, name, filteredData) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${name}` },
    ]);
    console.log('fetchedDatam', filteredData);
    const [filteredData1] = filteredData.filter((item) => item._id === id);
    console.log('fetchedDatamm', filteredData1);

    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>Task Name : {`${filteredData1.taskName}`} </p>
              <p>Task Description : {`${filteredData1.taskDescription}`} </p>
              <p>Task Status : {`${filteredData1.taskStatus}`} </p>
              <p>Created At : {`${filteredData1.createdAt}`} </p>
              <p>Project Name : {`${filteredData1.projectName}`} </p>
              <p>Client Name : {`${filteredData1.userName}`} </p>
              <p>Agent Name : {`${filteredData1.agentName}`} </p>
              <Link to={`/chatWindowScreen/${filteredData1._id}`}>
                {filteredData1.taskName} Link
              </Link>
            </div>
          </div>
        ),
      },
    ]);
  };
  const handleButtonProject3 = async (id, name, ProjectData) => {
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: 'You', message: ` ${name}` },
    ]);
    console.log('ProjectData', ProjectData);
    const [filteredData1] = ProjectData.filter((item) => item._id === id);
    console.log('   ', filteredData1);

    setChatHistory((prevHistory) => [
      ...prevHistory,
      {
        sender: 'Bot',
        message: (
          <div>
            <div>
              <p>Project Name: {`${filteredData1.projectName}`} </p>
              <p>Created At: {`${filteredData1.createdAt}`} </p>
              <p>Updated At: {`${filteredData1.updatedAt}`} </p>
              <Button
                className="chatBot-globalBtn"
                onClick={() => handleButtonProject5('Tasks', filteredData1._id)}
                variant="secondary"
              >
                {`${filteredData1.projectName}`} Tasks
              </Button>
            </div>
          </div>
        ),
      },
    ]);
  };
  // ----------------------------input-handling----
  return (
    <>
      <Card>
        <CardHeader className={`text-center chatbot-header ${theme}chatHead`}>
          <div className="d-flex justify-content-center">
            <div className={`flex-centre w-100 ${theme}backbtn`}>
              Roonberg Help
            </div>
            <div>
              {loading ? (
                <ColorRing
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={
                    toggleState
                      ? ['white', 'white', 'white', 'white', 'white']
                      : [
                          'rgba(0, 0, 0, 1) 0%',
                          'rgba(17, 17, 74, 1) 68%',
                          'rgba(0, 0, 0, 1) 93%',
                        ]
                  }
                />
              ) : (
                ''
              )}
            </div>
            <div onClick={onCloseHelp}>
              <RxCross1 className={`${theme}backbtn`} />
            </div>
          </div>
        </CardHeader>
        <CardBody
          className={`chatbot-body ${theme}chatBody`}
          ref={chatbotBodyRef}
        >
          {chatHistory.map((chat, index) => (
            <div key={index} className={`botMsg-${chat.sender} my-2`}>
              {chat.sender === 'Bot' ? (
                <div className="d-flex gap-1">
                  <div className="chatbot-bot-icon d-flex justify-content-center align-items-center me-1 ">
                    <img
                      className="chatbot-bot-icon-inner "
                      src="/logo2.png"
                      alt="B"
                    ></img>
                  </div>{' '}
                  <div className="w-100">{chat.message}</div>
                </div>
              ) : (
                <div className="d-flex gap-1">
                  <div className="w-100"> {chat.message}</div>
                  <div className="chatbot-user-icon me-1">
                    <img
                      className="chatbot-user-icon-inner"
                      src={userInfo.profile_picture}
                    ></img>
                  </div>{' '}
                </div>
              )}
            </div>
          ))}
        </CardBody>
        <CardFooter className={`${theme}chatFoot`}>
          <Form
            className="d-flex gap-2 align-items-center "
            onSubmit={(e) => handleSendMessage(e, message)}
          >
            <Form.Group className=" w-100 " controlId="formBasicEmail">
              <Form.Control
                type="text"
                value={message}
                className="height-inputBox"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                autoComplete="off" // Add this line to disable autocomplete
              />
            </Form.Group>
            <Button
              className={`ms-2 ${theme}-send-Btn-help`}
              // onClick={() => handleSendMessage(message)}
              type="submit"
            >
              <IoSendSharp />
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </>
  );
}

export default ChatBotScreen;
