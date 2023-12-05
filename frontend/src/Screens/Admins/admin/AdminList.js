import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ThreeLoader from '../../../Util/threeLoader';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import { Store } from '../../../Store';
import { confirmAlert } from 'react-confirm-alert';

const columns = [
  {
    field: 'first_name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  { field: '_id', headerName: 'ID', width: 200 },
];

const getRowId = (row) => row._id;

export default function AdminList() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoding] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (rowId) => {
    navigate(`/admin/${rowId}`);
  };

  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';

  useEffect(() => {
    const FatchAdminData = async () => {
      setLoding(true);
      try {
        const response = await axios.post(`/api/user/`, { role: 'admin' });
        const datas = response.data;
        const rowData = datas.map((items) => {
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
        setError(error);
        console.log(error);
      } finally {
        setLoding(false);
      }
    };

    FatchAdminData();
  }, [isDeleting]);

  const confirmDelete = (Id) => {
    console.log('runing');
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to delete this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteHandle(Id),
        },
        {
          label: 'No',
        },
      ],
    });
  };
  const deleteHandle = async (userid) => {
    setIsDeleting(true);
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
      console.error(error);
      toast.error('An Error Occurred While Deleting Admin.');
    } finally {
      setIsDeleting(false);
    }
  };

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
          <ul className="nav-style1">
            <li>
              <Link to="/admin">
                <a className="active">Admin</a>
              </Link>
            </li>
            <li>
              <Link to="/admin/create">
                <a>Create</a>
              </Link>
            </li>
          </ul>
          {isDeleting && <FormSubmitLoader />}

          <div className="overlayLoading">
            <Box sx={{ width: '100%', height: '400px' }}>
              <DataGrid
                className={
                  theme == 'light'
                    ? `${theme}DataGrid mx-2 tableContainer`
                    : `tableContainer ${theme}DataGrid mx-2`
                }
                rows={adminData}
                columns={[
                  ...columns,
                  {
                    field: 'userStatus',
                    headerName: 'Status',
                    width: 100,
                    renderCell: (params) => {
                      const isInactive = params.row.userStatus === 'Inactive';
                      const cellClassName = isInactive
                        ? 'inactive-cell'
                        : 'active-cell';

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
                    width: 280,
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
                ]}
                getRowId={getRowId}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                localeText={{ noRowsLabel: 'Admin Data Is Not Avalible' }}
              />
            </Box>
          </div>
        </>
      )}
    </>
  );
}
