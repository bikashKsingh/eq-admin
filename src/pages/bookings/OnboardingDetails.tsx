import { CustomSelect, GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, put, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import DOMPurify from "dompurify";

export function OnboardingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // get booking onboarding details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/bookings/${id}`, true);
        if (apiResponse?.status == 200) {
          setBookingDetails(apiResponse?.body);
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
              <h4 className="font-weight-bold mb-0">
                Onboarding Steps Details
              </h4>
            </div>
            {/* <div>
              <Link
                to={`/programPlans/edit/${id}`}
                type="button"
                className="btn btn-primary text-light"
              >
                Edit Plan
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {loading ? (
        <OverlayLoading />
      ) : (
        <div className="row">
          <div className="col-md-12">
            <div
              className="card rounded-2"
              style={{
                background: "#fee9e4",
              }}
            >
              <div className="card-body table-responsive">
                <div className="d-flex gap-3">
                  <div className="">
                    <img
                      className="img-fluid rounded"
                      style={{
                        maxHeight: 50,
                      }}
                      src={bookingDetails?.program?.defaultImage}
                    />
                  </div>
                  <div className="">
                    <h4 className="mb-2">{bookingDetails?.program?.name}</h4>
                    <p>
                      {bookingDetails?.plan?.name} |{" "}
                      {bookingDetails?.planDuration}
                      Days
                    </p>
                  </div>
                </div>

                <div
                  className="card card-body shadow-none rounded border-0"
                  style={{
                    background: "#fee9e4",
                  }}
                >
                  <div className="row">
                    <div className="col-md-3">
                      <h6>Booking Status</h6>
                      <p>
                        {bookingDetails?.bookingStatus == "BOOKED" ? (
                          <span className="badge bg-info">Booked</span>
                        ) : bookingDetails?.bookingStatus == "CANCELLED" ? (
                          <span className="badge bg-danger">Cancelled</span>
                        ) : bookingDetails?.bookingStatus == "ACTIVE" ? (
                          <span className="badge bg-success">Active</span>
                        ) : bookingDetails?.bookingStatus == "EXPIRED" ? (
                          <span className="badge bg-warning">Expired</span>
                        ) : null}
                      </p>
                    </div>

                    <div className="col-md-3">
                      <h6>Booking Date</h6>
                      <p>
                        {moment(bookingDetails?.createdAt).format("DD-MM-YYYY")}
                      </p>
                    </div>

                    <div className="col-md-3">
                      <h6>Activition Date</h6>
                      <p>
                        {bookingDetails?.activatioDate
                          ? moment(bookingDetails?.activatioDate).format(
                              "DD-MM-YYYY"
                            )
                          : "N/A"}
                      </p>
                    </div>

                    <div className="col-md-3">
                      <Link
                        className="btn btn-dark p-2"
                        to={`/bookings/edit/${id}`}
                      >
                        <i className="ti-pencil-alt"></i> Update Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Steps Details */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#bookingDetails"
                      aria-expanded="false"
                      aria-controls="bookingDetails"
                    >
                      Onboarding Steps Details
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#bookingDetails"
                      aria-expanded="false"
                      aria-controls="bookingDetails"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2 show" id="bookingDetails">
                    {bookingDetails?.onboardingSteps?.map((item: any) => {
                      return (
                        <div className="p-2 mb-1 row pb-1">
                          <div
                            key={item._id}
                            className="card card-body shadow-none rounded"
                            style={{
                              background: "#fee9e4",
                              border: 0,
                              height: "100%",
                            }}
                          >
                            {/* Content */}
                            <h6>{item.title}</h6>

                            {/* <div
                              className=""
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(item.content),
                              }}
                            /> */}

                            <div className="">
                              {item?.isCompleted == true ? (
                                <span className="badge bg-info rounded">
                                  <i className="fa fa-check-circle"></i>{" "}
                                  Completed
                                </span>
                              ) : (
                                <span className="badge bg-danger rounded">
                                  <i className="fas fa-exclamation-circle"></i>{" "}
                                  Pending
                                </span>
                              )}
                            </div>
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
      )}
    </div>
  );
}
