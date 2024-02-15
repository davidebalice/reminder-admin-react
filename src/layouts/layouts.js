import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./layout.css";
import "boxicons";
import Swal from "sweetalert2";
import { Context } from "../context/UserContext";
import logo from "../assets/img/logoWhite.png";
import logo2 from "../assets/img/logoWhite2.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronDown,
  faListUl,
  faIndent,
  faFileInvoice,
  faTableList,
  faUsersGear,
  faStore,
  faArrowRightFromBracket,
  faCalendarWeek,
  faGear,
  faUser,
  faBars,
  faBell,
  faX,
} from "@fortawesome/free-solid-svg-icons";

export default function Layouts() {
  const { userData } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [render, setRender] = useState(true);
  const [headerToggle, setHeaderToggle] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [headerNavManu, setheaderNavManu] = useState(true);
  const defaultOpenSidebar = localStorage.getItem("defaultOpenSidebar");
  const mainBody = document.getElementById("mainBody");

  useEffect(() => {
    if (
      pathname === "/login" ||
      pathname === "/forgot-password" ||
      pathname === "/register"
    ) {
      setSidebar(false);
      mainBody.classList.remove("mainBody");
    } else {
      setSidebar(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (defaultOpenSidebar === "open") {
      setHeaderToggle(true);
      setheaderNavManu(false);
    } else if (defaultOpenSidebar === "close") {
      setHeaderToggle(false);
      setheaderNavManu(true);
    }
  }, []);

  const headerTogglehandle = () => {
    setHeaderToggle(!headerToggle);
    setheaderNavManu(!headerNavManu);
    if (headerToggle === true) {
      localStorage.setItem("defaultOpenSidebar", "close");
    }
    if (headerToggle === false) {
      localStorage.setItem("defaultOpenSidebar", "open");
    }
  };

  useEffect(() => {
    if (window.innerWidth >= 1068) {
      if (headerToggle) {
        mainBody.classList.add("mainBody");
      } else {
        mainBody.classList.remove("mainBody");
      }
    } else {
      localStorage.setItem("defaultOpenSidebar", "close");
      setHeaderToggle(false);
      setheaderNavManu(false);
    }

    if (document.getElementById("header") !== null) {
      headerToggle &&
        document.getElementById("header").classList.add("mainBody");
      headerToggle !== true &&
        document.getElementById("header").classList.remove("mainBody");
    }
  }, [mainBody.classList, headerToggle]);

  const updateActive = () => {
    setRender(!render);
  };
  const logoutHandle = () => {
    Swal.fire({
      icon: "warning",
      title: "Logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("logout Success", "", "success");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <>
      {sidebar !== false && (
        <>
          <header className="header mb-4 dropdown" id="header">
            <div
              onClick={headerTogglehandle}
              className="header_toggle"
              id="header-toggle"
            >
              {headerNavManu ? (
                <FontAwesomeIcon icon={faBars} />
              ) : (
                <FontAwesomeIcon icon={faX} />
              )}{" "}
            </div>
            <div
              className="d-flex align-items-center dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <span className="header_img">
                {" "}
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/user/img/${
                    userData && userData.photo
                  }`}
                  class="userImg"
                  alt=""
                />{" "}
              </span>{" "}
              <span className="ms-1">
                {userData && (
                  <>
                    {userData.surname} {userData.name}
                  </>
                )}
              </span>{" "}
            </div>

            <ul
              className="dropdown-menu dropdown-menu-end"
              style={{ width: "auto", padding: "0, 2rem" }}
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>

              <li className="dropdown-item" onClick={logoutHandle}>
                Log Out
              </li>
            </ul>
          </header>

          <div className="manubar">
            <div
              className={`l-navbar ${headerToggle ? "show" : ""}`}
              id="nav-bar"
            >
              <nav className="nav">
                <div>
                  {" "}
                  <a
                    href="#"
                    className="sidebarHeader"
                    style={{
                      justifyContent: headerToggle ? "center" : "left",
                      width: headerToggle ? "100%" : "50px",
                    }}
                  >
                    <img
                      src={headerToggle ? logo : logo2}
                      className={
                        headerToggle ? "logoSidebar" : "logoSidebarClosed"
                      }
                      alt="db logo"
                    />
                  </a>
                  <a href="#" className="nav_logo">
                    <FontAwesomeIcon
                      icon={faCalendarWeek}
                      className="reminderIcon"
                    />{" "}
                    <span className="nav_logo-name">Reminder App</span>{" "}
                  </a>
                  <div className="nav_list">
                    <Link
                      onClick={updateActive}
                      to="/"
                      className={`nav_link ${pathname === "/" && "active"}`}
                    >
                      <i className="bx bx-grid-alt nav_icon"></i>
                      <span className="nav_name">Dashboard</span>
                    </Link>

                    <Link
                      to="/reminders"
                      onClick={updateActive}
                      className={`nav_link ${
                        pathname === "/reminders" && "active"
                      }`}
                    >
                      <FontAwesomeIcon icon={faBell} />
                      <span className="nav_name">Reminder</span>
                    </Link>

                    <Link
                      to="/categories"
                      onClick={updateActive}
                      className={`nav_link ${
                        pathname === "/categories" && "active"
                      }`}
                    >
                      <FontAwesomeIcon icon={faListUl} />
                      <span className="nav_name">Categories</span>
                    </Link>

                    {userData && userData.role === "admin" && (
                      <>
                        <Link
                          to="/users"
                          onClick={updateActive}
                          className={`nav_link ${
                            pathname === "/users" && "active"
                          }`}
                        >
                          <FontAwesomeIcon icon={faUser} />
                          <span className="nav_name">Users</span>
                        </Link>
                      </>
                    )}

                    <Link
                      onClick={updateActive}
                      to="/profile"
                      className={`nav_link ${
                        pathname === "/profile" && "active"
                      }`}
                    >
                      <FontAwesomeIcon icon={faGear} />
                      <span className="nav_name">Profile</span>
                    </Link>
                    <Link onClick={logoutHandle} to="#" className={`nav_link `}>
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      <span className="nav_name">Logout</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
