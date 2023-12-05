import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import { Button, Grid } from '@mui/material';

import axios from 'axios';

import { Store } from '../../Store';

import { useContext, useEffect, useState } from 'react';

const columns = [
  {
    field: 'first_name',
    headerName: 'First Name',
    width: 120,
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
    width: 120,
    renderCell: (params) =>
      params.row.last_name ? params.row.last_name : 'NA',
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 130,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150,
    renderCell: (params) => {
      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
      return capitalizeFirstLetter(params.row.role);
    },
  },
  {
    field: 'createdAt',
    headerName: 'Registration',
    width: 200, // Adjust the width as needed
    renderCell: (params) => {
      const combinedDateTime = new Date(params.row.createdAt);
      const date = combinedDateTime.toISOString().split('T')[0];
      const time = combinedDateTime.toTimeString().split(' ')[0];

      return (
        <div className="text-start">
          <div>
            <span>Date: {date}</span>
            <br />
            <span>Time: {time}</span>
          </div>
        </div>
      );
    },
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    width: 200, // Adjust the width as needed
    renderCell: (params) => {
      const combinedDateTime = new Date(params.row.lastLogin);
      const date = combinedDateTime.toISOString().split('T')[0];
      const time = combinedDateTime.toTimeString().split(' ')[0];

      return (
        <div className="text-start">
          <div>
            <span>Date: {date}</span>
            <br />
            <span>Time: {time}</span>
          </div>
        </div>
      );
    },
  },
  {
    field: 'userStatus',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => {
      const isInactive = params.row.userStatus === false;
      const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';

      return (
        <div className={`status-cell ${cellClassName}`}>
          {params.row.userStatus ? 'Active' : 'Inactive'}
        </div>
      );
    },
  },
];

export default function UserDataWidget(props) {
  const { state } = useContext(Store);
  const { toggleState } = state;

  const theme = toggleState ? 'dark' : 'light';

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          className={`tableGrid actionCenter ${theme}DataGrid`}
          rows={props.userData}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
