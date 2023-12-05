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
  { field: '_id', headerName: 'ID', width: 220 },
];

const getRowId = (row) => row._id;

export default function ContractorList() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [ContractorData, setContractorData] = useState([]);
  const [loading, setLoding] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (rowId) => {
    navigate(`/contractor/${rowId}`);
  };

  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';

  useEffect(() => {
    const FatchContractorData = async () => {
      setLoding(true);
      try {
        const response = await axios.post(`/api/user/`, { role: 'contractor' });
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
        setContractorData(rowData);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoding(false);
      }
    };

    FatchContractorData();
  }, [isDeleting]);

  const confirmDelete = (Id) => {
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
              <Link to="/contractor">
                <a className="active">Client</a>
              </Link>
            </li>
            <li>
              <Link to="/contractor/create">
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
                rows={ContractorData}
                columns={[
                  ...columns,
                  {
                    field: 'userStatus',
                    headerName: 'Status',
                    width: 150,
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
                    width: 300,
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
