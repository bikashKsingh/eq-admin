import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link active" to="/">
            <i className="ti-shield menu-icon"></i>
            {/* <TfiDashboard className="menu-icon" /> */}
            <span className="menu-title">DASHBOARD</span>
          </Link>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#setting"
            aria-expanded="false"
            aria-controls="setting"
          >
            <i className="ti-settings menu-icon"></i>
            <span className="menu-title">Setting</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="setting">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/kycDocuments">
                  KYC Documents
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/documentFormats">
                  Document Format
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trainerSpecialities">
                  Trainer Speciality
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trainerInterests">
                  Trainer Interest
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trainerLevels">
                  Trainer Level
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trainerDesignations">
                  Trainer Designation
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/paymentSettings">
                  Payment Seting
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Categories */}
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#categories"
            aria-expanded="false"
            aria-controls="categories"
          >
            <i className="ti-layers menu-icon"></i>
            <span className="menu-title">Categories</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="categories">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/categories">
                  Main Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/subCategories">
                  Sub Categories
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link className="nav-link" to="/subCategories">
                  Sub Categories
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/childCategories">
                  Child Categories
                </Link>
              </li> */}
            </ul>
          </div>
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
            <i className="ti-user menu-icon"></i>
            <span className="menu-title">Users</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="users">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/trainers">
                  Trainers
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pages/ui-features/buttons.html">
                  Franchise
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Discount & Promotion */}
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#discount-promotion"
            aria-expanded="false"
            aria-controls="discount-promotion"
          >
            <i className="ti-gift menu-icon"></i>
            <span className="menu-title">Discount & Promotion</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="discount-promotion">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/coupons">
                  Discount Coupons
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/newsletters">
                  Newsletter Emails
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Programs */}
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#programs"
            aria-expanded="false"
            aria-controls="programs"
          >
            <i className="ti-files menu-icon"></i>
            <span className="menu-title">Programs</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="programs">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/programRequirements">
                  Program Requirements
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/plans">
                  Plans
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/programs">
                  Program List
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/programPlans">
                  Program Plan List
                </Link>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="pages/charts/chartjs.html">
            <i className="ti-power-off menu-icon"></i>
            <span className="menu-title">Logout</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="pages/charts/chartjs.html">
            <i className="ti-power-off menu-icon"></i>
            <span className="menu-title">Pages</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
