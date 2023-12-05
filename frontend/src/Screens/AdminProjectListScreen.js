import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import { MdAddCircleOutline, MdPlaylistRemove } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Badge, Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateField } from '@mui/x-date-pickers/DateField';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import { MdRemoveCircleOutline } from 'react-icons/md';
import dayjs from 'dayjs';
import { ImCross } from 'react-icons/im';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminProjectListScreen() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [morefieldsModel, setMorefieldsModel] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { toggleState, userInfo, projectDatatrue } = state;
  const theme = toggleState ? 'dark' : 'light';

  const [ProjectData, setProjectData] = useState([]);
  const [data, SetData] = useState([]);
  const [contractorData, setContractorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState([]);

  console.log(ProjectData);
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
        const tasks = data.filter((item) => {
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
        const contractor = contractorData.find(
          (item) => item._id === params.row.userId
        );

        return <div>{contractor ? contractor.first_name : ''}</div>;
      },
    },
    // {
    //   field: 'agentId',
    //   headerName: 'Agent',
    //   width: 150,
    //   renderCell: (params) => {
    //     const agent = agentData.find((item) => item._id === params.row.agentId);

    //     return <div>{agent ? agent.first_name : ''}</div>;
    //   },
    // },

    {
      field: 'createdAt',
      headerName: 'Project Create Date',
      width: 200, // Adjust the width as needed
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

  // {Get  Contractor User.........
  useEffect(() => {
    setLoading(true);

    const fetchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
        setContractorData(data);
      } catch (error) {
        console.error('Error fetching contractor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorData();
  }, [projectDatatrue]);
  // {Get Agent  User.........
  useEffect(() => {
    setLoading(true);

    const fetchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        console.error('Error fetching contractor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorData();
  }, [projectDatatrue]);

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
  }, [projectDatatrue]);
  // ......}
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
  }, [projectDatatrue]);

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
        ) : (
          <>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                className={`tableBg mx-2 ${theme}DataGrid`}
                rows={ProjectData}
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
                  noRowsLabel: 'Project Is Not Avalible',
                }}
              />
            </Box>
          </>
        )}
      </div>
    </>
  );
}
