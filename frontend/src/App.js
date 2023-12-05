import './App.css';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUpForm from './Screens/SignInScreen';
import RegistrationForm from './Screens/RegistrationScreen';
import AdminProjectListScreen from './Screens/AdminProjectListScreen';
import SearchScreen from './Screens/SearchScreen';
import ChatWindowScreen from './Screens/ChatWindowScreen';
import { useContext, useState, useEffect } from 'react';
import { Container, Image, Nav, Dropdown, Navbar } from 'react-bootstrap';
import Sidebar from './Components/Sidebar';
import {
  AiOutlineAlignLeft,
  AiOutlineCheck,
  AiOutlineHome,
} from 'react-icons/ai';
import { BsFillPersonFill, BsSearch } from 'react-icons/bs';
import { BiShareAlt } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FiClock } from 'react-icons/fi';
import { MdLogout, MdOutlineNotifications } from 'react-icons/md';
import axios from 'axios';
import { Store } from './Store';
import AdminDashboard from './Screens/AdminDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import ProfileScreen from './Screens/ProfileScreen';
import Theme from './Components/Theme';
import ProjectNotification from './Screens/ProjectNotification';
import AddProject from './Screens/AddProject';
import ContractorProject from './Contractor/ContractorProjectListScreen';
import AgentProjectList from './Agent/AgentProjectListScreen';
import NotificationScreen from './Screens/NotificationScreen';
import MyComponent from './Components/MyComponent';
import Footer from './Components/footer';
import ConfirmRegistration from './Screens/ConfirmRegistration';
import TasksScreen from './Screens/TasksScreen';
import TaskAddButton from './Components/TaskAddButton';
import ContractorTaskScreen from './Screens/ContractorTaskScreen';
import AgentTaskScreen from './Agent/AgentTaskScreen';

// NewFiles
import AdminList from './Screens/Admins/admin/AdminList';
import AdminCreate from './Screens/Admins/admin/AdminCreate';
import AdminUpdate from './Screens/Admins/admin/AdminUpdate';
import AgentCreate from './Screens/Admins/agent/AgentCreate';
import AgentUpdate from './Screens/Admins/agent/AgentUpdate';
import AgentList from './Screens/Admins/agent/AgentList';
import ContractorList from './Screens/Admins/contractor/ContractorList';
import ContractorCreate from './Screens/Admins/contractor/ContractorCreate';
import ContractorUpdate from './Screens/Admins/contractor/ContractorUpdate';
import CategoryCreate from './Screens/Admins/category/CategoryCreate';
import CategoryList from './Screens/Admins/category/CategoryList';
import CategoryUpdate from './Screens/Admins/category/CategoryUpdate';
import { IoPersonOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { VscColorMode } from 'react-icons/vsc';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pathName, setPathName] = useState();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, NotificationData } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [isToggled, setIsToggled] = useState(toggleState);
  const handleChangeToggleState = () => {
    setIsToggled(!isToggled);
  };
  useEffect(() => {
    ctxDispatch({ type: 'TOGGLE_BTN', payload: isToggled });
    localStorage.setItem('toggleState', JSON.stringify(isToggled));
  }, [isToggled]);
  const [searchValue, setSearchValue] = useState('');
  const [user, setuser] = useState(true);
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const handleSearchScreen = () => {
    navigate('/searchScreen');
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  const handelforNOtification = () => {
    ctxDispatch({ type: 'NOTIFICATION-NULL' });
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    setPathName(pathname);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseOver = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className={userInfo ? `App ${theme}` : `App`}>
      <ToastContainer position="bottom-center" autoClose={600} limit={1} />

      <div>
        <Container fluid className="px-0">
          <div className="d-flex ">
            {userInfo ? (
              <Sidebar
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
              />
            ) : null}

            <div className={`px-0  w-100`}>
              {userInfo ? (
                <Navbar expand="lg" className={`${theme}-admin-navbar`}>
                  <Container fluid>
                    <div
                      className={`p-2 me-3 fs-5 admin-btn-logo ${theme}-navbar-Btn`}
                      onClick={toggleSidebar}
                    >
                      <AiOutlineAlignLeft />
                    </div>
                    <Navbar.Brand href="/dashboard">
                      <Image
                        className="Roonberg-logo me-3 ms-2"
                        src="/logo2.png"
                        thumbnail
                      />
                    </Navbar.Brand>
                    <Navbar.Collapse
                      className="justify-content-end disNone"
                      id="navbarScroll"
                    >
                      <Nav
                        className="gap-3"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                      >
                        <div className="py-2">
                          <Theme />
                        </div>
                        <Link
                          to="/notificationScreen"
                          className="position-relative"
                        >
                          <MdOutlineNotifications
                            className={`fs-4 admin-btn-logo ${theme}-navbar-Btn`}
                            title="Notifications"
                          />
                          {NotificationData.length > 0 && (
                            <span className="position-absolute notification-badgeApp top-0 start-110 translate-middle badge rounded-pill bg-danger">
                              {NotificationData.length}
                            </span>
                          )}
                        </Link>
                        <Dropdown
                          className="mb-0 tab-btn text-start smallDeviceProfile"
                          show={isOpen}
                          onMouseOver={handleMouseOver}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Dropdown.Toggle
                            id="dropdown-tabs"
                            className="my-2 profilebtnColor profileToggleBtn selectButton"
                          >
                            <img
                              className="profile-icon-inner Nav-image img-fornavs"
                              src={
                                userInfo.profile_picture
                                  ? userInfo.profile_picture
                                  : './avatar.png'
                              }
                              alt="userimg"
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            className="dropMenu dropMenuProfile drophover"
                            style={{
                              transition:
                                'opacity 0.3s ease, transform 0.3s ease',
                            }}
                          >
                            <Dropdown.Item>
                              <div className="d-flex gap-3 w-100">
                                <div>
                                  <div>
                                    {' '}
                                    <img
                                      className="profile-icon-inner Nav-image img-fornavs"
                                      src={
                                        userInfo.profile_picture
                                          ? userInfo.profile_picture
                                          : './avatar.png'
                                      }
                                      alt="userimg"
                                    />
                                  </div>
                                </div>
                                <div className="d-flex flex-column">
                                  <div>{userInfo.first_name}</div>
                                  <div>{userInfo.email}</div>
                                </div>
                              </div>
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item
                              href="/profile-screen"
                              className="mb-2"
                            >
                              <IoPersonOutline className="fs-4 me-3 pb-1" />
                              My Profile
                            </Dropdown.Item>
                            <Dropdown.Item href=" /dashboard" className="mb-2">
                              <AiOutlineHome className="fs-4 me-3 pb-1" />
                              Dashboard
                            </Dropdown.Item>
                            <Dropdown.Item
                              href="/notificationScreen"
                              className="mb-2"
                            >
                              <IoMdNotificationsOutline className="fs-4 me-3 pb-1 " />
                              Notification
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleChangeToggleState}>
                              <VscColorMode className="fs-4 me-3 pb-1 " />
                              {theme === 'light' ? 'Dark' : 'Light'} Mode
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item onClick={signoutHandler}>
                              <MdLogout className="fs-4 me-3 pb-1" />
                              Logout
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        {/* <ProfileDropdown /> */}
                      </Nav>
                    </Navbar.Collapse>
                    <div
                      className={`p-2 me-3 fs-5 admin-btn-logo2 ${theme}-navbar-Btn`}
                      onClick={toggleSidebar}
                    >
                      <AiOutlineAlignLeft />
                    </div>
                  </Container>
                </Navbar>
              ) : (
                <Navbar expand="lg" className="main-div">
                  <Container className="loginPageNav">
                    <Navbar.Brand href="/">
                      <Image className="border-0" src="/logo2.png" thumbnail />
                    </Navbar.Brand>
                    {/* Remove Navbar.Toggle and Navbar.Collapse components */}
                    <Nav className="justify-content-end login-button">
                      <Nav className="login-nav ">
                        {pathName && pathName === '/registration' ? (
                          <a className="login-admin" href="/">
                            Login
                          </a>
                        ) : (
                          <a className="login-admin" href="/registration">
                            Signup
                          </a>
                        )}
                      </Nav>
                    </Nav>
                  </Container>
                </Navbar>
              )}
              <main className={userInfo ? `windowCal` : `windowCal1`}>
                <div className={userInfo ? `py-5 px-4` : `m-0 mx-3`}>
                  <Routes>
                    <Route
                      path="/"
                      element={userInfo ? <AdminDashboard /> : <SignUpForm />}
                    />
                    <Route path="/test" element={<MyComponent />} />
                    <Route
                      path="/confirm/:token"
                      element={<ConfirmRegistration />}
                    />
                    <Route
                      path="/registration"
                      element={<RegistrationForm />}
                    />
                    <Route
                      path="/ForgetPassword"
                      element={<ForgetPassword />}
                    />
                    <Route path="/add-project" element={<AddProject />} />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPasswordScreen />}
                    />
                    <Route
                      path="/projectNotification"
                      element={<ProjectNotification />}
                    />
                    {/* <Route
                      path="/superadmineditadmin/:id"
                      element={<SuperadminEditAdmin />}
                    /> */}

                    {/* New Routes Create */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/create"
                      element={
                        <ProtectedRoute>
                          <AdminCreate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/:id"
                      element={
                        <ProtectedRoute>
                          <AdminUpdate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent"
                      element={
                        <ProtectedRoute>
                          <AgentList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/create"
                      element={
                        <ProtectedRoute>
                          <AgentCreate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/:id"
                      element={
                        <ProtectedRoute>
                          <AgentUpdate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/contractor"
                      element={
                        <ProtectedRoute>
                          <ContractorList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/contractor/create"
                      element={
                        <ProtectedRoute>
                          <ContractorCreate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/contractor/:id"
                      element={
                        <ProtectedRoute>
                          <ContractorUpdate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/category"
                      element={
                        <ProtectedRoute>
                          <CategoryList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/category/create"
                      element={
                        <ProtectedRoute>
                          <CategoryCreate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/category/:id"
                      element={
                        <ProtectedRoute>
                          <CategoryUpdate />
                        </ProtectedRoute>
                      }
                    />
                    {/* ........} */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/adminProjectList"
                      element={
                        <ProtectedRoute>
                          <AdminProjectListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tasksScreen"
                      element={
                        <ProtectedRoute>
                          <TasksScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/contractor-tasksScreen"
                      element={
                        <ProtectedRoute>
                          <ContractorTaskScreen />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/profile-screen"
                      element={
                        <ProtectedRoute>
                          <ProfileScreen />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/taskScreen-agent"
                      element={
                        <ProtectedRoute>
                          <AgentTaskScreen />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/searchScreen"
                      element={<SearchScreen searchFor={searchValue} />}
                    />

                    <Route
                      path="/chatWindowScreen/:id"
                      element={
                        <ProtectedRoute>
                          <ChatWindowScreen />
                        </ProtectedRoute>
                      }
                    />

                    {/* Contractor */}
                    <Route
                      path="/project-list-screen"
                      element={
                        <ProtectedRoute>
                          <ContractorProject />
                        </ProtectedRoute>
                      }
                    />

                    {/* agent */}
                    <Route
                      path="/agentProjectList"
                      element={
                        <ProtectedRoute>
                          <AgentProjectList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notificationScreen"
                      element={
                        <ProtectedRoute>
                          <NotificationScreen />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
              </main>
              {userInfo && <TaskAddButton />}
              <Footer />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
