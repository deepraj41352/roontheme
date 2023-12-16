import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';
import DataTable from '../../../Components/DataTable';

export default function ContractorProjectList() {
  const navigate = useNavigate();
  const [ContractorData, setContractorData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoding] = useState(false);
  const [error, setError] = useState('');
  const [taskData, SetTaskData] = useState([]);
  const { state } = useContext(Store);
  const { userInfo, projectDatatrue } = state;

  const columns = [
    {
      field: 'projectName',
      headerName: 'Project',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'NumberTasks',
      headerName: 'Number of Tasks',
      minWidth: 150,
      flex: 1,
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
      headerName: 'Client',
      minWidth: 150,
      flex: 1,
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
      minWidth: 220,
      flex: 1,
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
      minWidth: 250,
      flex: 1,
    },
  ];

  useEffect(() => {
    setLoding(true);
    const fetchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
        setContractorData(data);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoding(false);
      }
    };
    fetchContractorData();
  }, []);

  useEffect(() => {
    setLoding(true);
    const FatchcategoryData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        SetTaskData(data);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoding(false);
      }
    };

    FatchcategoryData();
  }, [projectDatatrue]);

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
        setError('An Error Occurred');
      } finally {
        setLoding(false);
      }
    };
    FatchProject();
  }, [projectDatatrue]);

  return (
    <>
      {loading ? (
        <ThreeLoader />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <DataTable
            rowdata={projectData}
            columns={columns}
            label={'Task Is Not Avalible'}
          />
        </>
      )}
    </>
  );
}
