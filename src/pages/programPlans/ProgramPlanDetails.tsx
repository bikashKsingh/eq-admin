import { GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export function ProgramPlanDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [programPlanDetails, setProgramPlanDetails] = useState<any>(null);

  // get program plan details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/programPLans/${id}`, true);
        if (apiResponse?.status == 200) {
          setProgramPlanDetails(apiResponse?.body);
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
              <h4 className="font-weight-bold mb-0">Program Plan Details</h4>
            </div>
            <div>
              <Link
                to={`/programPlans/edit/${id}`}
                type="button"
                className="btn btn-primary text-light"
              >
                Edit Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <OverlayLoading />
      ) : (
        <div className="row">
          <div className="col-md-12 ">
            {/* Program Details */}
            <div className="row gy-2">
              {/* Profile Card */}
              <div className="col-md-4">
                <div className="card rounded-2">
                  <div className="card-body p-0">
                    <div className="text-center">
                      <img
                        className="img-fluid rounded"
                        style={{
                          maxHeight: 200,
                        }}
                        src={programPlanDetails?.program?.defaultImage}
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-body mt-2 rounded py-2">
                  <h6 className="pt-2 text-center">
                    {programPlanDetails?.program?.name}
                  </h6>
                </div>
              </div>

              {/* Program Details */}
              <div className="col-md-8">
                <div className="card rounded-2" style={{ height: "100%" }}>
                  <div className="card-body table-responsive">
                    <h5 className="mb-3">Program Details</h5>

                    <table className="table table-striped table-borderless">
                      <tbody>
                        <tr>
                          <td className="py-3">Name</td>
                          <td className="py-3">
                            {programPlanDetails?.program?.name}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">Slug</td>
                          <td className="py-3">
                            {programPlanDetails?.program?.slug}
                          </td>
                        </tr>
                        {/* <tr>
                          <td className="py-3">Category</td>
                          <td className="py-3">
                            {programPlanDetails?.program?.category?.name}
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#programPlans"
                      aria-expanded="false"
                      aria-controls="programPlans"
                    >
                      Plan Details
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#programPlans"
                      aria-expanded="false"
                      aria-controls="programPlans"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2 show" id="programPlans">
                    <div className="p-2 mb-3 row">
                      <div className="col-md-6">
                        <div
                          className="card card-body shadow-none rounded"
                          style={{
                            background: "#fee9e4",
                            border: 0,
                            height: "100%",
                          }}
                        >
                          <table
                            className="table-striped-new"
                            style={{ fontSize: "0.875rem" }}
                          >
                            <tbody>
                              <tr>
                                <td scope="row">Name</td>
                                <td>{programPlanDetails?.plan?.name}</td>
                              </tr>
                              <tr>
                                <td scope="row">Slug</td>
                                <td>{programPlanDetails?.plan?.slug}</td>
                              </tr>
                              <tr>
                                <td scope="row">Price in INR</td>
                                <td>
                                  <p className="d-flex gap-2">
                                    <del className="text-danger">
                                      ₹{programPlanDetails?.mrpInr}
                                    </del>

                                    <span className="text-info">
                                      ₹{programPlanDetails?.salePriceInr}
                                    </span>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td scope="row">Price in Dollar</td>
                                <td>
                                  <p className="d-flex gap-2">
                                    <del className="text-danger">
                                      ${programPlanDetails?.mrpDollar}
                                    </del>

                                    <span className="text-info">
                                      ${programPlanDetails?.salePriceDollar}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td scope="row">PT Sessions</td>
                                <td>{programPlanDetails?.ptSession} Session</td>
                              </tr>
                              <tr>
                                <td scope="row">Group Sessions</td>
                                <td>
                                  {programPlanDetails?.groupSession} Session
                                </td>
                              </tr>
                              <tr>
                                <td scope="row">Plan Duration (in Days)</td>
                                <td>{programPlanDetails?.planDuration} Days</td>
                              </tr>
                              <tr>
                                <td scope="row">Default Plan</td>
                                <td>
                                  {programPlanDetails?.isDefault == true ? (
                                    <span className="badge bg-success">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="badge bg-danger">No</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td scope="row">Cancellable Plan</td>
                                <td>
                                  {programPlanDetails?.isCancellable == true ? (
                                    <span className="badge bg-success">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="badge bg-danger">No</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td scope="row">Cancellation Period</td>
                                <td>
                                  {programPlanDetails?.cancellationPeriod} Days
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div
                          className="card card-body rounded shadow-none border-0"
                          style={{ background: "#fafafa", height: "100%" }}
                        >
                          <h6 className="mb-3">Features</h6>
                          <div
                            className="plan-features"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                programPlanDetails.features
                              ),
                            }}
                          ></div>
                        </div>
                      </div>
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
