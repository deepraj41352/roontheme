import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ThreeLoader from '../../../Util/threeLoader';
import { Store } from '../../../Store';
import DataTable from '../../../Components/DataTable';
import { useTranslation } from 'react-i18next';

export default function AgentsProjectList() {
  const { t } = useTranslation();
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
      headerName: t('project'),
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'NumberTasks',
      headerName: t('Number of tasks'),
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
      headerName: t('client'),
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
      headerName: t('project create date'),
      minWidth: 220,
      flex: 1,
      renderCell: (params) => {
        const combinedDateTime = new Date(params.row.createdAt);
        const date = combinedDateTime.toISOString().split('T')[0];
        const time = combinedDateTime.toTimeString().split(' ')[0];

        return (
          <div className="text-start">
            <div>
              <span>
                {t('date')}: {date}
              </span>
              <br />
              <span>
                {t('time')}: {time}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: '_id',
      headerName: `${t('project')} Id`,
      minWidth: 220,
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
        setError(t('An Error Occurred'));
      } finally {
        setLoding(false);
      }
    };
    fetchContractorData();
  }, []);

  useEffect(() => {
    setLoding(true);
    const FatchtaskData = async () => {
      try {
        const { data } = await axios.get(`/api/task/tasks`);
        const tasks = data.filter((item) => {
          return item.agentId === userInfo._id;
        });
        SetTaskData(tasks);
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setLoding(false);
      }
    };
    FatchtaskData();
  }, [projectDatatrue]);

  useEffect(() => {
    setLoding(true);
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
        setError(t('An Error Occurred'));
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
            label={`Project ${t('Is Not Available')}`}
          />
        </>
      )}
    </>
  );
}
