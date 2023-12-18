import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ThreeLoader from '../../../Util/threeLoader';
import { Store } from '../../../Store';
import { confirmAlert } from 'react-confirm-alert';
import DataTable from '../../../Components/DataTable';

export default function ContractorList() {
  const navigate = useNavigate();
  const [ContractorData, setContractorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateData, setUpdateData] = useState(true);

  const handleEdit = (rowId) => {
    navigate(`/client/${rowId}`);
  };

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const FatchContractorData = async () => {
      setLoading(true);
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
        setError('An Error Ocurred');
      } finally {
        setLoading(false);
      }
    };

    FatchContractorData();
  }, [updateData]);

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
        toast.success('Client Deleted Successfully!');
        setUpdateData(!updateData);
      } else {
        toast.error('Failed To Delete Client.');
      }
    } catch (error) {
      toast.error('An Error Occurred While Deleting Client.');
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
    { field: '_id', headerName: 'ID', width: 220 },
    {
      field: 'userStatus',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
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
              <Link to="/client-screen">
                <a className="active">Client</a>
              </Link>
            </li>
            <li>
              <Link to="/client/create-screen">
                <a>Create</a>
              </Link>
            </li>
          </ul>
          <DataTable
            rowdata={ContractorData}
            columns={columns}
            label={'Client Data Is Not Avalible'}
          />
        </>
      )}
    </>
  );
}
