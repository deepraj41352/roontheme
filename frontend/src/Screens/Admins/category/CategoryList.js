import { Avatar, Grid } from '@mui/material';
import { Store } from '../../../Store';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImage from '../../../Components/Avatar';
import { confirmAlert } from 'react-confirm-alert';
import ThreeLoader from '../../../Util/threeLoader';
import DataTable from '../../../Components/DataTable';

export default function CategoryList() {
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (rowId) => {
    navigate(`/category/${rowId}`);
  };

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const FatchcategoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/category/`);
        const datas = response.data;
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            categoryName: items.categoryName,
            categoryDescription:
              items.categoryDescription == ''
                ? 'No description'
                : items.categoryDescription,
            categoryImage: items.categoryImage,
            categoryStatus:
              items.categoryStatus == true ? 'Active' : 'Inactive',
          };
        });
        console.log('rowData', rowData);
        setCategoryData(rowData);
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setLoading(false);
      }
    };
    FatchcategoryData();
  }, [updateData, loading]);

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
      const response = await axios.delete(`/api/category/${userid}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (response.status === 200) {
        toast.success('Category Deleted Successfully!');
        setUpdateData(!updateData);
      } else {
        toast.error('Failed To Delete Category.');
      }
    } catch (error) {
      toast.error('An Error Occurred While Deleting Category.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      minWidth: 100,
      flex: 0.5,
      className: 'boldHeader',

      renderCell: (params) => {
        function generateColorFromAscii(str) {
          let color = '#';
          const combination = str
            .split('')
            .map((char) => char.charCodeAt(0))
            .reduce((acc, value) => acc + value, 0);
          color += (combination * 12345).toString(16).slice(0, 6);
          return color;
        }

        const name = params.row.categoryName[0].toLowerCase();
        const color = generateColorFromAscii(name);
        return (
          <>
            {params.row.categoryImage ? (
              <Avatar src={params.row.categoryImage} />
            ) : (
              <AvatarImage name={params.row.categoryName} bgColor={color} />
            )}
          </>
        );
      },
    },

    {
      field: 'categoryName',
      headerName: 'Category',
      minWidth: 100,
      flex: 1,
      className: 'boldHeader',
    },
    {
      field: 'categoryDescription',
      headerName: 'Description',
      minWidth: 150,
      flex: 1,
      headerClassName: 'bold-header',
    },
    {
      field: '_id',
      headerName: 'ID',
      minWidth: 250,
      flex: 1,
      headerClassName: 'bold-header',
    },
    {
      field: 'categoryStatus',
      headerName: 'Status',
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        const isInactive = params.row.categoryStatus === 'Inactive';
        const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';

        return (
          <div className={`status-cell ${cellClassName}`}>
            {params.row.categoryStatus}
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
              <Link to="/category-screen">
                <a className="active">Categories</a>
              </Link>
            </li>
            <li>
              <Link to="/category/create-screen">
                <a>Create</a>
              </Link>
            </li>
          </ul>
          <DataTable
            rowdata={categoryData}
            columns={columns}
            label={'Category Data Is Not Avalible'}
          />
        </>
      )}
    </>
  );
}
