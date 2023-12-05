import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
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
import { CiSettings } from 'react-icons/ci';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';
import FormSubmitLoader from '../../../Util/formSubmitLoader';

export default function AgentTasksList() {
    const [isModelOpen, setIsModelOpen] = useState(false);
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

    const lastLoginTimestamp = userInfo.lastLogin;
    const now = new Date();
    const lastLoginDate = new Date(lastLoginTimestamp);
    const minutesAgo = Math.floor((now - lastLoginDate) / (1000 * 60));
    const hours = Math.floor(minutesAgo / 60);
    const remainingMinutes = minutesAgo % 60;
    const formattedLastLogin = `Last Login: ${hours > 0 ? `${hours} ${hours === 1 ? 'Hour' : 'Hours'}` : ''
        }${hours > 0 && remainingMinutes > 0 ? ', ' : ''}${remainingMinutes > 0
            ? `${remainingMinutes} ${remainingMinutes === 1 ? 'Minute' : 'Minutes'}`
            : ''
        } ago`;

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
                            <AvatarImage name={name} bgColor={color} />
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

    console.log('selectedRowId', selectedRowId);
    const [ProjectData, setProjectData] = useState([]);
    const [projectStatus, setProjectStatus] = useState('active');
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Active Task');
    const [selectedProjects, setSelectedProjects] = useState('All Project');
    const [selectedProjectsId, setSelectedProjectsId] = useState();
    const [success, setSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalDel, setShowModalDel] = useState(false);
    const [error, setError] = useState('')
    const [data, SetData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // {Get Project .........
    useEffect(() => {
        setLoading(true);
        const FatchProject = async () => {
            try {
                const { data } = await axios.get(`/api/task/project`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                const AgentProject = data.filter((item) => {
                    return item.userId === userInfo._id;
                });
                setProjectData(AgentProject);
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

    return (
        <>
            <div className="px-3 mt-3">
                {loading ? (
                    <>
                        <ThreeLoader />
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
                        </div>
                        <div>
                            {isDeleting && (
                                <div className="overlayLoadingItem1">
                                    <FormSubmitLoader />
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
                                            className={`tableGrid actionCenter tableBg projectTable  ${theme}DataGrid`}
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
                    </>
                )}
            </div>
        </>
    );
}
