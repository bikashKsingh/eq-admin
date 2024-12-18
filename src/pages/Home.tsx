import { PiCurrencyInr } from "react-icons/pi";
import { BsShop } from "react-icons/bs";
import { PiUsersFourLight } from "react-icons/pi";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import BasicBars from "../components/charts/BasicBarChart";
import DoughnutChart from "../components/charts/DoughnutChart";
import { useEffect, useState } from "react";
import { get } from "../utills";
import { toast } from "react-toastify";
import { Spinner } from "../components/ui/Spinner";
import { useAuth } from "../customHooks/useAuth";

export function Home() {
  const chartContainerStyle: any = {
    width: "100%",
    height: "270px",
    transform: "scale(1)", // Initial zoom-out
    transition: "transform 0.3s ease-in-out", // Smooth transition
    display: "flex",
    justifyContent: "center",
  };

  const [usersDataLoading, setUsersDetaLoading] = useState<boolean>(true);
  const [usersData, setUsersData] = useState<any>(null);
  // const { state, dispatch } = useAuth();

  // get total users
  useEffect(function () {
    async function getData() {
      setUsersDetaLoading(true);
      const apiResponse = await get(`/users/dashboard`, true);
      if (apiResponse?.status == 200) {
        setUsersData(apiResponse?.body);
      } else {
        toast.error(apiResponse?.message);
      }
      setUsersDetaLoading(false);
    }
    getData();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="font-weight-bold mb-0">EQ Dashboard</h4>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary btn-icon-text btn-rounded"
              >
                <i className="ti-clipboard btn-icon-prepend"></i>Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title text-md-center text-xl-left">
                Total Users
              </p>
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                {usersDataLoading ? (
                  <Spinner />
                ) : (
                  <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                    {usersData?.totalRecords}
                  </h3>
                )}
                <i className="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i>
              </div>
              {usersDataLoading ? (
                <div>
                  <Spinner /> Loading
                </div>
              ) : usersData?.percentageChange < 0 ? (
                <p className="mb-0 mt-2 text-danger">
                  {Math.abs(usersData?.percentageChange).toFixed(2)}%
                  <span className="text-black ms-1">
                    <small>(30 days)</small>
                  </span>
                </p>
              ) : (
                <p className="mb-0 mt-2 text-success">
                  {usersData?.percentageChange?.toFixed(2)}%
                  <span className="text-black ms-1">
                    <small>(30 days)</small>
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title text-md-center text-xl-left">
                Total Sales
              </p>
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  2000
                </h3>
                <PiCurrencyInr className="icon-md text-muted mb-0 mb-md-3 mb-xl-0" />

                {/* <i className="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i> */}
              </div>
              <p className="mb-0 mt-2 text-danger">
                0.47%
                <span className="text-black ms-1">
                  <small>(30 days)</small>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title text-md-center text-xl-left">
                Total Franchise
              </p>
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  10
                </h3>
                <BsShop className="icon-md text-muted mb-0 mb-md-3 mb-xl-0" />
                {/* <i className="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i> */}
              </div>
              <p className="mb-0 mt-2 text-success">
                64.00%
                <span className="text-black ms-1">
                  <small>(30 days)</small>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title text-md-center text-xl-left">
                Total Leads
              </p>
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <h3 className="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  1000
                </h3>

                <PiUsersFourLight className="ti-layers-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0" />
              </div>
              <p className="mb-0 mt-2 text-success">
                23.00%
                <span className="text-black ms-1">
                  <small>(30 days)</small>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pie & Bar Charts */}
      <div className="row">
        {/* Pie Chart */}
        <div className="col-lg-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Sales by Plan</h4>
              <div className="" style={chartContainerStyle}>
                <PieChart />
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-lg-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Sales details</h4>
              <BarChart />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title">Sales details by Channel</p>

              <div id="sales-legend" className="chartjs-legend mt-4 mb-2"></div>
              {/* <canvas id="sales-chart"></canvas> */}
              <BasicBars />
            </div>
            {/* <div className="card border-right-0 border-left-0 border-bottom-0">
              <div className="d-flex justify-content-center justify-content-md-end">
                <div className="dropdown flex-md-grow-1 flex-xl-grow-0">
                  <button
                    className="btn btn-lg btn-outline-light dropdown-toggle rounded-0 border-top-0 border-bottom-0"
                    type="button"
                    id="dropdownMenuDate2"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    Today
                  </button>
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownMenuDate2"
                  >
                    <a className="dropdown-item" href="#">
                      January - March
                    </a>
                    <a className="dropdown-item" href="#">
                      March - June
                    </a>
                    <a className="dropdown-item" href="#">
                      June - August
                    </a>
                    <a className="dropdown-item" href="#">
                      August - November
                    </a>
                  </div>
                </div>
                <button
                  className="btn btn-lg btn-outline-light text-primary rounded-0 border-0 d-none d-md-block"
                  type="button"
                >
                  View all
                </button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card border-bottom-0">
            <div className="card-body">
              <p className="card-title">Leads Details</p>
              {/* <p className="text-muted font-weight-light">
                The argument in favor of using filler text goes something like
                this: If you use real content in the design process, anytime you
                reach a review
              </p> */}
              <div className="d-flex flex-wrap mb-5">
                <div className="me-5 mt-3">
                  <p className="text-muted">Total</p>
                  <h3>500</h3>
                </div>
                <div className="me-5 mt-3">
                  <p className="text-muted">Converted</p>
                  <h3>187</h3>
                </div>
                <div className="me-5 mt-3">
                  <p className="text-muted">Ongoing</p>
                  <h3>{50}</h3>
                </div>
                <div className="mt-3">
                  <p className="text-muted">Not Converted</p>
                  <h3>{500 - 187 - 50}</h3>
                </div>
              </div>
            </div>
            <canvas id="order-chart" className="w-100"></canvas>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title mb-0">Top Plans</p>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Plans</th>
                      <th>Sale Amount</th>
                      <th>Sale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Train with Gunj</td>
                      <td>20000</td>
                      <td className="text-info">
                        28.76% <i className="ti-arrow-up"></i>
                      </td>
                    </tr>
                    <tr>
                      <td>Personalised Training Plans</td>
                      <td>15000</td>
                      <td className="text-danger">
                        28.76% <i className="ti-arrow-down"></i>
                      </td>
                    </tr>
                    <tr>
                      <td>Personal Training Trial</td>
                      <td>12000</td>
                      <td className="text-info">
                        28.76% <i className="ti-arrow-up"></i>
                      </td>
                    </tr>
                    <tr>
                      <td>Group Training Plans</td>
                      <td>20000</td>
                      <td className="text-danger">
                        28.76% <i className="ti-arrow-down"></i>
                      </td>
                    </tr>
                    <tr>
                      <td>Personalised Training Plans</td>
                      <td>20000</td>
                      <td className="text-danger">
                        28.76% <i className="ti-arrow-down"></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Top Customers</h4>
              <BarChart />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card position-relative">
            <div className="card-body">
              <p className="card-title">Avarage Sale Reports</p>
              <div className="row">
                <div className="col-md-12 col-xl-3 d-flex flex-column justify-content-center">
                  <div className="ml-xl-4">
                    <h1>33500</h1>
                    <h3 className="font-weight-light mb-xl-4">Total Sales</h3>
                    {/* <p className="text-muted mb-2 mb-xl-0">
                      The total number of sessions within the date range. It is
                      the period time a user is actively engaged with your
                      website, page or app, etc
                    </p> */}
                  </div>
                </div>
                <div className="col-md-12 col-xl-9">
                  <div className="row">
                    <div className="col-md-6 mt-3 col-xl-5">
                      {/* <canvas id="north-america-chart"></canvas> */}
                      <DoughnutChart />
                    </div>
                    <div className="col-md-6 col-xl-7">
                      <div className="table-responsive mb-3 mb-md-0">
                        <table className="table table-borderless report-table">
                          <tr>
                            <td className="text-muted">Personalized Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "70%" }}
                                  aria-valuenow={70}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">524</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Hybrid Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "30%" }}
                                  //   aria-valuenow="30"
                                  //   aria-valuemin="0"
                                  //   aria-valuemax="100"
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">722</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Group Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "95%" }}
                                  aria-valuenow={95}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">173</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Corporate Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "60%" }}
                                  aria-valuenow={60}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">945</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Merchandise</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "40%" }}
                                  aria-valuenow={40}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">553</h5>
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="text-muted">Alaska</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "75%" }}
                                  aria-valuenow="75"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">912</h5>
                            </td>
                          </tr> */}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
