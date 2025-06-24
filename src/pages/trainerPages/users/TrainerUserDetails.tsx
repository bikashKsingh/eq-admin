import { GoBackButton, OverlayLoading } from "../../../components";

import { useEffect, useState } from "react";
import { get } from "../../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export function TrainerUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<any>({
    specialities: [],
    interests: [],
    kycDocuments: [],
    certificates: [],
  });
  const [usersBooking, setUsersBooking] = useState<any[] | null>(null);

  // get user details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/users/trainersUser/${id}`, true);
        if (apiResponse?.status == 200) {
          setUserDetails(apiResponse?.body);
        }
        setLoading(false);
      }
      if (id) getData(id);
    },
    [id]
  );

  // get user's booking details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(
          `/bookings/trainersBooking?user=${id}`,
          true
        );
        if (apiResponse?.status == 200) {
          setUsersBooking(apiResponse?.body);
        }
        setLoading(false);
      }
      if (id) getData(id);
    },
    [id]
  );

  function getSocialUsername(link: string): string {
    // Remove any trailing slashes
    link = link.replace(/\/$/, "");

    // Extract the username after the last slash
    const parts = link.split("/");
    const username = parts[parts.length - 1];
    if (username[0] == "@") {
      return username;
    } else {
      return `@${username}`;
    }
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">User Details</h4>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <OverlayLoading />
      ) : (
        <div className="row">
          <div className="col-md-12 ">
            {/* Personal & Profile Details */}
            <div className="row">
              {/* Profile Card */}
              <div className="col-md-4">
                <div className="card rounded-2">
                  <div className="card-body">
                    <div className="text-center">
                      <div className="d-flex justify-content-center">
                        <div
                          className="4px solid green"
                          style={{
                            height: 80,
                            width: 80,
                            borderRadius: 40,
                            fontSize: "60px",
                            backgroundColor: "#006D5A",
                            color: "#fff",
                            paddingTop: "2px",
                          }}
                        >
                          <span>{userDetails?.firstName[0]}</span>
                        </div>
                      </div>
                      <h6 className="px-0 pt-2">{userDetails?.firstName}</h6>
                      <p>
                        <span className="badge bg-warning rounded">
                          {userDetails?.gender}
                        </span>
                      </p>
                      {/* <p>{`${userDetails?.address}, ${userDetails?.locality}, ${userDetails?.city}, ${userDetails?.state}, ${userDetails?.pincode}, ${userDetails?.country}`}</p> */}
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <Link
                          to={`tel:${userDetails?.mobile}`}
                          className="btn btn-info text-light py-2"
                        >
                          <i className="fa fa-phone"></i>
                        </Link>

                        <Link
                          to={`mailto:${userDetails?.email}`}
                          className="btn btn-danger text-light py-2"
                        >
                          <i className="fa fa-envelope"></i>
                        </Link>
                      </div>
                    </div>

                    {/*  */}
                    <div className="mt-3 border-top">
                      <ul className="list-group list-group-flush">
                        {/* Facebook */}
                        {userDetails?.facebook ? (
                          <li className="list-group-item">
                            <a
                              href={userDetails?.facebook}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-facebook text-info"></i>
                                Facebook
                              </div>
                              <div className="">
                                {getSocialUsername(userDetails?.facebook)}
                              </div>
                            </a>
                          </li>
                        ) : null}
                        {/* Instagram */}
                        {userDetails?.instagram ? (
                          <li className="list-group-item">
                            <a
                              href={userDetails?.instagram}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-instagram text-success"></i>
                                Instagram
                              </div>
                              <div className="">
                                {getSocialUsername(userDetails?.instagram)}
                              </div>
                            </a>
                          </li>
                        ) : null}

                        {/* Twitter */}
                        {userDetails?.twitter ? (
                          <li className="list-group-item">
                            <Link
                              to={userDetails?.twitter}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-twitter text-success"></i>
                                Twitter
                              </div>
                              <div className="">
                                {getSocialUsername(userDetails?.twitter)}
                              </div>
                            </Link>
                          </li>
                        ) : null}

                        {/* Linkedin */}
                        {userDetails?.linkedin ? (
                          <li className="list-group-item">
                            <Link
                              to={userDetails?.linkedin}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-linkedin text-dark"></i>
                                Linkedin
                              </div>
                              <div className="">
                                {getSocialUsername(userDetails?.linkedin)}
                              </div>
                            </Link>
                          </li>
                        ) : null}

                        {/* Youtube */}
                        {userDetails?.youtube ? (
                          <li className="list-group-item">
                            <Link
                              to={userDetails?.youtube}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-youtube text-danger"></i>
                                YouTube
                              </div>
                              <div className="">
                                {getSocialUsername(userDetails?.youtube)}
                              </div>
                            </Link>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="col-md-8">
                <div className="card rounded-2">
                  <div className="card-body table-responsive">
                    <h5 className="mb-2">Personal Details</h5>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td scope="row">Name</td>
                          <td>{userDetails?.name}</td>
                        </tr>
                        <tr>
                          <td scope="row">Email</td>
                          <td>{userDetails?.email}</td>
                        </tr>
                        <tr>
                          <td scope="row">Mobile</td>
                          <td>{userDetails?.mobile}</td>
                        </tr>
                        <tr>
                          <td scope="row">DOB</td>
                          <td>
                            {moment(userDetails?.dob).format("DD-MM-YYYY")}
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Gender</td>
                          <td>{userDetails?.gender}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#trainerAddress"
                      aria-expanded="false"
                      aria-controls="trainerAddress"
                    >
                      Bookings
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#trainerAddress"
                      aria-expanded="false"
                      aria-controls="trainerAddress"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2 show" id="trainerAddress">
                    <div className="card card-body shadow-none p-2">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Program</th>
                            <th>Plan</th>
                            <th>Booking Date</th>
                            <th>Trainer</th>
                            <th>Booking Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersBooking?.map((item: any, index: number) => {
                            return (
                              <tr>
                                <td>{item?.program?.name}</td>
                                <td>{item?.plan?.name}</td>
                                <td>
                                  {moment(item?.createdAt).format("DD-MM-YYYY")}
                                </td>
                                <td>{item?.trainer?.name || "Not Assigned"}</td>
                                <td>{item?.bookingStatus}</td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Link
                                      className="p-2 bg-light"
                                      to={{
                                        pathname: `/trainer/bookings/details/${item?._id}`,
                                      }}
                                    >
                                      <span
                                        className="fas fa-eye text-warning"
                                        aria-hidden="true"
                                      ></span>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
