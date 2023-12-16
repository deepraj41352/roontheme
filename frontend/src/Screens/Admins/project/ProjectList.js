import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';
import DataTable from '../../../Components/DataTable';

export default function ProjectList() {
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
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'NumberTasks',
      headerName: 'Number of Tasks',
      minWidth: 100,
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
      minWidth: 100,
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
      flex: 1,
      minWidth: 220,
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
        setError('An Error Ocurred');
      } finally {
        setLoding(false);
      }
    };
    fetchContractorData();
  }, [projectDatatrue]);

  useEffect(() => {
    setLoding(true);
    const FatchcategoryData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        SetTaskData(data);
      } catch (error) {
        setError('An Error Ocurred');
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
        setProjectData(data);
      } catch (error) {
        setError('An Error Ocurred');
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
            label={'Project Is Not Avalible'}
          />
        </>
      )}
    </>
  );
}
