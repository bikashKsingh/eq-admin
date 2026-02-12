import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../customHooks/useAuth";
import { useEffect } from "react";

export function TrainerSidebar() {
  const { state, dispatch } = useAuth();
  const navigation = useNavigate();

  // handleLogout
  function handleLogout(evt: React.MouseEvent<HTMLAnchorElement>) {
    evt.preventDefault();
    dispatch({ type: "CLEAR_TOKEN" });
    navigation("/trainer/login");
  }

  // If not logedin
  useEffect(() => {
    if (!state.token || state.user != "TRAINER") {
      navigation("/trainer/login");
    }
  }, [state]);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link active" to="/trainer/">
            <i className="ti-shield menu-icon"></i>
            {/* <TfiDashboard className="menu-icon" /> */}
            <span className="menu-title">DASHBOARD</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link active" to="/trainer/profile">
            <i className="ti-user menu-icon"></i>
            {/* <TfiDashboard className="menu-icon" /> */}
            <span className="menu-title">My Pfofile</span>
          </Link>
        </li>

        {/* Users */}
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#users"
            aria-expanded="false"
            aria-controls="users"
          >
            <i className="ti-id-badge menu-icon"></i>
            <span className="menu-title">Users</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="users">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/trainer/users">
                  Users
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link className="nav-link" to="/trainers">
                  Trainers
                </Link>
              </li> */}
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/trainer/bookings">
            <i className="ti-package menu-icon"></i>
            <span className="menu-title">My Bookings</span>
          </Link>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="" onClick={handleLogout}>
            <i className="ti-power-off menu-icon"></i>
            <span className="menu-title">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
