import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext } from 'react';
import { Store } from '../Store';

export default function DataTable({
  rowdata,
  columns,
  label,
  extracss,
  customRowRenderer,
}) {
  const { state } = useContext(Store);
  const { toggleState, sidebar } = state;
  const theme = toggleState ? 'dark' : 'light';
  return (
    <div className={!sidebar ? 'w-100' : 'maxAllTable'}>
      <Box sx={{ height: 400, width: '95%', margin: '0 auto' }}>
        <DataGrid
          className={`tableBg ${extracss} projectTable ${theme}DataGrid`}
          rows={rowdata}
          columns={columns}
          getRowId={(row) => row._id}
          getRowClassName={customRowRenderer}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          localeText={{
            noRowsLabel: label,
          }}
        />
      </Box>
    </div>
  );
}
