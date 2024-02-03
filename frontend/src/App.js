import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import enTranslation from './Language/en.json';
import nlTranslation from './Language/nl.json';
import deTranslation from './Language/de.json';
import axios from 'axios';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, languageName } = state;
  i18n.init({
    interpolation: { escapeValue: false },
    lng: languageName,
    resources: {
      en: { translation: enTranslation },
      nl: { translation: nlTranslation },
      de: { translation: deTranslation },
    },
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const theme = toggleState ? 'dark' : 'light';

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    ctxDispatch({
      type: 'SIDEBAR',
      payload: sidebarVisible,
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/is-auth', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          ctxDispatch({ type: 'USER_SIGNOUT' });
          localStorage.removeItem('userInfo');
          localStorage.removeItem('activeTab');
          window.location.href = '/';
        } else {
          toast.error(err.response?.data?.message, { autoClose: 2000 });
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}

export default App;
