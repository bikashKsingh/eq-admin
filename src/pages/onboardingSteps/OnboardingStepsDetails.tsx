import { GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export function OnboardingStepsDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [programDetails, setProgramDetails] = useState<any>({});
  const [programPlans, setProgramPlans] = useState<any>(null);

  // get program details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/programs/${id}`, true);
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
          `/programPLans?program=${id}&displayOrder=ASC`,
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
              <h4 className="font-weight-bold mb-0">Program Details</h4>
            </div>
            <div>
              <Link
                to={`/programPlans/add/${programDetails._id}`}
                type="button"
                className="btn btn-primary text-light"
              >
                Add Plan
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
                        src={programDetails?.defaultImage}
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-body mt-2 rounded py-2">
                  <h6 className="pt-2 text-center">{programDetails?.name}</h6>
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
                          <td className="py-3">{programDetails?.name}</td>
                        </tr>
                        <tr>
                          <td className="py-3">Slug</td>
                          <td className="py-3">{programDetails?.slug}</td>
                        </tr>
                        <tr>
                          <td className="py-3">Category</td>
                          <td className="py-3">
                            {programDetails?.category?.name}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Plans */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#programPlans"
                      aria-expanded="false"
                      aria-controls="programPlans"
                    >
                      Program Plans
                    </h5>

                    <button
                      className="btn btn-light p-2"
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
                    <div className="col-md-12">
                      <hr className="m-0 mb-3" />
                    </div>
                    <div className="px-3">
                      <div className="row gy-2 bg-light rounded py-2 mb-3">
                        {programPlans?.map((plan: any, i: number) => {
                          let bg = "#fff4e6";
                          if (i == 1) bg = "#e5ffe6";
                          if (i == 2) bg = "#fee9e4";
                          if (i == 3) bg = "#e5ffff";
                          return (
                            <div className="col-md-6">
                              <div
                                className="card card-body shadow-none rounded"
                                style={{ background: bg, border: 0 }}
                              >
                                <div className="d-flex justify-content-between mb-2">
                                  <div className="d-flex align-items-center">
                                    <h6 className="m-0">{plan?.plan?.name}</h6>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <Link
                                      className="p-2 bg-white rounded"
                                      to={{
                                        pathname: `/programPlans/edit/${plan._id}`,
                                      }}
                                    >
                                      <span
                                        className="fas fa-pencil-alt"
                                        aria-hidden="true"
                                      ></span>
                                    </Link>

                                    <Link
                                      className="p-2 bg-white rounded"
                                      to={{
                                        pathname: `/programPlans/details/${plan._id}`,
                                      }}
                                    >
                                      <span
                                        className="fas fa-eye text-warning"
                                        aria-hidden="true"
                                      ></span>
                                    </Link>

                                    <button className="btn p-2 bg-white rounded">
                                      <span
                                        className="fas fa-trash text-danger"
                                        aria-hidden="true"
                                      ></span>
                                    </button>
                                  </div>
                                </div>

                                <table
                                  className="table-striped-new"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  <tbody>
                                    <tr>
                                      <td>Price (INR)</td>
                                      <td className="d-flex gap-2">
                                        <del className="text-danger">
                                          ₹{plan?.mrpInr}
                                        </del>
                                        <span className="text-success">
                                          ₹{plan?.salePriceInr}
                                        </span>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>Price (Dollar)</td>
                                      <td className="d-flex gap-2">
                                        <del className="text-danger">
                                          ${plan?.mrpDollar}
                                        </del>
                                        <span className="text-success">
                                          ${plan?.salePriceDollar}
                                        </span>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>PT Sessions</td>
                                      <td className="d-flex gap-2">
                                        {plan?.ptSession} Session
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Group Sessions</td>
                                      <td className="d-flex gap-2">
                                        {plan?.groupSession} Session
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Plan Duration</td>
                                      <td className="d-flex gap-2">
                                        {plan?.planDuration} Days
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Default Plan</td>
                                      <td className="d-flex gap-2">
                                        {plan?.isDefault ? (
                                          <span className="text-success">
                                            Yes
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            No
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Cancellable</td>
                                      <td className="d-flex gap-2">
                                        {plan?.isCancellable ? (
                                          <span className="text-success">
                                            Yes
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            No
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Cancellation Period</td>
                                      <td className="d-flex gap-2">
                                        {plan?.cancellationPeriod} Days
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Status</td>
                                      <td className="d-flex gap-2">
                                        {plan?.status ? (
                                          <span className="text-success">
                                            Active
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            Disabled
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Description */}
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
                      Descriptions
                    </h5>
                    <button
                      className="btn btn-light p-2"
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
                    <div className="row">
                      <div className="col-md-12">
                        <div
                          className="rounded"
                          style={{ background: "#f6f4ff" }}
                        >
                          <div className="row">
                            <div className="col-md-4 py-3">
                              <div
                                className="card card-body shadow-none border-0 bg-transparent border-end py-0"
                                style={{ height: "100%" }}
                              >
                                <h6 className="mb-2">About Program</h6>
                                <hr
                                  className="m-0 p-0 mb-3 border-2"
                                  style={{ width: 100 }}
                                />
                                <div
                                  className=""
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      programDetails.descriptions
                                    ),
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="col-md-4 py-3">
                              <div
                                className="card card-body shadow-none border-0 bg-transparent border-end py-0"
                                style={{ height: "100%" }}
                              >
                                <h6 className="mb-3">Program Highlights</h6>
                                <hr
                                  className="m-0 p-0 mb-3 border-2"
                                  style={{ width: 100 }}
                                />
                                <div
                                  className=""
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      programDetails.highlights
                                    ),
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="col-md-4 py-3">
                              <div
                                className="card card-body shadow-none border-0 bg-transparent py-0"
                                style={{ height: "100%" }}
                              >
                                <h6 className="mb-3">Program Requirements</h6>
                                <hr
                                  className="m-0 p-0 mb-3 border-2"
                                  style={{ width: 100 }}
                                />
                                <ol>
                                  {programDetails?.requirements?.map(
                                    (item: any) => {
                                      return <li>{item.title}</li>;
                                    }
                                  )}
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-12">
                        <div
                          className="card card-body rounded shadow-none border-0"
                          style={{ background: "#fafafa" }}
                        >
                          <h6 className="mb-3">Program Benifits</h6>
                          <div
                            className="program-benifits"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                programDetails.benefits
                              ),
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-12">
                        <div
                          className="card card-body rounded shadow-none border-0"
                          style={{ background: "#fff4e6" }}
                        >
                          <h6 className="mb-3">How does it works?</h6>
                          <div
                            className=""
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                programDetails.howItWorks
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

          {/* Program FAQs */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#programFaqs"
                      aria-expanded="false"
                      aria-controls="programFaqs"
                    >
                      Program FAQs
                    </h5>
                    <button
                      className="btn btn-light p-2"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#programFaqs"
                      aria-expanded="false"
                      aria-controls="programFaqs"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2" id="programFaqs">
                    <div className="p-2 mb-3">
                      {programDetails?.faqs?.map((faq: any, index: number) => {
                        return (
                          <div
                            className="card card-body rounded shadow-none border-0 mb-2"
                            style={{ background: "#fafafa" }}
                          >
                            <h6 className="mb-3">{`${++index}) ${
                              faq.question
                            }`}</h6>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(faq.answer),
                              }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* META Details */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#metaDetails"
                      aria-expanded="false"
                      aria-controls="metaDetails"
                    >
                      META Details
                    </h5>
                    <button
                      className="btn btn-light p-2"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#metaDetails"
                      aria-expanded="false"
                      aria-controls="metaDetails"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2" id="metaDetails">
                    <div className=" shadow-none p-2 mb-3">
                      <div
                        className="card card-body rounded shadow-none border-0"
                        style={{ background: "#fff4e6" }}
                      >
                        <h6>META Title</h6>
                        <p>{programDetails.metaTitle}</p>
                      </div>

                      <div
                        className="card card-body rounded shadow-none border-0 mt-2"
                        style={{ background: "#fff4e6" }}
                      >
                        <h6>META Description</h6>
                        <p>{programDetails.metaDescription}</p>
                      </div>

                      <div
                        className="card card-body rounded shadow-none border-0 mt-2"
                        style={{ background: "#fff4e6" }}
                      >
                        <h6>META Keywords</h6>
                        <p>{programDetails.metaKeywords}</p>
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
