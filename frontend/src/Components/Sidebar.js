import React, { useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
import { HiUserGroup } from 'react-icons/hi';
import { FaListUl } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { IoMdNotifications } from 'react-icons/io';
import { AiFillHome, AiOutlineProject } from 'react-icons/ai';
import { MdGroup, MdLogout, MdOutlineGroups2 } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { ImCross } from 'react-icons/im';
import axios from 'axios';
import { BiTask } from 'react-icons/bi';
import { VscColorMode } from 'react-icons/vsc';
import { useTranslation } from 'react-i18next';
import { BiHelpCircle } from 'react-icons/bi';
import LanguageSwitcher from './LanguageSwitcher';

function Sidebar({ sidebarVisible, setSidebarVisible }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, NotificationData } = state;
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const { toggleState, languageName } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [newNotification, setnewNotification] = useState([]);
  const { t } = useTranslation();
  // const socketUrl = process.env.REACT_APP_SOCKETURL;
  // const socket = io(socketUrl);
  // socket.emit('connectionForNotify', () => {
  //   console.log('oiuhjioyhi');
  // });

  const [isToggled, setIsToggled] = useState(toggleState);
  const handleChangeToggleState = () => {
    setIsToggled(!isToggled);
  };
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('activeTab') || 'dashboard'
  );
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // useEffect(() => {
  //   const handleNotification = (notifyUser, message) => {
  //     if (notifyUser == userInfo._id) {
  //       ctxDispatch({ type: 'NOTIFICATION', payload: { notifyUser, message } });
  //     }
  //   };
  //   socket.on('notifyProjectFrontend', handleNotification);
  //   return () => {
  //     socket.off('notifyProjectFrontend', handleNotification);
  //   };
  // }, []);

  useEffect(() => {
    const handleNotification = async (notifyUser, message) => {
      const { data } = await axios.get(`/api/notification/${userInfo._id}`, {
        headers: {
          Authorization: ` Bearer ${userInfo.token}`,
          'Accept-Language': languageName,
        },
      });
      ctxDispatch({ type: 'NOTIFICATION-NULL' });
      data.map((item) => {
        if (item.status == 'unseen')
          ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
      });
    };
    handleNotification();
    // socket.on('notifyUserFrontend', handleNotification);
  }, [languageName]);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('activeTab');
    window.location.href = '/';
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1179);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResponsiveSidebarVisable = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handlSmallScreeneClick = () => {
    if (isSmallScreen) {
      setSidebarVisible(!sidebarVisible);
    }
  };

  // useEffect(() => {
  //   const fetchNotificationData = async () => {
  //     // ctxDispatch({ type: 'NOTIFICATION-NULL' });
  //     try {
  //       const { data } = await axios.get(`/api/notification/${userInfo._id}`, {
  //         headers: { Authorization: `Bearer ${userInfo.token}` },
  //       });
  //       const unseenNotifications = data.filter(
  //         (notification) => notification.status === 'unseen'
  //       );
  //       setnewNotification(unseenNotifications);
  //       // const NotifyData = response.data;
  //       // ctxDispatch({ type: 'NOTIFICATION-NULL' });

  //       // NotifyData.map((item) => {
  //       //   if (item.status == 'unseen')
  //       //     ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
  //       // });
  //     } catch (error) {
  //       console.error('Error fetching notification data:', error);
  //     }
  //   };

  //   fetchNotificationData();
  // }, [NotificationData]);

  // const uniqueNotificationData = [...new Set(NotificationData)];

  // useEffect(() => {
  //   const noteData = [...NotificationData];
  //   const data = noteData.filter((note) => {
  //     if (note.notificationId) {
  //     }
  //   });
  // }, []);

  useEffect(() => {
    ctxDispatch({ type: 'TOGGLE_BTN', payload: isToggled });
    localStorage.setItem('toggleState', JSON.stringify(isToggled));
  }, [isToggled]);

  return (
    <div
      className={`sidebar ${theme}sidebar-theme ${
        !sidebarVisible ? '' : 'visible'
      } `}
    >
      <div className={`${theme}-blank-box d-flex align-items-center`}>
        <div className="ms-3 disNonePro">
          <LanguageSwitcher />
        </div>
      </div>
      <ImCross
        className="sidebarCrossBtn"
        onClick={handleResponsiveSidebarVisable}
      />
      <ul className="dash-list">
        <motion.li
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          <Link
            to="/dashboard"
            className={`${theme}-text-decoration-none`}
            onClick={() => {
              handlSmallScreeneClick();
              setActiveTab('dashboard');
            }}
          >
            <li
              className={
                activeTab === 'dashboard' ? 'activeBack liCon' : 'liCon'
              }
            >
              <AiFillHome className="me-3 fs-5" />
              <div className="mt-1">Dashboard</div>
            </li>
          </Link>
        </motion.li>
        {userInfo.role == 'superadmin' ? (
          <motion.li
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10,
            }}
          >
            <Link
              to="/admin-screen"
              className={`${theme}-text-decoration-none`}
              onClick={() => {
                handlSmallScreeneClick();
                setActiveTab('admin');
              }}
            >
              <li
                className={activeTab === 'admin' ? 'activeBack liCon' : 'liCon'}
              >
                <MdOutlineGroups2 className="me-3 fs-5" />
                <div className="mt-1">{t('admin')}</div>
              </li>
            </Link>
          </motion.li>
        ) : null}

        {userInfo.role === 'admin' || userInfo.role === 'superadmin' ? (
          <>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/agent-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('agent');
                }}
              >
                <li
                  className={
                    activeTab === 'agent' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <HiUserGroup className="me-3 fs-5" />
                  <div className="mt-1">{t('agent')}</div>
                </li>
              </Link>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/client-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('contractor');
                }}
              >
                <li
                  className={
                    activeTab === 'contractor' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <MdGroup className="me-3 fs-5" />
                  <div className="mt-1">{t('client')}</div>
                </li>
              </Link>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/category-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('category');
                }}
              >
                <li
                  className={
                    activeTab === 'category' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <FaListUl className="me-3 fs-5" />
                  <div className="mt-1">{t('categories')}</div>
                </li>
              </Link>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/admin/project-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('adminProject');
                }}
              >
                <li
                  className={
                    activeTab === 'adminProject' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <AiOutlineProject className="me-3 fs-5" />
                  <div className="mt-1">{t('project')}</div>
                </li>
              </Link>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/admin/task-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('adminTasks');
                }}
              >
                <li
                  className={
                    activeTab === 'adminTasks' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <BiTask className="me-3 fs-5" />
                  <div className="mt-1">{t('task')}</div>
                </li>
              </Link>
            </motion.li>
          </>
        ) : null}

        {userInfo.role == 'contractor' ? (
          <>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/client/project-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('contractorProject');
                }}
              >
                <li
                  className={
                    activeTab === 'contractorProject'
                      ? 'activeBack liCon'
                      : 'liCon'
                  }
                >
                  <AiOutlineProject className="me-3 fs-5" />
                  <div className="mt-1">{t('project')}</div>
                </li>
              </Link>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/client/task-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('contractorTasks');
                }}
              >
                <li
                  className={
                    activeTab === 'contractorTasks'
                      ? 'activeBack liCon'
                      : 'liCon'
                  }
                >
                  <BiTask className="me-3 fs-5" />
                  <div className="mt-1">{t('task')}</div>
                </li>
              </Link>
            </motion.li>
          </>
        ) : null}

        {userInfo.role == 'agent' ? (
          <>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/agent/project-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('agentProject');
                }}
              >
                <li
                  className={
                    activeTab === 'agentProject' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <AiOutlineProject className="me-3 fs-5" />
                  <div className="mt-1">{t('project')}</div>
                </li>
              </Link>
            </motion.li>
            <motion.li
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}
            >
              <Link
                to="/agent/task-screen"
                className={`${theme}-text-decoration-none`}
                onClick={() => {
                  handlSmallScreeneClick();
                  setActiveTab('agentTasks');
                }}
              >
                <li
                  className={
                    activeTab === 'agentTasks' ? 'activeBack liCon' : 'liCon'
                  }
                >
                  <BiTask className="me-3 fs-5" />
                  <div className="mt-1">Task</div>
                </li>
              </Link>
            </motion.li>
          </>
        ) : null}

        <motion.li
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          <Link
            to="/notification-screen"
            className={`${theme}-text-decoration-none`}
            onClick={() => {
              handlSmallScreeneClick();
              setActiveTab('notificationScreen');
            }}
          >
            <li
              className={
                activeTab === 'notificationScreen'
                  ? 'activeBack d-flex'
                  : 'd-flex'
              }
            >
              <IoMdNotifications className="me-3 fs-5 " />
              <div className="position-relative">
                {t('notification')}
                {NotificationData.length > 0 && (
                  <span className="notication-bdg">
                    {NotificationData.length}
                  </span>
                )}
              </div>
            </li>
          </Link>
        </motion.li>

        <motion.li
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
          className="disNonePro"
        >
          <Link
            to="/profile-screen"
            className={`${theme}-text-decoration-none disNonePro`}
            onClick={() => {
              handlSmallScreeneClick();
              setActiveTab('profile');
            }}
          >
            <li className={activeTab === 'profile' ? 'activeBack' : ''}>
              <img
                className="profile-icon2 profile-icon-inner fs-5 img-fornavs"
                src={
                  userInfo.profile_picture
                    ? userInfo.profile_picture
                    : './avatar.png'
                }
                alt="userimg"
              />
              {t('myProfile')}
            </li>
          </Link>
        </motion.li>

        <motion.li
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
          className="disNonePro"
        >
          <Link
            className={`${theme}-text-decoration-none disNonePro`}
            onClick={handleChangeToggleState}
          >
            <li>
              <VscColorMode className="fs-4 me-3 pb-1 " />
              {theme === 'light' ? t('dark') : t('light')} {t('mode')}
            </li>
          </Link>
        </motion.li>

        <motion.li
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
          className="help-sbtn"
        >
          <Link
            to="/help-screen"
            className={`${theme}-text-decoration-none disNonePro`}
            onClick={() => {
              handlSmallScreeneClick();
              setActiveTab('helpScreen');
            }}
          >
            <li
              className={
                activeTab === 'helpScreen' ? 'activeBack liCon' : 'liCon'
              }
            >
              <BiHelpCircle className="me-3 fs-5" />
              <div className="mt-1">{t('help')}?</div>
            </li>
          </Link>
        </motion.li>

        <motion.li
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          <Link
            to="#Logout"
            onClick={signoutHandler}
            className={`${theme}-text-decoration-none`}
          >
            <li>
              <MdLogout className="me-3 fs-5" />
              {t('logout')}
            </li>
          </Link>
        </motion.li>
      </ul>
    </div>
  );
}

export default Sidebar;
