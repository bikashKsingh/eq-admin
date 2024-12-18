import { GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export function TrainerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [trainerDetails, setTrainerDetails] = useState<any>({
    specialities: [],
    interests: [],
    kycDocuments: [],
    certificates: [],
  });

  // get trainer details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/trainers/${id}`, true);
        if (apiResponse?.status == 200) {
          setTrainerDetails(apiResponse?.body);
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
              <h4 className="font-weight-bold mb-0">Trainer Details</h4>
            </div>
            {/* <div>
                <button
                  type="button"
                  className="btn btn-primary btn-icon-text btn-rounded"
                >
                  <i className="ti-clipboard btn-icon-prepend"></i>Report
                </button>
              </div> */}
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
                      <img
                        className="img"
                        style={{
                          height: 80,
                          width: 80,
                          borderRadius: 40,
                          border: "4px solid green",
                        }}
                        src={trainerDetails?.profilePhoto}
                      />
                      <h6 className="px-0 pt-2">{trainerDetails?.name}</h6>
                      <p>
                        <span className="badge bg-warning rounded">
                          {trainerDetails?.designation?.title}
                        </span>
                      </p>
                      <p>{`${trainerDetails?.address}, ${trainerDetails?.locality}, ${trainerDetails?.city}, ${trainerDetails?.state}, ${trainerDetails?.pincode}, ${trainerDetails?.country}`}</p>
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <Link
                          to={`tel:${trainerDetails?.mobile}`}
                          className="btn btn-info text-light py-2"
                        >
                          <i className="fa fa-phone"></i>
                        </Link>

                        <Link
                          to={`mailto:${trainerDetails?.email}`}
                          className="btn btn-danger text-light py-2"
                        >
                          <i className="fa fa-envelope"></i>
                        </Link>

                        <a
                          href={trainerDetails.meetingLink}
                          className="btn btn-warning text-light py-2"
                        >
                          <i className="fa fa-video-camera"></i>
                        </a>
                      </div>
                    </div>

                    {/*  */}
                    <div className="mt-3 border-top">
                      <ul className="list-group list-group-flush">
                        {/* Facebook */}
                        {trainerDetails?.facebook ? (
                          <li className="list-group-item">
                            <Link
                              to={trainerDetails?.facebook}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-facebook text-info"></i>
                                Facebook
                              </div>
                              <div className="">
                                {getSocialUsername(trainerDetails?.facebook)}
                              </div>
                            </Link>
                          </li>
                        ) : null}
                        {/* Instagram */}
                        {trainerDetails?.instagram ? (
                          <li className="list-group-item">
                            <Link
                              to={trainerDetails?.facebook}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-instagram text-success"></i>
                                Instagram
                              </div>
                              <div className="">
                                {getSocialUsername(trainerDetails?.instagram)}
                              </div>
                            </Link>
                          </li>
                        ) : null}

                        {/* Twitter */}
                        {trainerDetails?.twitter ? (
                          <li className="list-group-item">
                            <Link
                              to={trainerDetails?.twitter}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-twitter text-success"></i>
                                Twitter
                              </div>
                              <div className="">
                                {getSocialUsername(trainerDetails?.twitter)}
                              </div>
                            </Link>
                          </li>
                        ) : null}

                        {/* Linkedin */}
                        {trainerDetails?.linkedin ? (
                          <li className="list-group-item">
                            <Link
                              to={trainerDetails?.linkedin}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-linkedin text-dark"></i>
                                Linkedin
                              </div>
                              <div className="">
                                {getSocialUsername(trainerDetails?.linkedin)}
                              </div>
                            </Link>
                          </li>
                        ) : null}

                        {/* Youtube */}
                        {trainerDetails?.youtube ? (
                          <li className="list-group-item">
                            <Link
                              to={trainerDetails?.youtube}
                              className="social-link-item"
                              target="_blank"
                            >
                              <div className="social-link-item-icon">
                                <i className="ti-youtube text-danger"></i>
                                YouTube
                              </div>
                              <div className="">
                                {getSocialUsername(trainerDetails?.youtube)}
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
                          <td>{trainerDetails?.name}</td>
                        </tr>
                        <tr>
                          <td scope="row">Email</td>
                          <td>{trainerDetails?.email}</td>
                        </tr>
                        <tr>
                          <td scope="row">Mobile</td>
                          <td>{trainerDetails?.mobile}</td>
                        </tr>
                        <tr>
                          <td scope="row">DOB</td>
                          <td>
                            {moment(trainerDetails?.dob).format("DD-MM-YYYY")}
                          </td>
                        </tr>
                        <tr>
                          <td scope="row">Gender</td>
                          <td>{trainerDetails?.gender}</td>
                        </tr>
                        <tr>
                          <td scope="row">Trainer Level</td>
                          <td>{trainerDetails?.level?.title}</td>
                        </tr>
                        <tr>
                          <td scope="row">Bio</td>
                          <td>
                            <p>{trainerDetails?.bio || "N/A"}</p>
                          </td>
                        </tr>

                        <tr>
                          <td scope="row">Interests</td>
                          <td className="d-flex gap-1">
                            {trainerDetails?.interests?.map((value: any) => {
                              return (
                                <span className="badge bg-info rounded">
                                  {value.title}
                                </span>
                              );
                            })}
                          </td>
                        </tr>

                        <tr>
                          <td scope="row">Specialities</td>
                          <td className="d-flex gap-1">
                            {trainerDetails?.specialities?.map((value: any) => {
                              return (
                                <span className="badge bg-success rounded">
                                  {value.title}
                                </span>
                              );
                            })}
                          </td>
                        </tr>

                        <tr>
                          <td scope="row">Meeting Link</td>
                          <td className="d-flex gap-1">
                            <a href="">
                              <span className="badge bg-success rounded">
                                {trainerDetails.meetingLink || "N/A"}
                              </span>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Address */}
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
                      Trainer Address
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

                  <div className="collapse mt-2" id="trainerAddress">
                    <div className="card card-body shadow-none p-2">
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td scope="row">Address</td>
                            <td>{trainerDetails?.address}</td>
                          </tr>
                          <tr>
                            <td scope="row">Locality</td>
                            <td>{trainerDetails?.locality}</td>
                          </tr>
                          <tr>
                            <td scope="row">State</td>
                            <td>{trainerDetails?.state}</td>
                          </tr>
                          <tr>
                            <td scope="row">City</td>
                            <td>{trainerDetails?.city}</td>
                          </tr>
                          <tr>
                            <td scope="row">Country</td>
                            <td>{trainerDetails?.country}</td>
                          </tr>
                          <tr>
                            <td scope="row">Pincode</td>
                            <td>{trainerDetails?.pincode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#trainerKycDocuments"
                      aria-expanded="false"
                      aria-controls="trainerKycDocuments"
                    >
                      KYC Documents{" "}
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#trainerKycDocuments"
                      aria-expanded="false"
                      aria-controls="trainerKycDocuments"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2" id="trainerKycDocuments">
                    <div className="card card-body shadow-none p-2">
                      <table className="table table-sm">
                        <tbody>
                          {trainerDetails?.kycDocuments?.map((doc: any) => {
                            return (
                              <tr>
                                <td scope="row">{doc?.title}</td>
                                <td>
                                  <iframe
                                    src={doc?.documentFile}
                                    width="500"
                                    height="250"
                                    frameBorder="0"
                                  >
                                    Your browser does not support iframes.
                                  </iframe>
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

          {/* Trainer Certificates */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#trainerCertificates"
                      aria-expanded="false"
                      aria-controls="trainerCertificates"
                    >
                      Trainer Certificates
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#trainerCertificates"
                      aria-expanded="false"
                      aria-controls="trainerCertificates"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2" id="trainerCertificates">
                    <div className="card card-body shadow-none p-2">
                      <table className="table table-sm">
                        <tbody>
                          {trainerDetails?.certificates?.map(
                            (certificate: any) => {
                              return (
                                <tr>
                                  <td scope="row">{certificate?.title}</td>
                                  <td>
                                    <iframe
                                      src={certificate?.certificateFile}
                                      width="500"
                                      height="250"
                                      frameBorder="0"
                                    >
                                      Your browser does not support iframes.
                                    </iframe>
                                  </td>
                                </tr>
                              );
                            }
                          )}
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
