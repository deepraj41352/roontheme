import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ImCross } from 'react-icons/im';
import Modal from '@mui/material/Modal';
import { Alert, Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import datas from '../dummyData';
import { FaRegClock } from 'react-icons/fa';
import AvatarImage from '../Components/Avatar';
import { CiSettings } from 'react-icons/ci';
import axios from 'axios';
import { toast } from 'react-toastify';
import truncateText from '../TruncateText';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, projectData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'DELETE_SUCCESS':
      return { ...state, successDelete: action.payload, loading: false };

    case 'DELETE_RESET':
      return { ...state, successDelete: false, loading: false };
    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };
    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case 'FATCH_CATEGORY':
      return { ...state, categoryData: action.payload };
    case 'FATCH_AGENTS':
      return { ...state, agentData: action.payload };
    case 'FATCH_CONTRACTOR':
      return { ...state, contractorData: action.payload };
    default:
      return state;
  }
};

export default function TasksScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [morefieldsModel, setMorefieldsModel] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const [formData, setFormData] = useState({
    projectStatus: 'active',
  });
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [selectedRowId, setSelectedRowId] = useState(null);
  const handleCheckboxSelection = (rowId) => {
    setSelectedRowId(rowId === selectedRowId ? null : rowId);
  };
  const [selectedContractor, setSelectedContractor] = useState('');

  const lastLoginTimestamp = userInfo.lastLogin;
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
      : ''
  } ago`;

  // }

  const columns = [
    {
      width: 100,
      renderCell: (params) => {
        function generateColorFromAscii(str) {
          let color = '#';
          const combination = str
            .split('')
            .map((char) => char.charCodeAt(0))
            .reduce((acc, value) => acc + value, 0);
          color += (combination * 12345).toString(16).slice(0, 6);
          return color;
        }

        const name = params.row.taskName[0].toLowerCase();
        const color = generateColorFromAscii(name);
        return (
          <>
            <Link
              className={`Link-For-ChatWindow ${theme}-textRow`}
              to={`/chatWindowScreen/${params.row._id}`}
            >
              {/* {params.row.categoryImage !== 'null' ? (
              <Avatar src={params.row.categoryImage} />
            ) : ( */}
              <AvatarImage name={name} bgColor={color} />
              {/* )} */}
            </Link>
          </>
        );
      },
    },
    {
      field: 'checkbox',
      headerName: 'Select',
      width: 100,
      renderCell: (params) => (
        <input
          className="Check_box-For-Select"
          type="checkbox"
          checked={selectedRowId === params.row._id}
          onChange={() => handleCheckboxSelection(params.row._id)}
        />
      ),
    },
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 300,
      renderCell: (params) => (
        <Link
          className={`Link-For-ChatWindow ${theme}-textRow`}
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className={`text-start ${theme}-textRow`}>
            <div>{params.row.taskName}</div>
            <div>Task ID {params.row._id}</div>
          </div>
        </Link>
      ),
    },
    {
      field: 'userName',
      headerName: 'Contractor Name',
      width: 100,
      renderCell: (params) => (
        <Link
          className={`Link-For-ChatWindow ${theme}-textRow`}
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className={`text-start ${theme}-textRow`}>
            <div>{params.row.userName}</div>
            <div>Raised By</div>
          </div>
        </Link>
      ),
    },
    {
      field: 'agentName',
      headerName: 'Agent Name',
      width: 100,
      renderCell: (params) => (
        <Link
          className={`Link-For-ChatWindow ${theme}-textRow`}
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className={`text-start ${theme}-textRow`}>
            <div>{params.row.agentName}</div>
            <div>Assigned By</div>
          </div>
        </Link>
      ),
    },
    {
      field: 'taskStatus',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        return (
          <Grid item xs={8}>
            <div
              className={
                params.row.taskStatus === 'active'
                  ? 'tableInProgressBtn'
                  : 'tableInwaitingBtn'
              }
              // onClick={() => handleEdit(params.row._id)}
            >
              <CiSettings className="clockIcon" />
              {params.row.taskStatus === 'waiting'
                ? 'Waiting On You'
                : params.row.taskStatus === 'active'
                ? 'In Progress'
                : params.row.taskStatus === 'completed'
                ? 'Completed'
                : params.row.taskStatus === 'pending'
                ? 'Ready To Completed'
                : ''}
            </div>
          </Grid>
        );
      },
    },
  ];
  const [
    {
      // loading,
      error,
      projectData,
      successDelete,
      successUpdate,
      // categoryData,
      // agentData,
      // contractorData,
    },
    dispatch,
  ] = useReducer(reducer, {
    // loading: false,
    error: '',
    projectData: [],
    successDelete: false,
    successUpdate: false,
    // categoryData: [],
    // contractorData: [],
    // agentData: [],
  });
  console.log('selectedRowId', selectedRowId);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [ProjectData, setProjectData] = useState([]);
  const [contractorData, setContractorData] = useState([]);
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [agentData, setAgentData] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState('active');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active Task');
  const [selectedProjects, setSelectedProjects] = useState('All Project');
  const [selectedProjectsId, setSelectedProjectsId] = useState();
  const [dynamicfield, setDynamicfield] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);

  const [data, SetData] = useState([]);
  const [loading, setLoading] = useState(true);

  // {Add project button.......
  const handleAddNewProject = () => {
    setDynamicfield(true);
  };

  const removeDymanic = () => {
    setDynamicfield(false);
    setProjectName('');
  };
  // ......}

  // {Open Tap.........
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };
  // ......}

  // {Select Button .........
  const handleProjectsSelect = (id, Projects) => {
    setSelectedProjects(Projects);
    setSelectedProjectsId(id);
  };
  // ......}

  useEffect(() => {
    const GetProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/${selectedRowId}`);
        setProjectStatus(data.taskStatus);
      } catch (err) {
        console.log(err);
      }
    };
    GetProject();
  }, [selectedRowId]);

  // {Model Open & Close.........
  const handleCloseRow = () => {
    setIsModelOpen(false);
    setShowModal(false);
    setShowModalDel(false);
  };

  const handleNew = () => {
    setIsModelOpen(true);
  };
  const ModelOpen = () => {
    setShowModal(true);
  };
  const ModelOpenDel = () => {
    setShowModalDel(true);
  };
  // ......}

  // {Get tasks.........
  useEffect(() => {
    setLoading(true);
    const FatchcategoryData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        SetData(data);
      } catch (error) {
        toast.error(error.data?.message);
      } finally {
        setLoading(false);
      }
    };

    FatchcategoryData();
  }, [success]);
  // ......}

  // {Get Category.........
  useEffect(() => {
    setLoading(true);
    const FatchCategory = async () => {
      try {
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        setCategoryData(datas);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchCategory();
  }, []);
  // ......}

  // {Get Agent User}
  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {}
    };
    FatchContractorData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      const filteredCategory = agentData.flatMap(
        (agentCate) => agentCate.agentCategory
      );
      console.log('filteredCategory', filteredCategory);

      const matchWithCateData = filteredCategory.map((AgentsCateId) =>
        categoryData.find((cat) => cat._id === AgentsCateId)
      );

      const finalCategory = matchWithCateData.filter(Boolean);
      setFilterCategory(finalCategory);
      console.log('matchWithCateData', finalCategory);
    };
    fetchData();
  }, [agentData, categoryData]);

  // {Get  Contractor User.........
  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });

        const selectedProject = projectData.find(
          (project) => project.projectName === SelectProjectName
        );

        if (selectedProject && selectedProject.userId) {
          const filteredContractor = data.filter(
            (contractor) => contractor._id === selectedProject.userId
          );
          setContractorData(filteredContractor);
        } else {
          setContractorData(data);
        }
      } catch (error) {}
    };

    FatchContractorData();
  }, []);
  // ......}

  // {Get Project .........
  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProjectData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [success]);
  // ......}

  // {Filter All Data by status .........
  const taskData = data.filter((item) => {
    if (selectedProjects == 'All Project') {
      return item;
    } else {
      return item.projectId === selectedProjectsId;
    }
  });
  const ActiveData = taskData.filter((item) => {
    return item.taskStatus === 'active' || item.taskStatus === 'waiting';
  });
  const CompleteData = taskData.filter((item) => {
    return item.taskStatus === 'completed';
  });
  const PendingData = taskData.filter((item) => {
    return item.taskStatus === 'pending';
  });
  // ......}

  // {Submit Form Data  .........
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const data = await axios.post(
        `/api/task/admin`,
        {
          selectProjectName: SelectProjectName,
          projectName: projectName,
          contractorId: contractorName || selectedContractor,
          taskName: taskName,
          taskDescription: taskDesc,
          taskCategory: category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 201) {
        setSuccess(!success);
        toast.success(data.data.message);
        setDynamicfield(false);
        setIsSubmiting(false);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setContractorName('');
        setSelectProjectName('');
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setContractorName('');
        setSelectProjectName('');
      }
    } catch (error) {
      toast.error(error.message);
      setIsModelOpen(false);
      setDynamicfield(false);
    } finally {
      setIsSubmiting(false);
    }
  };
  // ......}

  // {Delete Task Data  .........
  const deleteTask = async () => {
    setIsSubmiting(true);
    try {
      const data = await axios.delete(`/api/task/${selectedRowId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (data.status === 200) {
        setSuccess(!success);
        setSelectedRowId(null);

        toast.success(data.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmiting(false);
      setShowModalDel(false);
    }
  };
  // ......}

  // {Update Task Data  .........
  const handleStatusUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      const data = await axios.put(
        `/api/task/updateStatus/${selectedRowId}`,
        { taskStatus: formData.projectStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (data.status === 200) {
        setSuccess(!success);
        setShowModal(false);
        setSelectedRowId(null);

        toast.success('Task Status updated Successfully !');
      }
    } catch (err) {
      console.log(err);
    }
  };
  // ......}

  const validation = (e) => {
    const inputValue = e.target.value;
    setTaskName(inputValue);
    const firstLetterRegex = /^[a-zA-Z]/;
    if (!firstLetterRegex.test(inputValue.charAt(0))) {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(false);
    }
  };

  const selectedProjectContractor = (e) => {
    const selectedProject = e.target.value;
    setSelectProjectName(selectedProject);
    const findProject = ProjectData.find(
      (project) => project.projectName === selectedProject
    );
    if (findProject) {
      const contractor = contractorData.filter(
        (contractor) => contractor._id === findProject.userId
      );
      if (contractor) {
        const contractorName = contractor ? contractor[0]._id : 'not avaliable';
        setSelectedContractor(contractor);
      } else {
        console.log('Contractor not found for the selected project');
      }
    }
  };

  function generateColorFromAscii(str) {
    let color = '#';
    const combination = str
      .split('')
      .map((char) => char.charCodeAt(0))
      .reduce((acc, value) => acc + value, 0);
    color += (combination * 12345).toString(16).slice(0, 6);
    return color;
  }

  return (
    <>
      <div className="px-3 mt-3">
        {loading ? (
          <>
            <div className="ThreeDot">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                className="ThreeDot justify-content-center"
                color="#0e0e3d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          </>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <div className="buttonsTop">
              <Dropdown className={`mb-0 tab-btn text-start `}>
                <Dropdown.Toggle
                  id="dropdown-tabs"
                  className="my-2 globalbtnColor selectButton"
                >
                  {selectedProjects}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropMenu dropButton">
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleProjectsSelect('', 'All Project')}
                  >
                    All Project
                  </Dropdown.Item>
                  {ProjectData.map((project, key) => (
                    <Dropdown.Item
                      key={project._id} // Make sure to use a unique key for each item
                      className="dropMenuCon"
                      onClick={() =>
                        handleProjectsSelect(project._id, project.projectName)
                      }
                    >
                      <span className="position-relative">
                        {project.projectName}
                      </span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="outlined"
                className="my-2 d-flex globalbtnColor"
                onClick={handleNew}
              >
                <BiPlusMedical className="mx-2" />
                Add Task
              </Button>
            </div>

            <div>
              <div className="overlayLoading">
                {isDeleting && (
                  <div className="overlayLoadingItem1">
                    <ColorRing
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      const
                      colors={['white', 'white', 'white', 'white', 'white']}
                    />
                  </div>
                )}

                <Dropdown className={`mb-0 dropTab1 tab-btn`}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-tabs">
                    {selectedTab}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropMenu">
                    <Dropdown.Item
                      className="dropMenuCon"
                      onClick={() => handleTabSelect('Active Task')}
                    >
                      <span class="position-relative">Active Task</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropMenuCon"
                      onClick={() => handleTabSelect('Parked Task')}
                    >
                      <span class="position-relative">Parked Task</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      active
                      className="dropMenuCon"
                      onClick={() => handleTabSelect('Completed Task')}
                    >
                      <span class="position-relative">Completed Task</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Tabs
                  activeKey={selectedTab}
                  onSelect={(tab) => handleTabSelect(tab)}
                  id="uncontrolled-tab-example"
                  className={`mb-0 tab-btn tabBack dropTab`}
                >
                  <Tab
                    className="tab-color"
                    eventKey="Active Task"
                    title={<span class="position-relative">Active Task</span>}
                  >
                    {selectedRowId && (
                      <div className="btn-for-update">
                        <Button className=" btn-color1" onClick={ModelOpen}>
                          <span class="position-relative">Update Status</span>
                        </Button>
                        <Button
                          active
                          className=" btn-color2"
                          onClick={ModelOpenDel}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                        <Modal
                          open={showModalDel}
                          onClose={handleCloseRow}
                          className="overlayLoading modaleWidth p-0"
                        >
                          <Box
                            className="modelBg"
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: 400,
                              bgcolor: 'background.paper',
                              boxShadow: 24,
                              p: isSubmiting ? 0 : 4,
                              borderRadius: 1,
                            }}
                          >
                            <div className="overlayLoading p-2">
                              <div className="pb-4">
                                Make sure you want to delete this task.
                              </div>
                              <Button
                                variant="outlined"
                                onClick={deleteTask}
                                className="globalbtnColor"
                              >
                                Confirm
                              </Button>

                              {/* Cancel button */}
                              <Button
                                variant="outlined"
                                onClick={handleCloseRow}
                                className="ms-2 globalbtnColor"
                              >
                                Cancel
                              </Button>
                            </div>
                          </Box>
                        </Modal>

                        <Modal
                          open={showModal}
                          onClose={handleCloseRow}
                          className="overlayLoading modaleWidth p-0"
                        >
                          <Box
                            className="modelBg"
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: 400,
                              bgcolor: 'background.paper',
                              boxShadow: 24,
                              p: isSubmiting ? 0 : 4,
                              borderRadius: 1,
                            }}
                          >
                            <div className="overlayLoading">
                              {/* ... Your loading animation code ... */}

                              <Form className="p-2">
                                <Form.Group
                                  className="mb-3"
                                  controlId="formBasicPassword"
                                >
                                  <Form.Label className="mb-1 fw-bold">
                                    Task Status
                                  </Form.Label>
                                  <Form.Select
                                    name="projectStatus"
                                    value={formData.projectStatus}
                                    onChange={handleStatusUpdate}
                                  >
                                    <option value="active">Running</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                  </Form.Select>
                                </Form.Group>

                                {/* Submit button */}
                                <Button
                                  variant="outlined"
                                  onClick={handleFormSubmit}
                                  className="globalbtnColor"
                                >
                                  Confirm
                                </Button>

                                {/* Cancel button */}
                                <Button
                                  variant="outlined"
                                  onClick={handleCloseRow}
                                  className="ms-2 globalbtnColor"
                                >
                                  Cancel
                                </Button>
                              </Form>
                            </div>
                          </Box>
                        </Modal>
                      </div>
                    )}
                    <div className="lastLogin">
                      <FaRegClock className="clockIcontab" />
                      {formattedLastLogin}
                    </div>

                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        className={`tableGrid actionCenter tableBg  ${theme}DataGrid`}
                        rows={ActiveData}
                        columns={columns}
                        getRowId={(row) => row._id}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                        localeText={{
                          noRowsLabel: 'Task Is Not Avalible',
                        }}
                      />
                    </Box>
                    <Modal
                      open={isModelOpen}
                      onClose={handleCloseRow}
                      className="overlayLoading modaleWidth p-0"
                    >
                      <Box
                        className="modelBg modelContainer"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 400,
                          bgcolor: 'background.paper',
                          boxShadow: 24,
                          p: 4,
                          borderRadius: 1,
                        }}
                      >
                        {isSubmiting && (
                          <div className="overlayLoadingItem1 y-3">
                            <ColorRing
                              visible={true}
                              height="40"
                              width="40"
                              ariaLabel="blocks-loading"
                              wrapperStyle={{}}
                              wrapperClass="blocks-wrapper"
                              colors={[
                                'rgba(0, 0, 0, 1) 0%',
                                'rgba(255, 255, 255, 1) 68%',
                                'rgba(0, 0, 0, 1) 93%',
                              ]}
                            />
                          </div>
                        )}

                        <Form
                          className="scrollInAdminproject p-3"
                          onSubmit={handleSubmit}
                        >
                          <ImCross
                            color="black"
                            className="formcrossbtn"
                            onClick={handleCloseRow}
                          />
                          <h4 className="d-flex justify-content-center">
                            Add Task
                          </h4>

                          <div className="cateContainer mb-3">
                            <p className="cateItem">Categories</p>
                            <div className="d-flex flex-wrap cateborder ">
                              {filterCategory.map((category) => (
                                <div key={category._id} className="cateItems">
                                  <Form.Check
                                    className="d-flex align-items-center gap-2"
                                    type="radio"
                                    id={`category-${category._id}`}
                                    name="category"
                                    value={category.categoryName}
                                    label={
                                      <div className="d-flex align-items-center">
                                        <div className="">
                                          {category.categoryImage !== 'null' ? (
                                            <Avatar
                                              src={category.categoryImage}
                                            />
                                          ) : (
                                            <AvatarImage
                                              name={category.categoryName}
                                              bgColor={generateColorFromAscii(
                                                category.categoryName[0].toLowerCase()
                                              )}
                                            />
                                          )}
                                        </div>
                                        <div className="d-flex">
                                          <span
                                            className="ms-2 spanForCate"
                                            data-tooltip={category.categoryName}
                                          >
                                            {truncateText(
                                              category.categoryName,
                                              7
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    }
                                    onChange={(e) =>
                                      setCategory(e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <FormControl
                            className={dynamicfield ? 'disable mb-3' : 'mb-3'}
                          >
                            <InputLabel>Select Project </InputLabel>
                            <Select
                              value={SelectProjectName}
                              onChange={(e) => selectedProjectContractor(e)}
                              // required
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    top: 474,
                                  },
                                },
                              }}
                            >
                              <MenuItem
                                disabled={dynamicfield}
                                onClick={() => {
                                  handleAddNewProject();
                                }}
                              >
                                <MdAddCircleOutline /> Add New Project
                              </MenuItem>
                              {ProjectData &&
                                ProjectData.map((items) => (
                                  <MenuItem
                                    key={items._id}
                                    value={items.projectName}
                                    onClick={() => removeDymanic()}
                                  >
                                    {items.projectName}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          {dynamicfield ? (
                            <div className="d-flex align-items-center gap-1">
                              <TextField
                                required
                                className="mb-3"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                label="Project Name"
                                fullWidth
                              />
                            </div>
                          ) : null}

                          <TextField
                            required
                            className="mb-3"
                            value={taskName}
                            onChange={validation}
                            label="Task Name"
                            fullWidth
                            type="text"
                          />
                          {ShowErrorMessage && (
                            <Alert
                              variant="danger"
                              className="error nameValidationErrorBox"
                            >
                              The first letter of the task should be an alphabet
                            </Alert>
                          )}

                          <TextField
                            required
                            className="mb-3"
                            value={taskDesc}
                            onChange={(e) => setTaskDesc(e.target.value)}
                            label="Description"
                            fullWidth
                          />

                          <FormControl className={'mb-3'}>
                            <InputLabel>Select Contractor</InputLabel>
                            {SelectProjectName && selectedContractor ? (
                              <Select
                                value={selectedContractor[0]._id}
                                onChange={(e) =>
                                  setContractorName(e.target.value)
                                }
                                disabled
                              >
                                <MenuItem value={selectedContractor[0]._id}>
                                  {selectedContractor[0].first_name}
                                </MenuItem>
                              </Select>
                            ) : (
                              <Select
                                value={contractorName}
                                onChange={(e) =>
                                  setContractorName(e.target.value)
                                }
                                required
                              >
                                <MenuItem value="" disabled>
                                  Select Contractor
                                </MenuItem>
                                <MenuItem value="addNew">
                                  <Link
                                    to={`/adminContractorList`}
                                    className="addCont"
                                  >
                                    <MdAddCircleOutline /> Add New Contractor
                                  </Link>
                                </MenuItem>
                                {contractorData.map((item) => (
                                  <MenuItem key={item._id} value={item._id}>
                                    {item.first_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          </FormControl>

                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className="mt-2 formbtn updatingBtn globalbtnColor"
                            disabled={ShowErrorMessage}
                          >
                            {isSubmiting ? 'SUBMITTING' : 'SUBMIT '}
                          </Button>
                        </Form>
                      </Box>
                    </Modal>
                  </Tab>
                  <Tab
                    className="tab-color"
                    eventKey="Parked Task"
                    title={<span class="position-relative">Parked Task</span>}
                  >
                    {selectedRowId && (
                      <div className="btn-for-update">
                        <Button className=" btn-color1" onClick={ModelOpen}>
                          <span class="position-relative">Update Status</span>
                        </Button>
                        <Button
                          active
                          className=" btn-color2"
                          onClick={ModelOpenDel}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                      </div>
                    )}
                    <div className="lastLogin">
                      <FaRegClock className="clockIcontab" />{' '}
                      {formattedLastLogin}
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        className={`tableGrid actionCenter tableBg  ${theme}DataGrid`}
                        rows={PendingData}
                        columns={columns}
                        getRowId={(row) => row._id}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                        localeText={{
                          noRowsLabel: 'Task Is Not Avalible',
                        }}
                      />
                    </Box>
                  </Tab>
                  <Tab
                    className="tab-color"
                    eventKey="Completed Task"
                    title={
                      <span class="position-relative">Completed Task</span>
                    }
                  >
                    {selectedRowId && (
                      <div className="btn-for-update">
                        <Button className=" btn-color1" onClick={ModelOpen}>
                          <span class="position-relative">Update Status</span>
                        </Button>
                        <Button
                          active
                          className=" btn-color2"
                          onClick={ModelOpenDel}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                      </div>
                    )}
                    <div className="lastLogin">
                      <FaRegClock className="clockIcontab" />{' '}
                      {formattedLastLogin}
                    </div>
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        className={`tableGrid actionCenter tableBg  ${theme}DataGrid`}
                        rows={CompleteData}
                        columns={columns}
                        getRowId={(row) => row._id}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 5,
                            },
                          },
                        }}
                        pageSizeOptions={[5]}
                        // checkboxSelection
                        disableRowSelectionOnClick
                        localeText={{
                          noRowsLabel: 'Task Is Not Avalible',
                        }}
                      />
                    </Box>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
