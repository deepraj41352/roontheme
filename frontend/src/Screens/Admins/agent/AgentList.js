import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';
import DataTable from '../../../Components/DataTable';

export default function AgentList() {
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateData, setUpdateData] = useState(true);

  const handleEdit = (rowId) => {
    navigate(`/agent/${rowId}`);
  };

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const FatchCategory = async () => {
      try {
        const { data } = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategoryData(data);
      } catch (error) {
        setError('An Error Occured');
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    const FatchAgentData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };
    FatchAgentData();
  }, [categoryData, updateData]);

  const confirmDelete = (Id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to delete this?',
      buttons: [
        {
          className: 'globalbtnColor',
          label: 'Yes',
          onClick: () => deleteHandle(Id),
        },
        {
          className: 'globalbtnColor',
          label: 'No',
        },
      ],
    });
  };

  const deleteHandle = async (userid) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/user/${userid}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (response.status === 200) {
        toast.success('Agent Deleted Successfully!');
        setUpdateData(!updateData);
      } else {
        toast.error('Failed To Delete Agent.');
      }
    } catch (error) {
      toast.error('An Error Occurred While Deleting Agent.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'first_name',
      headerName: 'Name',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'agentCategory',
      headerName: 'Category',
      minWidth: 110,
      flex: 1,
      renderCell: (params) => {
        const categoryNames = params.row.agentCategory.map(
          (categoryId) =>
            categoryData.find((cat) => cat._id === categoryId)?.categoryName ||
            'N/A'
        );

        return (
          <span className="ms-2 spanForCate" data-tooltip2={categoryNames}>
            {categoryNames.join(', ')}
          </span>
        );
      },
    },
    { field: '_id', headerName: 'ID', minWidth: 200 },
    {
      field: 'userStatus',
      headerName: 'Status',
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        const userStatusData =
          params.row.userStatus == true ? 'Active' : 'Inactive';
        const isInactive = userStatusData === 'Inactive';
        const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';
        return (
          <div className={`status-cell ${cellClassName}`}>{userStatusData}</div>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 280,
      flex: 1,
      renderCell: (params) => {
        return (
          <Grid item xs={8}>
            <button
              variant="contained"
              className="mx-2 edit-btn"
              onClick={() => handleEdit(params.row._id)}
            >
              Edit
            </button>
            <button
              variant="outlined"
              className="mx-2 delete-btn global-font"
              onClick={() => confirmDelete(params.row._id)}
            >
              Delete
            </button>
          </Grid>
        );
      },
    },
  ];
  const customRowRenderer = (params) => {
    const isSpecialRow = params.row;
    return isSpecialRow ? 'special-row-class' : '';
  };
  return (
    <>
      {loading ? (
        <ThreeLoader />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <ul className="nav-style1">
            <li>
              <Link to="/agent-screen">
                <a className="active">Agent</a>
              </Link>
            </li>
            <li>
              <Link to="/agent/create-screen">
                <a>Create</a>
              </Link>
            </li>
          </ul>
          <div className="overlayLoading">
            <DataTable
              rowdata={agentData}
              columns={columns}
              label={'Agent Data Is Not Avalible'}
              customRowRenderer={customRowRenderer}
            />
          </div>
        </>
      )}
    </>
  );
}
