import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './Components/Sidebar';
import { Store } from './Store';
import Footer from './Components/footer';
import UserRouting from './Components/Routing/UserRouting';
import HomeNav from './Components/Navbar/HomeNav';
import HomeRouting from './Components/Routing/HomeRouting';
import UserNav from './Components/Navbar/UserNav';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    ctxDispatch({
      type: 'SIDEBAR',
      payload: sidebarVisible,
    });
  };

  return (
    <div className={userInfo ? `App ${theme}` : `App`}>
      <ToastContainer position="bottom-center" autoClose={600} limit={1} />
      <div>
        <Container fluid className="px-0">
          <div className="d-flex">
            {userInfo ? (
              <Sidebar
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
              />
            ) : null}
            <div className="px-0 w-100">
              {userInfo ? (
                <UserNav toggleSidebar={toggleSidebar} />
              ) : (
                <HomeNav />
              )}
              <main className={userInfo ? `windowCal` : `windowCal1`}>
                <div className={userInfo ? `py-5 px-4` : `m-0 mx-3`}>
                  <Routes>
                    <Route
                      path="/*"
                      element={userInfo ? <UserRouting /> : <HomeRouting />}
                    />
                  </Routes>
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
