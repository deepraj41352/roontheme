import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Dropdown, Form } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaRegClock } from 'react-icons/fa';
import AvatarImage from '../../../Components/Avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';
import { IoSettings } from 'react-icons/io5';
import DataTable from '../../../Components/DataTable';

export default function AgentTasksList() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const [formData, setFormData] = useState({
    projectStatus: 'active',
  });
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [selectedRowId, setSelectedRowId] = useState(null);

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
      : '0 Minute'
  } ago`;

  const columns = [
    {
      minWidth: 100,
      flex: 1,
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
              <AvatarImage name={name} bgColor={color} />
            </Link>
          </>
        );
      },
    },
    {
      field: 'taskName',
      headerName: 'Task',
      minWidth: 100,
      flex: 1,
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
      headerName: 'Client',
      minWidth: 100,
      flex: 1,
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
      headerName: 'Agent',
      minWidth: 100,
      flex: 1,
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
      minWidth: 225,
      flex: 1,
      renderCell: (params) => {
        return (
          <Grid item xs={8}>
            <div
              className={
                params.row.taskStatus === 'active'
                  ? 'tableInProgressBtn'
                  : 'tableInwaitingBtn'
              }
            >
              <IoSettings className="clockIcon" />
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

  const [ProjectData, setProjectData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Active Task');
  const [selectedProjects, setSelectedProjects] = useState('All Project');
  const [selectedProjectsId, setSelectedProjectsId] = useState();
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);
  const [error, setError] = useState('');
  const [data, SetData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  const handleProjectsSelect = (id, Projects) => {
    setSelectedProjects(Projects);
    setSelectedProjectsId(id);
  };

  // useEffect(() => {
  //   const GetProject = async () => {
  //     try {
  //       const { data } = await axios.get(`/api/task/${selectedRowId}`);
  //       setProjectStatus(data.taskStatus);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   GetProject();
  // }, [selectedRowId]);

  const handleCloseRow = () => {
    setShowModal(false);
    setShowModalDel(false);
  };
  const ModelOpen = () => {
    setShowModal(true);
  };
  const ModelOpenDel = () => {
    setShowModalDel(true);
  };

  useEffect(() => {
    setLoading(true);
    const FatchcategoryData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        const taskData = data.filter((item) => {
          return item.agentId === userInfo._id;
        });
        SetData(taskData);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };

    FatchcategoryData();
  }, [success]);

  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const projectData = data.filter((item) => {
          return item.agentId.includes(userInfo._id);
        });
        setProjectData(projectData);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [success]);

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

  const deleteTask = async () => {
    setIsSubmiting(true);
    try {
      const data = await axios.delete(`/api/task/${selectedRowId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (data.status === 200) {
        setSuccess(!success);
        setSelectedRowId(null);
        toast.success('Task Deleted Sucessfully!');
      }
    } catch (error) {
      toast.error('Failed To Delete Task');
    } finally {
      setIsSubmiting(false);
      setShowModalDel(false);
    }
  };

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

        toast.success('Task Status Updated Successfully !');
      }
    } catch (err) {
      toast.error('Failed To Update Task Status');
    }
  };
  const renderButtons = () => (
    <div className="mt-3">
      <Button
        variant="outlined"
        onClick={ModelOpen}
        className="modaleButton btn-color1"
      >
        Status Update
      </Button>
      <Button
        variant="outlined"
        className="ms-2 modaleButton btn-color2"
        onClick={ModelOpenDel}
        disabled={isSubmiting}
      >
        Delete
      </Button>
    </div>
  );

  const lastLogin = () => (
    <div className="lastLogin">
      <FaRegClock className="clockIcontab" />
      {formattedLastLogin}
    </div>
  );
  return (
    <>
      <div className="px-3 mt-3">
        {loading ? (
          <ThreeLoader />
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
                      key={project._id}
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
            </div>
            <div>
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
                  {selectedRowId && renderButtons()}
                  {lastLogin()}

                  <DataTable
                    rowdata={ActiveData}
                    columns={columns}
                    label={'Task Is Not Avalible'}
                    extracss={'tableGrid actionCenter'}
                  />
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Parked Task"
                  title={<span class="position-relative">Parked Task</span>}
                >
                  {selectedRowId && renderButtons()}

                  {lastLogin()}
                  <DataTable
                    rowdata={PendingData}
                    columns={columns}
                    label={'Task Is Not Avalible'}
                    extracss={'tableGrid actionCenter'}
                  />
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Completed Task"
                  title={<span class="position-relative">Completed Task</span>}
                >
                  {selectedRowId && renderButtons()}

                  {lastLogin()}
                  <DataTable
                    rowdata={CompleteData}
                    columns={columns}
                    label={'Task Is Not Avalible'}
                    extracss={'tableGrid actionCenter'}
                  />
                </Tab>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </>
  );
}
