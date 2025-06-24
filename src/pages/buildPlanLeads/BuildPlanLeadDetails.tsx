import { GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export function BuildPlanLeadDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [leadDetails, setProgramDetails] = useState<any>({});
  const [programPlans, setProgramPlans] = useState<any>(null);

  // get program details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/buildPlanLeads/${id}`, true);
        if (apiResponse?.status == 200) {
          setProgramDetails(apiResponse?.body);
        }
        setLoading(false);
      }
      if (id) getData(id);
    },
    [id]
  );

  // get program plan details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(
          `/programPLans?program=${id}&displayOrder=ASC&planTypeWise=true`,
          true
        );
        if (apiResponse?.status == 200) {
          setProgramPlans(apiResponse?.body);
        }
        setLoading(false);
      }
      if (id) getData(id);
    },
    [id]
  );

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Lead Details</h4>
            </div>
            <div>
              {/* <Link
                to={`/programPlans/add/${leadDetails._id}`}
                type="button"
                className="btn btn-primary text-light"
              >
                Add Plan
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <OverlayLoading />
      ) : (
        <div className="row">
          <div className="col-md-12 ">
            {/* Lead Details */}
            <div className="row gy-2">
              {/* Profile Card */}
              <div className="col-md-4">
                <div className="card rounded-2">
                  <div className="card-body p-0">
                    <div className="text-center p-4">
                      <span
                        style={{
                          height: "80px",
                          width: "80px",
                          background: "black",
                          borderRadius: 40,
                          textAlign: "center",
                          color: "white",
                          padding: 10,
                          display: "inline-block",
                          fontSize: 45,
                        }}
                      >
                        {leadDetails?.name && leadDetails?.name[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card card-body mt-2 rounded py-2">
                  <h6 className="pt-2 text-center">{leadDetails?.name}</h6>
                  {/*  */}
                  <div className="mt-3 border-top">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <a
                          href={leadDetails?.mobile}
                          className="social-link-item"
                          target="_blank"
                        >
                          <div className="social-link-item-icon">
                            <i className="ti-mobile text-info"></i>
                            {leadDetails?.countryCode} {leadDetails?.mobile}
                          </div>
                          <div className=""></div>
                        </a>
                      </li>

                      <li className="list-group-item">
                        <a
                          href={leadDetails?.email}
                          className="social-link-item"
                          target="_blank"
                        >
                          <div className="social-link-item-icon">
                            <i className="ti-email text-info"></i>
                            {leadDetails?.email}
                          </div>
                          <div className=""></div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div className="col-md-8">
                <div className="card rounded-2" style={{ height: "100%" }}>
                  <div className="card-body table-responsive">
                    <h5 className="mb-3">Lead Details</h5>

                    <table className="table table-striped table-borderless">
                      <tbody>
                        <tr>
                          <td className="py-3">Goals</td>
                          <td className="py-3">
                            {leadDetails?.goals?.map((item: any) => {
                              return (
                                <span className="badge bg-info mr-2">
                                  {item.title}
                                </span>
                              );
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">Age Range</td>
                          <td className="py-3">
                            <span className="badge bg-info">
                              {leadDetails?.ageRange?.title}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">Is Injured</td>
                          <td className="py-3">
                            {leadDetails?.isInjured ? (
                              <span className="badge bg-success">Yes</span>
                            ) : (
                              <span className="badge bg-danger">No</span>
                            )}
                          </td>
                        </tr>{" "}
                        <tr>
                          <td className="py-3">Yoga Experience</td>
                          <td className="py-3">
                            <span className="badge bg-info">
                              {leadDetails?.yogaExperience?.title}
                            </span>
                          </td>
                        </tr>{" "}
                        <tr>
                          <td className="py-3">Time Slots</td>
                          <td className="py-3">
                            <span className="badge bg-info">
                              {leadDetails?.timeSlot?.title}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">Budget</td>
                          <td className="py-3">
                            <span className="badge bg-info">{`${leadDetails?.budget?.minimum} - ${leadDetails?.budget?.maximum}`}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
