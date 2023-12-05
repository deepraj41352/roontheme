// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';
// import { Avatar, Grid } from '@mui/material';
// import { Store } from '../../../Store';
// import { useContext, useEffect, useReducer, useState } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import AvatarImage from '../../../Components/Avatar';
// import { ColorRing } from 'react-loader-spinner';
// import { ThreeDots } from 'react-loader-spinner';
// import { confirmAlert } from 'react-confirm-alert';
// import FormSubmitLoader from '../../../Util/formSubmitLoader';
// import ThreeLoader from '../../../Util/threeLoader';

// const columns = [
//   {
//     width: 100,
//     className: 'boldHeader',

//     renderCell: (params) => {
//       function generateColorFromAscii(str) {
//         let color = '#';
//         const combination = str
//           .split('')
//           .map((char) => char.charCodeAt(0))
//           .reduce((acc, value) => acc + value, 0);
//         color += (combination * 12345).toString(16).slice(0, 6);
//         return color;
//       }

//       const name = params.row.categoryName[0].toLowerCase();
//       const color = generateColorFromAscii(name);
//       return (
//         <>
//           {params.row.categoryImage !== 'null' ? (
//             <Avatar src={params.row.categoryImage} />
//           ) : (
//             <AvatarImage name={name} bgColor={color} />
//           )}
//         </>
//       );
//     },
//   },

//   {
//     field: 'categoryName',
//     headerName: 'Category',
//     width: 100,
//     className: 'boldHeader',
//   },
//   {
//     field: 'categoryDescription',
//     headerName: 'Description',
//     width: 150,
//     headerClassName: 'bold-header',
//   },
//   {
//     field: '_id',
//     headerName: 'ID',
//     width: 250,
//     headerClassName: 'bold-header',
//   },
// ];

// const getRowId = (row) => row._id;

// export default function CategoryList() {
//   const navigate = useNavigate();
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [updateData, setUpdateData] = useState(true);
//   const [categoryData, setCategoryData] = useState([]);
//   const [loading, setLoding] = useState(false);
//   const [error, setError] = useState('');

//   const handleEdit = (rowId) => {
//     navigate(`/category/${rowId}`);
//   };

//   const { state } = useContext(Store);
//   const { toggleState, userInfo } = state;
//   const theme = toggleState ? 'dark' : 'light';

//   useEffect(() => {
//     const FatchcategoryData = async () => {
//       setLoding(true);
//       try {
//         const response = await axios.get(`/api/category/`);
//         const datas = response.data;
//         console.log('datas', datas);
//         const rowData = datas.map((items) => {
//           return {
//             ...items,
//             _id: items._id,
//             categoryName: items.categoryName,
//             categoryDescription:
//               items.categoryDescription == ''
//                 ? 'No description'
//                 : items.categoryDescription,
//             categoryImage: items.categoryImage,
//             categoryStatus:
//               items.categoryStatus == true ? 'Active' : 'Inactive',
//           };
//         });
//         console.log('rowData', rowData);
//         setCategoryData(rowData);
//       } catch (error) {
//         setError(error);
//         console.log(error);
//       } finally {
//         setLoding(false);
//       }
//     };
//     FatchcategoryData();
//   }, [updateData, isDeleting]);

//   const confirmDelete = (Id) => {
//     confirmAlert({
//       title: 'Confirm to delete',
//       message: 'Are you sure to delete this?',
//       buttons: [
//         {
//           label: 'Yes',
//           onClick: () => deleteHandle(Id),
//         },
//         {
//           label: 'No',
//         },
//       ],
//     });
//   };

//   const deleteHandle = async (userid) => {
//     setIsDeleting(true);
//     try {
//       const response = await axios.delete(`/api/category/${userid}`, {
//         headers: { Authorization: `Bearer ${userInfo.token}` },
//       });

//       if (response.status === 200) {
//         toast.success('Category Deleted Successfully!');
//         setUpdateData(!updateData);
//       } else {
//         toast.error('Failed To Delete Category.');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('An Error Occurred While Deleting Category.');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <>
//           <ThreeLoader />
//         </>
//       ) : error ? (
//         <div>{error}</div>
//       ) : (
//         <>
//           <ul className="nav-style1">
//             <li>
//               <Link to="/category">
//                 <a className="active">Categories</a>
//               </Link>
//             </li>
//             <li>
//               <Link to="/category/create">
//                 <a>Create</a>
//               </Link>
//             </li>
//           </ul>
//           {isDeleting && <FormSubmitLoader />}
//           <div className="overlayLoading">
//             <Box sx={{ width: '100%', height: '400px' }}>
//               <DataGrid
//                 className={
//                   theme == 'light'
//                     ? `${theme}DataGrid mx-2 tableContainer`
//                     : `tableContainer ${theme}DataGrid mx-2`
//                 }
//                 rows={categoryData}
//                 columns={[
//                   ...columns,
//                   {
//                     field: 'categoryStatus',
//                     headerName: 'Status',
//                     width: 100,
//                     renderCell: (params) => {
//                       const isInactive =
//                         params.row.categoryStatus === 'Inactive';
//                       const cellClassName = isInactive
//                         ? 'inactive-cell'
//                         : 'active-cell';

//                       return (
//                         <div className={`status-cell ${cellClassName}`}>
//                           {params.row.categoryStatus}
//                         </div>
//                       );
//                     },
//                   },
//                   {
//                     field: 'action',
//                     headerName: 'Action',
//                     width: 250,
//                     renderCell: (params) => {
//                       return (
//                         <Grid item xs={8}>
//                           <button
//                             variant="contained"
//                             className="mx-2 edit-btn"
//                             onClick={() => handleEdit(params.row._id)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             variant="outlined"
//                             className="mx-2 delete-btn global-font"
//                             onClick={() => confirmDelete(params.row._id)}
//                           >
//                             Delete
//                           </button>
//                         </Grid>
//                       );
//                     },
//                   },
//                 ]}
//                 getRowId={getRowId}
//                 initialState={{
//                   pagination: {
//                     paginationModel: {
//                       pageSize: 5,
//                     },
//                   },
//                 }}
//                 pageSizeOptions={[5]}
//                 disableRowSelectionOnClick
//                 localeText={{ noRowsLabel: 'Category Data Is Not Avalible' }}
//               />
//             </Box>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
