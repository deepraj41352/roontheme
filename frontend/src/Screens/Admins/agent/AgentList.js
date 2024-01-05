import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Store } from '../../../Store';
import ThreeLoader from '../../../Util/threeLoader';
import DataTable from '../../../Components/DataTable';
import { useTranslation } from 'react-i18next';

export default function AgentList() {
  const { t } = useTranslation();
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
  const { userInfo, languageName } = state;

  useEffect(() => {
    const FatchCategory = async () => {
      try {
        const { data } = await axios.get(`/api/category/`, {
          headers: {
            'Accept-Language': languageName,
          },
        });
        setCategoryData(data);
      } catch (error) {
        setError(t('An Error Occurred'));
      }
    };
    FatchCategory();
  }, [languageName]);

  useEffect(() => {
    const FatchAgentData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchAgentData();
  }, [categoryData, updateData]);

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
        toast.success(`${t('agent')} ${t('delete successfully')}`);
        setUpdateData(!updateData);
      } else {
        toast.error(`${t('failedDelete')} ${t('agent')}`);
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
    {
      field: 'agentCategory',
      headerName: t('categories'),
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
      headerName: t('status'),
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        const userStatusData =
          params.row.userStatus == true ? t('active') : t('inactive');
        const isInactive = userStatusData === t('inactive');
        const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';
        return (
          <div className={`status-cell ${cellClassName}`}>{userStatusData}</div>
        );
      },
    },
    {
      field: 'action',
      headerName: t('action'),
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
                <a className="active">{t('agent')}</a>
              </Link>
            </li>
            <li>
              <Link to="/agent/create-screen">
                <a>{t('create')}</a>
              </Link>
            </li>
          </ul>
          <div className="overlayLoading">
            <DataTable
              rowdata={agentData}
              columns={columns}
              label={t('agent') + t('Is Not Available')}
              customRowRenderer={customRowRenderer}
            />
          </div>
        </>
      )}
    </>
  );
}
