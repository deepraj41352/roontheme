import { Grid } from '@mui/material';
import { IoSettings } from 'react-icons/io5';
import { Dropdown } from 'react-bootstrap';
import { Store } from '../../Store';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AvatarImage from '../../Components/Avatar';
import axios from 'axios';
import DataTable from '../../Components/DataTable';
import ThreeLoader from '../../Util/threeLoader';

export default function ProjectDataWidget() {
  const { state } = useContext(Store);
  const {
    toggleState,
    userInfo,
    contractorSuccesstrue,
    projectDatatrue,
    sidebar,
  } = state;
  const theme = toggleState ? 'dark' : 'light';

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
              className="Link-For-ChatWindow"
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
      headerName: 'Task Name',
      minWidth: 150,
      flex: 1,
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
      minWidth: 150,
      flex: 1,
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
      minWidth: 150,
      flex: 1,
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
      minWidth: 250,
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

  const [categoryData, setCategoryData] = useState([]);
  const [ProjectData, setProjectData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Active Task');
  const [data, SetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

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
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };

    FatchcategoryData();
  }, [contractorSuccesstrue, projectDatatrue]);

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
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };
    FatchCategory();
  }, [contractorSuccesstrue, projectDatatrue]);

  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        let ContractorProject;

        if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
          ContractorProject = data;
        } else {
          ContractorProject = data.filter((item) => {
            return item.userId === userInfo._id;
          });
        }
        setProjectData(ContractorProject);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [contractorSuccesstrue, projectDatatrue]);

  let ContractorTask;

  if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
    ContractorTask = data;
  } else {
    ContractorTask = data.filter((item) => {
      return item.userId === userInfo._id;
    });
  }

  const ActiveData = data.filter((item) => {
    return item.taskStatus === 'active' || item.taskStatus === 'waiting';
  });
  const CompleteData = data.filter((item) => {
    return item.taskStatus === 'completed';
  });
  const PendingData = data.filter((item) => {
    return item.taskStatus === 'pending';
  });

  return (
    <>
      <div className="px-3">
        {loading ? (
          <ThreeLoader />
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <div className=" m-0 p-0">
              <div className={!sidebar ? 'w-100' : 'maxClassTable'}>
                <Dropdown className={`mb-0 dropTab2 tab-btn mainWidthtbl`}>
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
                  className={`mb-0 tab-btn tabBack dropTab3 mainWidthtbl `}
                >
                  <Tab
                    className="tab-color"
                    eventKey="Active Task"
                    title={<span class="position-relative">Active Task</span>}
                  >
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
                    {/* <div className={!sidebar ? 'w-100' : 'maxClassTable'}> */}
                    <DataTable
                      rowdata={PendingData}
                      columns={columns}
                      label={'Task Is Not Avalible'}
                      extracss={'tableGrid actionCenter'}
                    />
                    {/* </div> */}
                  </Tab>
                  <Tab
                    className="tab-color"
                    eventKey="Completed Task"
                    title={
                      <span class="position-relative">Completed Task</span>
                    }
                  >
                    {/* <div className={!sidebar ? 'w-100' : 'maxClassTable'}> */}
                    <DataTable
                      rowdata={CompleteData}
                      columns={columns}
                      label={'Task Is Not Avalible'}
                      extracss={'tableGrid actionCenter'}
                    />

                    {/* </div> */}
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
