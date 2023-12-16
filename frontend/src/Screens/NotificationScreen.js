import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Store } from '../Store';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import Accordion from 'react-bootstrap/Accordion';
import ThreeLoader from '../Util/threeLoader';
import { Card } from 'react-bootstrap';
import { CCardBody } from '@coreui/react';

export default function NotificationScreen() {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [notificationMark, setNotificationMark] = useState('');
  const [loading, setloading] = useState(true);
  const [error, setError] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const maxPageNumbers = 5;
  const reversedNotifications = [...notificationMessage].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = reversedNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(notificationMessage.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const SocketUrl = process.env.REACT_APP_SOCKETURL;
  const socket = io(SocketUrl);
  socket.on('connectionForNotify', (data) => {});

  useEffect(() => {
    const handleNotification = (notifyUser, message) => {
      if (notifyUser == userInfo._id) {
        setNotificationMessage((prevNotifications) => [
          ...prevNotifications,
          { notifyUser, message },
        ]);
      }
    };
    socket.on('notifyUserFrontend', handleNotification);
    socket.on('notifyProjectFrontend', handleNotification);

    return () => {
      socket.off('notifyUserFrontend', handleNotification);
      socket.off('notifyProjectFrontend', handleNotification);
    };
  }, []);

  useEffect(() => {
    const fetchNotificationData = async () => {
      ctxDispatch({ type: 'NOTIFICATION-NULL' });
      try {
        setloading(true);
        const response = await axios.get(`/api/notification/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const NotifyData = response.data;
        setNotificationMessage(NotifyData);
        ctxDispatch({ type: 'NOTIFICATION-NULL' });

        NotifyData.map((item) => {
          if (item.status == 'unseen')
            ctxDispatch({ type: 'NOTIFICATION', payload: { item } });
        });
      } catch (error) {
        setError('An Error Occurred');
      } finally {
        setloading(false);
      }
    };

    fetchNotificationData();
  }, [userInfo._id, notificationMark]);

  const handleUpdateStatus = async (e) => {
    setloading(true);
    try {
      const data = await axios.put(
        `/api/notification/updateStatus/${e.target.value}`,
        { status: 'unseen' },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setNotificationMark(data);
    } catch (err) {
      setError('An Error Occurred');
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      {loading ? (
        <ThreeLoader />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {currentNotifications && (
            <>
              <div className="container mt-5">
                <div className="row">
                  <div className="col p-0">
                    <h2 className="mb-3">Notifications</h2>
                    {currentNotifications.length === 0 ? (
                      <Card className="Sign-up-container-inner2 text-center foramaxWidth">
                        <CCardBody>
                          <div>Notification Is Not Available</div>
                        </CCardBody>
                      </Card>
                    ) : (
                      <ul className="list-group custom-list">
                        {currentNotifications.map((item, index) => (
                          <Accordion
                            key={index}
                            className={`${
                              item.status === 'seen'
                                ? `acco1-seen-${theme} pb-1`
                                : `acco1-unseen-${theme} pb-1`
                            }`}
                          >
                            <Accordion.Item
                              eventKey="0"
                              className={`acco2${theme}`}
                            >
                              <Accordion.Header className={`aaac-${theme}`}>
                                {item.message.split(' ').slice(0, 3).join(' ')}
                              </Accordion.Header>
                              <Accordion.Body
                                className={`list-group-item custom-list-item ${
                                  item.status === 'seen'
                                    ? `list-group-item-seen-${theme}`
                                    : `list-group-item-unseen-${theme}`
                                }`}
                              >
                                <div className="Messgae-Notification">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.message,
                                    }}
                                  />
                                </div>
                                <div className="buttonDiv">
                                  <button
                                    className={`btn-sm MarkAsRead-${theme}`}
                                    style={{
                                      display:
                                        item.status === 'seen'
                                          ? 'none'
                                          : 'block',
                                    }}
                                    value={item._id}
                                    onClick={() => handleUpdateStatus(item._id)}
                                  >
                                    Mark as read
                                  </button>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
