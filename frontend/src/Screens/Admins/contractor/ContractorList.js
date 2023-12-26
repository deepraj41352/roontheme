import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ThreeLoader from '../../../Util/threeLoader';
import { Store } from '../../../Store';
import { confirmAlert } from 'react-confirm-alert';
import DataTable from '../../../Components/DataTable';
import { useTranslation } from 'react-i18next';

export default function ContractorList() {
  const { t } = useTranslation();
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
            userStatus: items.userStatus == true ? t('active') : t('inactive'),
          };
        });
        setContractorData(rowData);
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setLoading(false);
      }
    };

    FatchContractorData();
  }, [updateData]);

  const confirmDelete = (Id) => {
    confirmAlert({
      title: t('confirm to delete'),
      message: t('deleteConfirmationMessage'),
      buttons: [
        {
          className: 'globalbtnColor',
          label: t('Yes'),
          onClick: () => deleteHandle(Id),
        },
        {
          className: 'globalbtnColor',
          label: t('No'),
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
        toast.success(`${t('client')} ${t('delete successfully')}`);
        setUpdateData(!updateData);
      } else {
        toast.error(`${t('failedDelete')} ${t('client')}`);
      }
    } catch (error) {
      toast.error(t('An Error Occurred'));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'first_name',
      headerName: t('firstname'),
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      minWidth: 200,
      flex: 1,
    },
    { field: '_id', headerName: 'ID', width: 220 },
    {
      field: 'userStatus',
      headerName: t('status'),
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const isInactive = params.row.userStatus === t('inactive');
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
      headerName: t('action'),
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
              {t('edit')}
            </button>
            <button
              variant="outlined"
              className="mx-2 delete-btn global-font"
              onClick={() => confirmDelete(params.row._id)}
            >
              {t('delete')}
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
                <a className="active"> {t('client')}</a>
              </Link>
            </li>
            <li>
              <Link to="/client/create-screen">
                <a> {t('create')}</a>
              </Link>
            </li>
          </ul>
          <DataTable
            rowdata={ContractorData}
            columns={columns}
            label={t('client') + t('Is Not Available')}
          />
        </>
      )}
    </>
  );
}
