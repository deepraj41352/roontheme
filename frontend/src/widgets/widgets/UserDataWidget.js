import { useContext } from 'react';
import DataTable from '../../Components/DataTable';
import { Store } from '../../Store';

const columns = [
  {
    field: 'first_name',
    headerName: 'First Name',
    minWidth: 120,
    flex: 1,
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
    minWidth: 120,
    flex: 1,
    renderCell: (params) =>
      params.row.last_name ? params.row.last_name : 'NA',
  },
  {
    field: 'email',
    headerName: 'Email',
    minWidth: 130,
    flex: 1,
  },
  {
    field: 'role',
    headerName: 'Role',
    minWidth: 150,
    flex: 1,
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
    minWidth: 220,
    flex: 1,
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
    minWidth: 200,
    flex: 1,
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
    minWidth: 200,
    flex: 1,
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
  const { sidebar } = state;
  return (
    <>
      <div className={!sidebar ? 'w-100' : 'maxClassTable'}>
        <DataTable
          rowdata={props.userData}
          columns={columns}
          label={'User Not Avalible'}
          extracss={'tableGrid actionCenter'}
        />
      </div>
    </>
  );
}
