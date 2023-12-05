import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';

export default function ContractorProjectList() {
    const navigate = useNavigate();
    const [ContractorData, setContractorData] = useState([]);
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoding] = useState(false);
    const [error, setError] = useState('');
    const [taskData, SetTaskData] = useState([]);
    const { state } = useContext(Store);
    const { toggleState, userInfo, projectDatatrue } = state;
    const theme = toggleState ? 'dark' : 'light';

    const columns = [
        {
            field: 'projectName',
            headerName: 'Project Name',
            width: 150,
        },
        {
            field: 'NumberTasks',
            headerName: 'Number of Tasks',
            width: 150,
            renderCell: (params) => {
                const tasks = taskData.filter((item) => {
                    return item.projectId === params.row._id;
                });
                const numberOfTasks = tasks.length;

                return <div>{numberOfTasks}</div>;
            },
        },
        {
            field: 'userId',
            headerName: 'Contractor',
            width: 150,
            renderCell: (params) => {
                const contractor = ContractorData.find(
                    (item) => item._id === params.row.userId
                );

                return <div>{contractor ? contractor.first_name : ''}</div>;
            },
        },
        {
            field: 'createdAt',
            headerName: 'Project Create Date',
            width: 200,
            renderCell: (params) => {
                const combinedDateTime = new Date(params.row.createdAt);
                const date = combinedDateTime.toISOString().split('T')[0];
                const time = combinedDateTime.toTimeString().split(' ')[0];

                return (
                    <div className="text-start">
                        <div>
                            <span>Date: {date}</span>
                            <br />
                            <span>Time: {time}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            field: '_id',
            headerName: 'Project Id',
            width: 150,
        },
    ];

    const handleEdit = (rowId) => {
        navigate(`/adminEditCategory/${rowId}`);
    };

    // get contractor
    useEffect(() => {
        setLoding(true);

        const fetchContractorData = async () => {
            try {
                const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
                setContractorData(data);
            } catch (error) {
                console.error('Error fetching contractor data:', error);
            } finally {
                setLoding(false);
            }
        };
        fetchContractorData();
    }, []);

    // {Get tasks.........
    useEffect(() => {
        setLoding(true);
        const FatchcategoryData = async () => {
            try {
                const { data } = await axios.get(`/api/task/tasks`);
                SetTaskData(data);
            } catch (error) {
                toast.error(error.data?.message);
                setError(error);
            } finally {
                setLoding(false);
            }
        };

        FatchcategoryData();
    }, [projectDatatrue]);
    // ......}

    //   get project
    useEffect(() => {
        setLoding(true);
        const FatchProject = async () => {
            try {
                const { data } = await axios.get(`/api/task/project`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                const ContractorProject = data.filter((item) => {
                    return item.userId === userInfo._id;
                });
                setProjectData(ContractorProject);
            } catch (error) {
                console.log(error);
                setError(error);
            } finally {
                setLoding(false);
            }
        };
        FatchProject();
    }, [projectDatatrue]);

    return (
        <>
            {loading ? (
                <>
                    <ThreeLoader />
                </>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            className={`tableBg projectTable mx-2 ${theme}DataGrid`}
                            rows={projectData}
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
                                noRowsLabel: 'Project Is Not Avalible',
                            }}
                        />
                    </Box>
                </>
            )}
        </>
    );
}
