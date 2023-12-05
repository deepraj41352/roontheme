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
} from '@mui/material';
import { ImCross } from 'react-icons/im';
import Modal from '@mui/material/Modal';
import { Alert, Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../../Store';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaRegClock } from 'react-icons/fa';
import AvatarImage from '../../Components/Avatar';
import { CiSettings } from 'react-icons/ci';
import axios from 'axios';
import { toast } from 'react-toastify';

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

export default function ProjectDataWidget() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [morefieldsModel, setMorefieldsModel] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [selectedRowId, setSelectedRowId] = useState(null);
  const handleCheckboxSelection = (rowId) => {
    setSelectedRowId(rowId === selectedRowId ? null : rowId);
  };
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
              className="Link-For-ChatWindow"
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
    // {
    //   field: 'checkbox',
    //   headerName: 'Select',
    //   width: 100,
    //   renderCell: (params) => (
    //     <input
    //       className="Check_box-For-Select"
    //       type="checkbox"
    //       checked={selectedRowId === params.row._id}
    //       onChange={() => handleCheckboxSelection(params.row._id)}
    //     />
    //   ),
    // },
    {
      field: 'taskName',
      headerName: 'Task Name',
      width: 300,
      renderCell: (params) => (
        <Link
          className="Link-For-ChatWindow"
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className="alignLeft">
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
          className="Link-For-ChatWindow"
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className="alignLeft">
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
          className="Link-For-ChatWindow"
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className="alignLeft">
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
      agentData,
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
    agentData: [],
  });
  console.log('selectedRowId', selectedRowId);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [ProjectData, setProjectData] = useState([]);
  const [contractorData, setContractorData] = useState([]);

  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState('active');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active Task');
  const [selectedProjects, setSelectedProjects] = useState('All Project');
  const [selectedProjectsId, setSelectedProjectsId] = useState();
  const [dynamicfield, setDynamicfield] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, SetData] = useState([]);
  const [loading, setLoading] = useState(true);

  // {Add project button.......
  const handleAddNewProject = () => {
    setDynamicfield(true);
  };
  const removeDymanic = () => {
    setDynamicfield(false);
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
        if (selectedRowId) {
          const { data } = await axios.get(`/api/task/${selectedRowId}`);
          setProjectStatus(data.taskStatus);
        }
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
  };
  const handleNew = () => {
    setIsModelOpen(true);
  };
  const ModelOpen = () => {
    setShowModal(true);
  };
  // ......}

  // {Get tasks.........
  useEffect(() => {
    setLoading(true);
    const FatchcategoryData = async () => {
      try {
        const { data: taskDatas } = await axios.get('/api/task/tasks', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        let taskData;

        if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
          taskData = taskDatas;
        } else if (userInfo.role === 'contractor') {
          taskData = taskDatas.filter((item) => {
            return item.userId === userInfo._id;
          });
        } else if (userInfo.role === 'agent') {
          taskData = taskDatas.filter((item) => {
            return item.agentId === userInfo._id;
          });
        }
        SetData(taskData);
      } catch (error) {
        toast.error(error.data?.message);
      } finally {
        setLoading(false);
      }
    };

    FatchcategoryData();
  }, [success]);
  // ......}

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

  // {Get Project .........
  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        let ContractorProject;

        if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
          ContractorProject = data; // Do not filter the data for superadmin or admin
        } else {
          // Filter data for users with roles other than superadmin or admin
          ContractorProject = data.filter((item) => {
            return item.userId === userInfo._id;
          });
        }
        setProjectData(ContractorProject);
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
  let ContractorTask;

  if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
    ContractorTask = data; // Do not filter the data for superadmin or admin
  } else {
    // Filter data for users with roles other than superadmin or admin
    ContractorTask = data.filter((item) => {
      return item.userId === userInfo._id;
    });
  }

  const taskData = ContractorTask.filter((item) => {
    if (selectedProjects === 'All Project') {
      return true; // Include all items when selectedProjects is 'All Project'
    } else {
      return item.projectId === selectedProjectsId; // Filter based on selectedProjectsId
    }
  });

  const ActiveData = data.filter((item) => {
    return item.taskStatus === 'active' || item.taskStatus === 'waiting';
  });
  const CompleteData = data.filter((item) => {
    return item.taskStatus === 'completed';
  });
  const PendingData = data.filter((item) => {
    return item.taskStatus === 'pending';
  });
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
        toast.success(data.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  // ......}

  // {Update Task Data  .........
  const handleStatusUpdate = async (e) => {
    const taskStatus = e.target.value;
    try {
      const data = await axios.put(
        `/api/task/updateStatus/${selectedRowId}`,
        { taskStatus: taskStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 200) {
        setSuccess(!success);
        setShowModal(false);
        toast.success('Task Status updated Successfully !');
      }
    } catch (err) {
      console.log(err);
    }
  };
  // ......}

  return (
    <>
      <div className="px-3">
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
            <div className="tableScreen m-0 p-0">
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
                        {/* <Button
                          className=" btn-color"
                          // onClick={}
                        >
                          <span class="position-relative">Assigned Agent</span>
                        </Button> */}
                        <Button
                          active
                          className=" btn-color2"
                          onClick={deleteTask}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
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
                            }}
                          >
                            <div className="overlayLoading">
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

                              <Form>
                                <Form.Group
                                  className="mb-3 "
                                  controlId="formBasicPassword"
                                >
                                  <Form.Label className="mb-1 fw-bold">
                                    Project Status
                                  </Form.Label>
                                  <Form.Select
                                    value={projectStatus}
                                    onChange={handleStatusUpdate}
                                  >
                                    <option value="active">Running</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                  </Form.Select>
                                </Form.Group>
                              </Form>
                            </div>
                          </Box>
                        </Modal>
                      </div>
                    )}

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
                        {/* <Button
                          className=" btn-color"
                          // onClick={}
                        >
                          <span class="position-relative">Assigned Agent</span>
                        </Button> */}
                        <Button
                          active
                          className=" btn-color2"
                          onClick={deleteTask}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                      </div>
                    )}

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
                    className={`tableGrid actionCenter tableBg  ${theme}DataGrid`}
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
                        {/* <Button
                          className=" btn-color"
                          // onClick={}
                        >
                          <span class="position-relative">Assigned Agent</span>
                        </Button> */}
                        <Button
                          active
                          className=" btn-color2"
                          onClick={deleteTask}
                        >
                          <span class="position-relative">Delete</span>
                        </Button>
                      </div>
                    )}

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
