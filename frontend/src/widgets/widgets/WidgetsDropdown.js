import React, { useState, useEffect, useContext } from 'react';
import {
  CCard,
  CRow,
  CCol,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CCardHeader,
  CCardBody,
  CTable,
  CWidgetStatsA,
  CTableBody,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import axios from 'axios';
import { Store } from '../../Store';
import { CChartDoughnut } from '@coreui/react-chartjs';
import UserDataWidget from './UserDataWidget';
import ProjectDataWidget from './ProjectDataWidget';
import { ThreeDots } from 'react-loader-spinner';

const WidgetsDropdown = React.memo(() => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [admin, setAdmin] = useState([]);
  const [adminDates, setAdminDates] = useState([]);
  const [contractor, setContractor] = useState([]);
  const [agent, setAgent] = useState([]);

  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [activeProject, setActiveProject] = useState([]);
  const [quedProject, setQuedProject] = useState([]);
  const [completedProject, setCompletedProject] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fatchUserData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user/`);
        console.log('userData', data);
        setUserData(data);
        const adminData = data.filter((el) => el.role == 'admin');
        const dates = adminData.map((user) => user.createdAt);
        setAdminDates(dates);
        const contractorData = data.filter((el) => el.role == 'contractor');
        const agentData = data.filter((el) => el.role == 'agent');
        setAdmin(adminData);
        setContractor(contractorData);
        setAgent(agentData);
        const { data: taskDatas } = await axios.get('/api/task/tasks', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        let projectData;

        if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
          projectData = taskDatas;
        } else {
          projectData = taskDatas.filter((item) => {
            return item.userId === userInfo._id;
          });
        }
        const activeProject = projectData.filter(
          (el) => el.taskStatus == 'waiting' || el.taskStatus == 'active'
        );
        const quedProject = projectData.filter(
          (el) => el.taskStatus == 'pending'
        );
        const completedProject = projectData.filter(
          (el) => el.taskStatus == 'completed'
        );
        setActiveProject(activeProject);
        setQuedProject(quedProject);
        setCompletedProject(completedProject);
        setProjectData(projectData);
        setLoading(false);
      } catch (error) {
        console.log(error);

        setLoading(false);
      }
    };
    fatchUserData();
  }, []);

  const dataChartDoughnut = {
    labels: ['Active', 'Parked', 'Completed'],
    datasets: [
      {
        data: [
          activeProject.length,
          quedProject.length,
          completedProject.length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <>
      {loading ? (
        <>
          <div className="ThreeDot">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              className="ThreeDot justi`fy-content-center"
              color="#0e0e3d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        </>
      ) : (
        <>
          <CRow>
            {userInfo.role == 'superadmin' && (
              <CCol sm={6} lg={3}>
                <CWidgetStatsA
                  className="mb-4"
                  color="primary"
                  value={
                    <>
                      {admin.length <= 0 ? `0` : admin.length}
                      {/* <span className="fs-6 fw-normal">
               (-12.4% <CIcon icon={cilArrowBottom} />)
             </span> */}
                    </>
                  }
                  title="Total Admin"
                  chart={
                    <CChartLine
                      className="mt-3 mx-3"
                      style={{ height: '70px' }}
                      data={{
                        labels: adminDates.map((date) =>
                          new Date(date).toLocaleDateString()
                        ),
                        datasets: [
                          {
                            label: 'Registered On',
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(255,255,255,.55)',
                            pointBackgroundColor: getStyle('--cui-primary'),
                            data: ['18', '59', '84', '84', '51', '55', '40'],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            grid: {
                              display: false,
                              drawBorder: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                          y: {
                            min: 10,
                            max: 89,
                            display: false,
                            grid: {
                              display: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                        },
                        elements: {
                          line: {
                            borderWidth: 1,
                            tension: 0.4,
                          },
                          point: {
                            radius: 4,
                            hitRadius: 10,
                            hoverRadius: 4,
                          },
                        },
                      }}
                    />
                  }
                />
              </CCol>
            )}
            <CCol sm={6} lg={userInfo.role == 'superadmin' ? 3 : 4}>
              <CWidgetStatsA
                className="mb-4"
                color="info"
                value={<>{contractor.length <= 0 ? `0` : contractor.length}</>}
                title="Total Contractor"
                chart={
                  <CChartLine
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} lg={userInfo.role == 'superadmin' ? 3 : 4}>
              <CWidgetStatsA
                className="mb-4"
                color="warning"
                value={<>{agent.length <= 0 ? `0` : agent.length}</>}
                title="Total Agent"
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} lg={userInfo.role == 'superadmin' ? 3 : 4}>
              <CWidgetStatsA
                className="mb-4"
                color="danger"
                value={
                  <>{projectData.length <= 0 ? `0` : projectData.length}</>
                }
                title="Total Tasks"
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [
                            78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34,
                            84, 67, 82,
                          ],
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol sm={4} lg={4}>
              <CCard className="mh-100 mb-4">
                <CCardHeader className="alignLeft">
                  <b>Tasks</b>
                </CCardHeader>
                <CChartDoughnut data={dataChartDoughnut} />
              </CCard>
            </CCol>
            <CCol sm={8} lg={8}>
              <CCard className="mh-100 mb-4">
                <CCardHeader className="alignLeft">
                  <b>Tasks</b>
                </CCardHeader>
                <CCardBody>
                  <ProjectDataWidget projectData={projectData} />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12} lg={12}>
              <CCard className="mh-100">
                <CCardHeader className="alignLeft">
                  <b>Users</b>
                </CCardHeader>
                <CCardBody>
                  <UserDataWidget userData={userData} />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
});

export default WidgetsDropdown;
