import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Store } from '../Store';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import Accordion from 'react-bootstrap/Accordion';

export default function NotificationScreen() {
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [notificationMark, setNotificationMark] = useState('');
  const [loading, setloading] = useState(true);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const maxPageNumbers = 5; // Maximum page numbers to show directly
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
    // Consolidate both event listeners

    return () => {
      socket.off('notifyUserFrontend', handleNotification); // Remove the listeners
      socket.off('notifyProjectFrontend', handleNotification);
    };
  }, []);

  // useEffect(() => {
  //   ctxDispatch({ type: 'NOTIFICATION-NULL' });
  // }, []);

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
        console.error('Error fetching notification data:', error);
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
      console.log(err);
    } finally {
      setloading(false);
    }
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
              className="ThreeDot justify-content-center"
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
          {currentNotifications ? (
            <>
              <div className="container mt-5">
                <div className="row">
                  <div className="col p-0">
                    <h2 className="mb-3">Notifications</h2>
                    <ul className="list-group custom-list">
                      {currentNotifications.map((item, index) => (
                        <Accordion
                          className={` ${
                            item.status === 'seen'
                              ? `acco1-seen-${theme} p-0`
                              : `acco1-unseen-${theme} p-0`
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
                                {/* {item.message}{' '} */}
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.message,
                                  }}
                                />
                              </div>
                              <div>
                                <button
                                  className={`MarkAsRead-${theme}`}
                                  style={{
                                    display:
                                      item.status == 'seen' ? 'none' : 'block',
                                  }}
                                  value={item._id}
                                  onClick={handleUpdateStatus}
                                >
                                  Mark as read
                                </button>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      ))}
                    </ul>
                    {/* <nav>
                  <ul className="pagination justify-content-center">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {pageNumbers
                      .slice(currentPage - 1, currentPage - 1 + maxPageNumbers)
                      .map((number) => (
                        <li
                          key={number}
                          className={`page-item ${
                            currentPage === number ? 'active' : ''
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(number)}
                            className="page-link"
                          >
                            {number}
                          </button>
                        </li>
                      ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav> */}
                    {reversedNotifications.length > 7 && (
                      <nav>
                        <ul className="pagination justify-content-center">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? 'disabled' : ''
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                            >
                              Previous
                            </button>
                          </li>
                          {pageNumbers
                            .slice(
                              currentPage - 1,
                              currentPage - 1 + maxPageNumbers
                            )
                            .map((number) => (
                              <li
                                key={number}
                                className={`page-item ${
                                  currentPage === number ? 'active' : ''
                                }`}
                              >
                                <button
                                  onClick={() => handlePageChange(number)}
                                  className="page-link"
                                >
                                  {number}
                                </button>
                              </li>
                            ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? 'disabled' : ''
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {' '}
              <div className="d-flex mt-3 justify-content-center">
                <ThreeDots
                  height="50"
                  width="50"
                  radius="9"
                  className="ThreeDot  justify-content-center"
                  color="#0e0e3d"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
