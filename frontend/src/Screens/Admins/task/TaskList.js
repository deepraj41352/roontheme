import Box from '@mui/material/Box';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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
import { useTranslation } from 'react-i18next';

export default function TasksList() {
  const { t } = useTranslation();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const { toggleState, userInfo, projectDatatrue, languageName } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [formData, setFormData] = useState({
    projectStatus: 'active',
  });
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowStatus, setSelectedRowStatus] = useState('');

  const handleCheckboxSelection = (rowId, rowStatus) => {
    setSelectedRowId(rowId === selectedRowId ? null : rowId);
    setSelectedRowStatus(rowStatus);
  };

  const lastLoginTimestamp = userInfo.lastLogin;
  const now = new Date();
  const lastLoginDate = new Date(lastLoginTimestamp);
  const minutesAgo = Math.floor((now - lastLoginDate) / (1000 * 60));
  const hours = Math.floor(minutesAgo / 60);
  const remainingMinutes = minutesAgo % 60;
  const formattedLastLogin = ` ${t('last login')}: ${
    hours > 0 ? `${hours} ${hours === 1 ? t('hour') : t('hours')}` : ''
  }${hours > 0 && remainingMinutes > 0 ? ', ' : ''}${
    remainingMinutes > 0
      ? `${remainingMinutes} ${
          remainingMinutes === 1 ? t('minute') : t('minutes')
        }`
      : `0 ${t('minute')}`
  } ${t('ago')}`;

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
      field: 'checkbox',
      headerName: t('select'),
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <input
          className="Check_box-For-Select"
          type="checkbox"
          checked={selectedRowId === params.row._id}
          onChange={() =>
            handleCheckboxSelection(params.row._id, params.row.taskStatus)
          }
        />
      ),
    },
    {
      field: 'taskName',
      headerName: t('task'),
      width: 300,
      renderCell: (params) => (
        <Link
          className={`Link-For-ChatWindow ${theme}-textRow`}
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className={`text-start ${theme}-textRow`}>
            <div>{params.row.taskName}</div>
            <div>
              {t('task')} ID {params.row._id}
            </div>
          </div>
        </Link>
      ),
    },
    {
      field: 'userName',
      headerName: t('client'),
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Link
          className={`Link-For-ChatWindow ${theme}-textRow`}
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className={`text-start ${theme}-textRow`}>
            <div>{params.row.userName}</div>
            <div> {t('raisedBy')}</div>
          </div>
        </Link>
      ),
    },
    {
      field: 'agentName',
      headerName: t('agent'),
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Link
          className={`Link-For-ChatWindow ${theme}-textRow`}
          to={`/chatWindowScreen/${params.row._id}`}
        >
          <div className={`text-start ${theme}-textRow`}>
            <div>{params.row.agentName}</div>
            <div>{t('assignedBy')}</div>
          </div>
        </Link>
      ),
    },
    {
      field: 'taskStatus',
      headerName: t('status'),
      flex: 1.5,
      minWidth: 225,
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
                ? t('Waiting on you')
                : params.row.taskStatus === 'active'
                ? t('InProgress')
                : params.row.taskStatus === 'completed'
                ? t('completed')
                : params.row.taskStatus === 'pending'
                ? t('Ready To Completed')
                : ''}
            </div>
          </Grid>
        );
      },
    },
  ];

  const [ProjectData, setProjectData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Active Task');
  console.log('objectlanguageName', languageName);
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
    setSelectedProjects(`${t('all')} ${t('project')}`);
  }, [languageName]);

  useEffect(() => {
    setLoading(true);
    const FatchTaskData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        SetData(data);
      } catch (error) {
        setError(t('An Error Ocurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchTaskData();
  }, [success, projectDatatrue]);

  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProjectData(data);
      } catch (error) {
        setError(t('An Error Ocurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [success, projectDatatrue]);

  const taskData = data.filter((item) => {
    if (selectedProjects === `${t('all')} ${t('project')}`) {
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
        toast.success(`${t('task')} ${t('delete successfully')}`);
      }
    } catch (error) {
      toast.error(`${t('failedDelete')} ${t('task')}`);
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
    setIsSubmiting(true);
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

        toast.success(
          `${t('task')} ${t('status')} ${t('update successfully')}`
        );
      }
    } catch (err) {
      toast.error(`${t('failedUpdate')} ${t('task')} ${t('status')}`);
    } finally {
      setIsSubmiting(false);
    }
  };

  const renderButtons = () => (
    <div className="mt-3 taskBtnContiner">
      <Button
        variant="outlined"
        onClick={ModelOpen}
        className="modaleButton btn-color1"
      >
        {t('status update')}
      </Button>
      <Button
        variant="outlined"
        className="ms-2 modaleButton btn-color2"
        onClick={ModelOpenDel}
        disabled={isSubmiting}
      >
        {t('delete')}
      </Button>
    </div>
  );
  const lastLogin = () => (
    <div className="lastLogin mainWidthtbl">
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
            <ul className="nav-style1">
              <li>
                <Link to="/admin/task-screen">
                  <a className="active">{t('tasks')}</a>
                </Link>
              </li>
              <li>
                <Link to="/admin/task/create-screen">
                  <a>{t('create')}</a>
                </Link>
              </li>
            </ul>
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
                    onClick={() =>
                      handleProjectsSelect('', `${t('all')} ${t('project')}`)
                    }
                  >
                    {`${t('all')} ${t('project')}`}
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
              <Dropdown className={`mb-0 dropTab1 mainWidthtbl tab-btn`}>
                <Dropdown.Toggle variant="secondary" id="dropdown-tabs">
                  {selectedTab}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropMenu">
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Active Task')}
                  >
                    <span class="position-relative">
                      {t('active')} {t('task')}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Parked Task')}
                  >
                    <span class="position-relative">
                      {t('parked')} {t('task')}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    active
                    className="dropMenuCon"
                    onClick={() => handleTabSelect('Completed Task')}
                  >
                    <span class="position-relative">
                      {t('completed')} {t('task')}
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Tabs
                activeKey={selectedTab}
                onSelect={(tab) => handleTabSelect(tab)}
                id="uncontrolled-tab-example"
                className={`mb-0 tab-btn tabBack dropTab mainWidthtbl`}
              >
                <Tab
                  className="tab-color"
                  eventKey="Active Task"
                  title={
                    <span className="position-relative">
                      {t('active')} {t('task')}
                    </span>
                  }
                >
                  {selectedRowId && renderButtons()}
                  <Modal
                    open={showModalDel}
                    onClose={handleCloseRow}
                    className="overlayLoading modaleWidth p-0"
                  >
                    <Box
                      className="modelBg modelminWidth"
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
                      <div className="overlayLoading p-2">
                        <div className="pb-4">{t('taskDelete')}</div>
                        <Button
                          variant="outlined"
                          onClick={deleteTask}
                          className="globalbtnColor modaleButton"
                          disabled={isSubmiting}
                        >
                          {t('confirm')}
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={handleCloseRow}
                          className="ms-2 globalbtnColor modaleButton"
                          disabled={isSubmiting}
                        >
                          {t('cancel')}
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
                      className="modelBg modelminWidth"
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
                      <div className="overlayLoading">
                        <Form className="p-2">
                          <FormControl className="mb-3 w-100">
                            <InputLabel
                              id="taskStatusLabel"
                              className="mb-1 fw-bold"
                            >
                              {t('task')} {t('status')}
                            </InputLabel>
                            <Select
                              labelId="taskStatusLabel"
                              name="projectStatus"
                              value={
                                formData.projectStatus ||
                                selectedRowStatus === 'waiting'
                                  ? formData.projectStatus
                                  : selectedRowStatus
                              }
                              onChange={handleStatusUpdate}
                            >
                              <MenuItem className="selecftStyle" value="active">
                                {t('running')}
                              </MenuItem>
                              <MenuItem
                                className="selecftStyle"
                                value="pending"
                              >
                                {t('pending')}
                              </MenuItem>
                              <MenuItem
                                className="selecftStyle"
                                value="completed"
                              >
                                {t('completed')}
                              </MenuItem>
                            </Select>
                          </FormControl>

                          <Button
                            variant="outlined"
                            onClick={handleFormSubmit}
                            className="globalbtnColor modaleButton"
                            disabled={isSubmiting}
                          >
                            {t('confirm')}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleCloseRow}
                            className="ms-2 globalbtnColor modaleButton"
                            disabled={isSubmiting}
                          >
                            {t('cancel')}
                          </Button>
                        </Form>
                      </div>
                    </Box>
                  </Modal>

                  {lastLogin()}

                  <DataTable
                    rowdata={ActiveData}
                    columns={columns}
                    label={`${t('task')} ${t('Is Not Available')}`}
                    extracss={'tableGrid actionCenter'}
                  />
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Parked Task"
                  title={
                    <span className="position-relative">
                      {t('parked')} {t('task')}
                    </span>
                  }
                >
                  {selectedRowId && renderButtons()}
                  {lastLogin()}
                  <DataTable
                    rowdata={PendingData}
                    columns={columns}
                    label={`${t('task')} ${t('Is Not Available')}`}
                    extracss={'tableGrid actionCenter'}
                  />
                </Tab>
                <Tab
                  className="tab-color"
                  eventKey="Completed Task"
                  title={
                    <span className="position-relative">
                      {t('completed')} {t('task')}
                    </span>
                  }
                >
                  {selectedRowId && renderButtons()}
                  {lastLogin()}
                  <DataTable
                    rowdata={CompleteData}
                    columns={columns}
                    label={`${t('task')} ${t('Is Not Available')}`}
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
