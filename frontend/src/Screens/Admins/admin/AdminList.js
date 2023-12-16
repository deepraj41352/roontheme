import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ThreeLoader from '../../../Util/threeLoader';
import { Store } from '../../../Store';
import { confirmAlert } from 'react-confirm-alert';
import DataTable from '../../../Components/DataTable';

export default function AdminList() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (rowId) => {
    navigate(`/admin/${rowId}`);
  };

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const FatchAdminData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'admin' });
        const rowData = data.map((items) => {
          return {
            ...items,
            _id: items._id,
            first_name: items.first_name,
            email: items.email,
            userStatus: items.userStatus == true ? 'Active' : 'Inactive',
          };
        });
        setAdminData(rowData);
      } catch (error) {
        setError('An Error Ocurred');
      } finally {
        setLoading(false);
      }
    };

    FatchAdminData();
  }, []);

  const confirmDelete = (Id) => {
    const isMobile = window.innerWidth <= 300;

    const alertStyle = isMobile
      ? {
          width: '90%',
          margin: '0 auto',
        }
      : {};

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
        toast.success('Admin Deleted Successfully!');
      } else {
        toast.error('Failed To Delete Admin.');
      }
    } catch (error) {
      toast.error('An Error Occurred While Deleting Admin.');
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
    { field: '_id', headerName: 'ID', minWidth: 230 },
    {
      field: 'userStatus',
      headerName: 'Status',
      minWidth: 150,
      flex: 0.5,
      renderCell: (params) => {
        const isInactive = params.row.userStatus === 'Inactive';
        const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';

        return (
          <div className={`status-cell ${cellClassName}`}>
            {params.row.userStatus}
          </div>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 250,
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
              <Link to="/admin-screen">
                <a className="active">Admin</a>
              </Link>
            </li>
            <li>
              <Link to="/admin/create-screen">
                <a>Create</a>
              </Link>
            </li>
          </ul>

          <DataTable
            rowdata={adminData}
            columns={columns}
            label={'Admin Data Is Not Avalible'}
          />
        </>
      )}
    </>
  );
}
