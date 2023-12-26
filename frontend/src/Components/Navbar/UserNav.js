import React, { useContext, useEffect, useState } from "react";
import { Container, Dropdown, Image, Nav, Navbar } from "react-bootstrap";
import { AiOutlineAlignLeft, AiOutlineHome } from "react-icons/ai";
import Theme from "../Theme";
import { Store } from "../../Store";
import { Link } from "react-router-dom";
import { MdLogout, MdOutlineNotifications } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { VscColorMode } from "react-icons/vsc";
import truncateText from "../../TruncateText";
import { BiHelpCircle } from "react-icons/bi";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function UserNav({ toggleSidebar }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, NotificationData } = state;
  const theme = toggleState ? "dark" : "light";
  const [isToggled, setIsToggled] = useState(toggleState);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenhelp, setIsOpenhelp] = useState(false);

  const handleMouseOver = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleChangeToggleState = () => {
    setIsToggled(!isToggled);
  };

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const toggleHelpSection = () => {
    setIsOpenhelp(!isOpenhelp);
  };

  useEffect(() => {
    ctxDispatch({ type: "HELPTOGGLE", payload: isOpenhelp });
  }, [isOpenhelp]);

  useEffect(() => {
    ctxDispatch({ type: "TOGGLE_BTN", payload: isToggled });
    localStorage.setItem("toggleState", JSON.stringify(isToggled));
  }, [isToggled]);

  const { t } = useTranslation();
  return (
    <>
      <Navbar expand="lg" className={`${theme}-admin-navbar`}>
        <Container fluid>
          <div
            className={`p-2 me-3 fs-5 admin-btn-logo ${theme}-navbar-Btn`}
            onClick={toggleSidebar}
          >
            <AiOutlineAlignLeft />
          </div>
          <Navbar.Brand href="/dashboard">
            <Image
              className="Roonberg-logo me-3 ms-2"
              src="/logo2.png"
              thumbnail
            />
          </Navbar.Brand>
          <Navbar.Collapse
            className="justify-content-end disNone"
            id="navbarScroll"
          >
            <Nav
              className="gap-3 align-items-center"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <div className="py-2">
                <BiHelpCircle
                  className={`fs-4 admin-btn-logo ${theme}-navbar-Btn`}
                  title={t("help")}
                  onClick={toggleHelpSection}
                />
              </div>
              <div className="py-2">
                <Theme />
              </div>
              <Link to="/notification-screen" className="position-relative">
                <MdOutlineNotifications
                  className={`fs-4 admin-btn-logo ${theme}-navbar-Btn`}
                  title={t("notification")}
                />
                {NotificationData.length > 0 && (
                  <span className="notication-bdg">
                    {NotificationData.length}
                  </span>
                )}
              </Link>
              <Dropdown
                className="mb-0 tab-btn text-start smallDeviceProfile"
                show={isOpen}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
              >
                <Dropdown.Toggle
                  id="dropdown-tabs"
                  className="m-2 profilebtnColor profileToggleBtn "
                >
                  <img
                    className="profile-icon-inner Nav-image img-fornavs"
                    src={
                      userInfo.profile_picture
                        ? userInfo.profile_picture
                        : "./avatar.png"
                    }
                    alt="userimg"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropMenu dropMenuProfile drophover"
                  style={{
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}
                >
                  <Dropdown.Item
                    style={{
                      paddingRight: "100px",
                    }}
                    href="/profile-screen"
                  >
                    <div className="d-flex gap-3 w-100">
                      <div>
                        <div>
                          {" "}
                          <img
                            className="profile-icon-inner Nav-image img-fornavs"
                            src={
                              userInfo.profile_picture
                                ? userInfo.profile_picture
                                : "./avatar.png"
                            }
                            alt="userimg"
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <div> {truncateText(userInfo.first_name, 9)}</div>
                        <div> {truncateText(userInfo.email, 10)}</div>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item href="/profile-screen" className="mb-2">
                    <IoPersonOutline className="fs-4 me-3 pb-1" />
                    {t("myProfile")}
                  </Dropdown.Item>
                  <Dropdown.Item href=" /dashboard" className="mb-2">
                    <AiOutlineHome className="fs-4 me-3 pb-1" />
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item href="/notification-screen" className="mb-2">
                    <IoMdNotificationsOutline className="fs-4 me-3 pb-1 " />
                    {t("notification")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleChangeToggleState}>
                    <VscColorMode className="fs-4 me-3 pb-1 " />
                    {theme === "light" ? t("light") : t("dark")} {t("mode")}
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item onClick={signoutHandler}>
                    <MdLogout className="fs-4 me-3 pb-1" />
                    {t("logout")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
          <div
            className={`p-2 me-3 fs-5 admin-btn-logo2 ${theme}-navbar-Btn`}
            onClick={toggleSidebar}
          >
            <AiOutlineAlignLeft />
          </div>
        </Container>
      </Navbar>
    </>
  );
}
