import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../customHooks/useAuth";
import { get } from "../../../utills";

export function TrainerHeader() {
  const { state, dispatch } = useAuth();
  const navigation = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [myProfile, setMyProfile] = useState<any>(null);

  function handleDesktopSidebar(evt: React.MouseEvent<HTMLElement>) {
    evt.preventDefault();
    document.body.classList.toggle("sidebar-icon-only");
  }

  function handleMobileSidebar(evt: React.MouseEvent<HTMLElement>) {
    evt.preventDefault();
    const sidebar = document.getElementById("sidebar");
    sidebar?.classList.toggle("active");
  }

  // handleLogout
  function handleLogout() {
    dispatch({ type: "CLEAR_TOKEN" });
    navigation("/trainer/login");
  }

  // If not logedin
  useEffect(() => {
    if (!state.token || state.user != "TRAINER") {
      navigation("/trainer/login");
    }
  }, [state]);

  // get myProfile
  useEffect(function () {
    async function getData() {
      setLoading(true);
      const apiResponse = await get(`/trainers/profile`, true);
      if (apiResponse?.status == 200) {
        setMyProfile(apiResponse?.body);
      }
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo me-5" to="/trainer/">
          <img src="/images/black-logo.png" className="me-4" alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/trainer/">
          <img src="/images/black-logo.png" alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          // data-toggle="minimize"
          onClick={handleDesktopSidebar}
        >
          <span className="ti-view-list"></span>
        </button>
        <ul className="navbar-nav mr-lg-2 search-box-container">
          <li className="nav-item nav-search d-none d-lg-block">
            <div className="input-group">
              <div
                className="input-group-prepend hover-cursor"
                id="navbar-search-icon"
              >
                <span className="input-group-text" id="search">
                  <i className="ti-search"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="navbar-search-input"
                placeholder="Search now"
                aria-label="search"
                aria-describedby="search"
              />
            </div>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item dropdown me-1">
            <a
              className="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center"
              id="messageDropdown"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i className="ti-email mx-0"></i>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right navbar-dropdown"
              aria-labelledby="messageDropdown"
            >
              <p className="mb-0 font-weight-normal float-left dropdown-header">
                Messages
              </p>
              <a className="dropdown-item">
                <div className="item-thumbnail">
                  <img
                    src="/images/faces/face4.jpg"
                    alt="image"
                    className="profile-pic"
                  />
                </div>
                <div className="item-content flex-grow">
                  <h6 className="ellipsis font-weight-normal">David Grey</h6>
                  <p className="font-weight-light small-text text-muted mb-0">
                    The meeting is cancelled
                  </p>
                </div>
              </a>
              <a className="dropdown-item">
                <div className="item-thumbnail">
                  <img
                    src="/images/faces/face2.jpg"
                    alt="image"
                    className="profile-pic"
                  />
                </div>
                <div className="item-content flex-grow">
                  <h6 className="ellipsis font-weight-normal">Tim Cook</h6>
                  <p className="font-weight-light small-text text-muted mb-0">
                    New product launch
                  </p>
                </div>
              </a>
              <a className="dropdown-item">
                <div className="item-thumbnail">
                  <img
                    src="/images/faces/face3.jpg"
                    alt="image"
                    className="profile-pic"
                  />
                </div>
                <div className="item-content flex-grow">
                  <h6 className="ellipsis font-weight-normal"> Johnson</h6>
                  <p className="font-weight-light small-text text-muted mb-0">
                    Upcoming board meeting
                  </p>
                </div>
              </a>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link count-indicator dropdown-toggle"
              id="notificationDropdown"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i className="ti-bell mx-0"></i>
              <span className="count"></span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right navbar-dropdown"
              aria-labelledby="notificationDropdown"
            >
              <p className="mb-0 font-weight-normal float-left dropdown-header">
                Notifications
              </p>
              <a className="dropdown-item">
                <div className="item-thumbnail">
                  <div className="item-icon bg-success">
                    <i className="ti-info-alt mx-0"></i>
                  </div>
                </div>
                <div className="item-content">
                  <h6 className="font-weight-normal">Application Error</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">
                    Just now
                  </p>
                </div>
              </a>
              <a className="dropdown-item">
                <div className="item-thumbnail">
                  <div className="item-icon bg-warning">
                    <i className="ti-settings mx-0"></i>
                  </div>
                </div>
                <div className="item-content">
                  <h6 className="font-weight-normal">Settings</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">
                    Private message
                  </p>
                </div>
              </a>
              <a className="dropdown-item">
                <div className="item-thumbnail">
                  <div className="item-icon bg-info">
                    <i className="ti-user mx-0"></i>
                  </div>
                </div>
                <div className="item-content">
                  <h6 className="font-weight-normal">New user registration</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">
                    2 days ago
                  </p>
                </div>
              </a>
            </div>
          </li>
          <li className="nav-item nav-profile dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
              id="profileDropdown"
            >
              <img src={myProfile?.profilePhoto} alt="profile" />
            </a>
            <div
              className="dropdown-menu dropdown-menu-right navbar-dropdown"
              aria-labelledby="profileDropdown"
            >
              <a className="dropdown-item">
                <i className="ti-user text-primary"></i>
                My Profile
              </a>
              <a className="dropdown-item">
                <i className="ti-settings text-primary"></i>
                Setting
              </a>
              <a className="dropdown-item" onClick={handleLogout}>
                <i className="ti-power-off text-primary"></i>
                Logout
              </a>
            </div>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          // data-toggle="offcanvas"
          onClick={handleMobileSidebar}
        >
          <span className="ti-view-list"></span>
        </button>
      </div>
    </nav>
  );
}
