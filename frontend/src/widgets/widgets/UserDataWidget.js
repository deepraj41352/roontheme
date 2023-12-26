import { useContext } from 'react';
import DataTable from '../../Components/DataTable';
import { Store } from '../../Store';
import { useTranslation } from 'react-i18next';

export default function UserDataWidget(props) {
  const { state } = useContext(Store);
  const { sidebar } = state;
  const { t } = useTranslation();

  const columns = [
    {
      field: 'first_name',
      headerName: t('firstname'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'last_name',
      headerName: t('lastname'),
      minWidth: 120,
      flex: 1,
      renderCell: (params) =>
        params.row.last_name ? params.row.last_name : 'NA',
    },
    {
      field: 'email',
      headerName: 'E-mail',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'role',
      headerName: t('role'),
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
      headerName: t('registration'),
      minWidth: 220,
      flex: 1,
      renderCell: (params) => {
        const combinedDateTime = new Date(params.row.createdAt);
        const date = combinedDateTime.toISOString().split('T')[0];
        const time = combinedDateTime.toTimeString().split(' ')[0];

        return (
          <div className="text-start">
            <div>
              <span>
                {t('date')}: {date}
              </span>
              <br />
              <span>
                {t('time')}: {time}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: 'lastLogin',
      headerName: t('last login'),
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const combinedDateTime = new Date(params.row.lastLogin);
        const date = combinedDateTime.toISOString().split('T')[0];
        const time = combinedDateTime.toTimeString().split(' ')[0];

        return (
          <div className="text-start">
            <div>
              <span>
                {t('date')}: {date}
              </span>
              <br />
              <span>
                {t('time')}: {time}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: 'userStatus',
      headerName: t('status'),
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const isInactive = params.row.userStatus === false;
        const cellClassName = isInactive ? 'inactive-cell' : 'active-cell';

        return (
          <div className={`status-cell ${cellClassName}`}>
            {params.row.userStatus ? t('active') : t('inactive')}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className={!sidebar ? 'w-100' : 'maxClassTable'}>
        <DataTable
          rowdata={props.userData}
          columns={columns}
          label={`${t('user')} ${t('Is Not Available')}`}
          extracss={'tableGrid actionCenter'}
        />
      </div>
    </>
  );
}
