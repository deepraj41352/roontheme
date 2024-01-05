import React, { useState, useEffect, useContext } from 'react';
import {
  CCard,
  CRow,
  CCol,
  CCardHeader,
  CCardBody,
  CWidgetStatsA,
} from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';

import axios from 'axios';
import { Store } from '../../Store';
import { CChartDoughnut } from '@coreui/react-chartjs';
import ProjectDataWidget from './ProjectDataWidget';
import ThreeLoader from '../../Util/threeLoader';
import { useTranslation } from 'react-i18next';

const WidgetsDropdown = React.memo(() => {
  const { state } = useContext(Store);
  const { userInfo, languageName } = state;
  const [projectData, setProjectData] = useState([]);
  const [activeProject, setActiveProject] = useState([]);
  const [quedProject, setQuedProject] = useState([]);
  const [completedProject, setCompletedProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fatchUserData = async () => {
      try {
        setLoading(true);
        const { data: taskDatas } = await axios.get('/api/task/tasks', {
          headers: { 'Accept-Language': languageName },
        });
        let taskData;

        if (userInfo.role === 'superadmin' || userInfo.role === 'admin') {
          taskData = taskDatas;
        } else if (userInfo.role === 'contractor') {
          taskData = taskDatas.filter((item) => {
            return item.userId === userInfo._id;
          });
        } else if (userInfo.role === 'agent') {
          taskData = taskDatas.filter((item) => {
            return item.agentId === userInfo._id;
          });
        }
        const activeProject = taskData.filter(
          (el) => el.taskStatus == 'waiting' || el.taskStatus == 'active'
        );
        const quedProject = taskData.filter((el) => el.taskStatus == 'pending');
        const completedProject = taskData.filter(
          (el) => el.taskStatus == 'completed'
        );
        setActiveProject(activeProject);
        setQuedProject(quedProject);
        setCompletedProject(completedProject);
        setProjectData(taskData);
        setLoading(false);
      } catch (error) {
        setError(`${t('An Error Ocurred')}`);
        setLoading(false);
      }
    };
    fatchUserData();
  }, [languageName]);

  const isEmpty =
    activeProject.length === 0 &&
    quedProject.length === 0 &&
    completedProject.length === 0;

  const dataChartDoughnut = {
    labels: isEmpty
      ? [`${t('task')} ${t('Is Not Available')}`]
      : [`${t('active')}`, 'Qued', `${t('completed')}`],
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
        <ThreeLoader />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <CRow>
            <CCol sm={8} lg={8} className="pb-3">
              <CRow>
                <CWidgetStatsA
                  className="mb-4"
                  color="danger"
                  value={
                    <>{projectData.length <= 0 ? `0` : projectData.length}</>
                  }
                  title={`${t('total')} ${t('tasks')}`}
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
                              78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98,
                              34, 84, 67, 82,
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
              </CRow>
              <CRow>
                <CCol className="p-0">
                  <CCard className="mh-100 mb-4 h-100 ">
                    <CCardHeader className="alignLeft">
                      <b>{t('tasks')}</b>
                    </CCardHeader>
                    <CCardBody>
                      <ProjectDataWidget projectData={projectData} />
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCol>
            <CCol sm={4} lg={4} className="pb-3">
              <CCard className="mh-100 mb-4 h-100">
                <CCardHeader className="alignLeft">
                  <b>{t('tasks')}</b>
                </CCardHeader>
                <CChartDoughnut data={dataChartDoughnut} />
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
});

export default WidgetsDropdown;
