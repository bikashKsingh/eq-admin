import { CustomSelect, GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, put, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { Spinner } from "../../components/ui/Spinner";

export function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [userBooking, setUserBooking] = useState<any>(null);
  const [trainers, setTrainers] = useState<any>();
  const [selectedTrainer, setSelectedTrainer] = useState<any>();
  const [trainerAssigning, setTrainerAssigning] = useState<boolean>(true);
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [onboardingRegDetails, setOnboardingRegDetails] = useState<any>(null);
  const [onboardingSteps, setOnboardingSteps] = useState<any[] | null>(null);
  const [onboardingRegLoading, setOnboardingRegLoading] =
    useState<boolean>(false);
  // get program plan details

  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/bookings/${id}`, true);
        if (apiResponse?.status == 200) {
          setOnboardingSteps(apiResponse?.body?.onboardingSteps);
          setUserBooking(apiResponse?.body);
        }
        setLoading(false);
      }
      if (id) getData(id);
    },
    [id]
  );

  // get trainers
  useEffect(function () {
    async function getData() {
      const apiResponse = await get(`/trainers?limit=0&status=true`, true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setTrainers(modifiedValue);
      }
    }
    getData();
  }, []);

  async function handleAssignTrainer() {
    if (!selectedTrainer?.value) {
      toast.error("Please select the trainer");
      return;
    }
    setTrainerAssigning(true);

    const apiResponse = await put(`/bookings/assignTrainer/${id}`, {
      trainer: selectedTrainer.value,
    });

    if (apiResponse?.status == 200) {
      toast.success(apiResponse?.message);
      document.getElementById("assignTrainerCloseBtn")?.click();
      setNeedReload(!needReload);
    } else {
      toast.error(apiResponse?.message);
    }
    setTrainerAssigning(false);
  }

  // get onboarding registration details
  useEffect(
    function () {
      async function getData(id: string) {
        setOnboardingRegLoading(true);
        const apiResponse = await get(
          `/onboardingRegistrations?booking=${id}`,
          true
        );
        if (apiResponse?.status == 200) {
          if (apiResponse?.body?.length) {
            setOnboardingRegDetails(apiResponse?.body[0]);
          }
        }
        setOnboardingRegLoading(false);
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
              <h4 className="font-weight-bold mb-0">Booking Plan Details</h4>
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
          {/* <div className="col-md-12 ">
            <div className="row gy-2">
              <div className="col-md-4">
                <div className="card rounded-2">
                  <div className="card-body p-0">
                    <div className="text-center">
                      <img
                        className="img-fluid rounded"
                        style={{
                          maxHeight: 200,
                        }}
                        src={userBooking?.program?.defaultImage}
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-body mt-2 rounded py-2">
                  <h6 className="pt-2 text-center">
                    {userBooking?.program?.name}
                  </h6>
                </div>
              </div>

              
            </div>
          </div> */}

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
                      src={userBooking?.program?.defaultImage}
                    />
                  </div>
                  <div className="">
                    <h4 className="mb-2">{userBooking?.program?.name}</h4>
                    <p>
                      {userBooking?.plan?.name} | {userBooking?.planDuration}
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
                        {userBooking?.bookingStatus == "BOOKED" ? (
                          <span className="badge bg-info">Booked</span>
                        ) : userBooking?.bookingStatus == "CANCELLED" ? (
                          <span className="badge bg-danger">Cancelled</span>
                        ) : userBooking?.bookingStatus == "ACTIVE" ? (
                          <span className="badge bg-success">Active</span>
                        ) : userBooking?.bookingStatus == "EXPIRED" ? (
                          <span className="badge bg-warning">Expired</span>
                        ) : null}
                      </p>
                    </div>

                    <div className="col-md-3">
                      <h6>Booking Date</h6>
                      <p>
                        {moment(userBooking?.createdAt).format("DD-MM-YYYY")}
                      </p>
                    </div>

                    <div className="col-md-3">
                      <h6>Activition Date</h6>
                      <p>
                        {userBooking?.activatioDate
                          ? moment(userBooking?.activatioDate).format(
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
                  <div className="row">
                    <div className="col-md-12 mt-3 d-flex gap-2">
                      <Link
                        className={`btn ${
                          userBooking?.isOnboardingCompleted
                            ? "btn-info text-light"
                            : "btn-warning"
                        } p-2`}
                        to={`/bookings/onboardingDetails/${id}`}
                      >
                        <i
                          className={
                            userBooking?.isOnboardingCompleted
                              ? "fa fa-check-circle"
                              : "fas fa-exclamation-circle"
                          }
                        ></i>{" "}
                        Onboarding Steps
                      </Link>

                      {onboardingRegLoading ? (
                        <Link className={`btn`} to={`#`}>
                          <Spinner />
                        </Link>
                      ) : (
                        <Link
                          className={`btn ${
                            onboardingRegDetails
                              ? "btn-info text-light"
                              : "btn-warning"
                          } p-2`}
                          to={`/bookings/onboardingRegistrationDetails/${id}/${userBooking?.user?._id}`}
                        >
                          <i
                            className={`${
                              onboardingRegDetails
                                ? "fa fa-check-circle"
                                : "fas fa-exclamation-circle"
                            }`}
                          ></i>{" "}
                          Onboarding Registration
                        </Link>
                      )}
                    </div>
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
                      data-bs-target="#planDetails"
                      aria-expanded="false"
                      aria-controls="planDetails"
                    >
                      Plan Details
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#planDetails"
                      aria-expanded="false"
                      aria-controls="planDetails"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse mt-2 show" id="planDetails">
                    <div className="p-2 mb-3 row pb-4">
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
                              <td>{userBooking?.plan?.name}</td>
                            </tr>
                            <tr>
                              <td scope="row">PT Sessions</td>
                              <td>{userBooking?.ptSession} Session</td>
                            </tr>
                            <tr>
                              <td scope="row">Group Sessions</td>
                              <td>{userBooking?.groupSession} Session</td>
                            </tr>
                            <tr>
                              <td scope="row">Plan Duration (in Days)</td>
                              <td>{userBooking?.planDuration} Days</td>
                            </tr>
                            <tr>
                              <td scope="row">Plan Booking Date</td>
                              <td>
                                {moment(userBooking?.createdAt).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Plan Activation Date</td>
                              <td>
                                {userBooking?.activatioDate
                                  ? moment(userBooking?.activatioDate).format(
                                      "DD-MM-YYYY"
                                    )
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Booking Status</td>
                              <td>
                                {userBooking?.bookingStatus == "BOOKED" ? (
                                  <span className="badge bg-info">Booked</span>
                                ) : userBooking?.bookingStatus ==
                                  "CANCELLED" ? (
                                  <span className="badge bg-danger">
                                    Cancelled
                                  </span>
                                ) : userBooking?.bookingStatus == "ACTIVE" ? (
                                  <span className="badge bg-success">
                                    Active
                                  </span>
                                ) : userBooking?.bookingStatus == "EXPIRED" ? (
                                  <span className="badge bg-warning">
                                    Expired
                                  </span>
                                ) : null}
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
          </div>

          {/* User & Trainer Details */}
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
                      User & Trainer Details
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
                    <div className="p-2 mb-3 row pb-4">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <h5 className="">User Details</h5>
                        </div>
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
                                <td>{`${userBooking?.firstName} ${userBooking?.lastName}`}</td>
                              </tr>
                              <tr>
                                <td scope="row">Mobile</td>
                                <td>{userBooking?.mobile}</td>
                              </tr>

                              <tr>
                                <td scope="row">Email</td>
                                <td>{userBooking?.email}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-2">
                          <h5 className="">Trainer Details</h5>
                          <button
                            className="btn btn-dark p-2"
                            data-bs-toggle="modal"
                            data-bs-target="#assignTrainer"
                          >
                            {userBooking?.trainer
                              ? "Change Trainer"
                              : "Assign Trainer"}
                          </button>
                        </div>
                        <div
                          className="card card-body shadow-none rounded"
                          style={{
                            background: "#fafafa",
                            border: 0,
                            height: "100%",
                          }}
                        >
                          {userBooking?.trainer ? (
                            <div className="text-center">
                              <img
                                className="img"
                                style={{
                                  height: 80,
                                  width: 80,
                                  borderRadius: 40,
                                  border: "4px solid green",
                                }}
                                src={userBooking?.trainer?.profilePhoto}
                              />

                              <h6 className="px-0 pt-2">
                                {userBooking?.trainer?.name}
                              </h6>
                              {/* <p>{`${userDetails?.address}, ${userDetails?.locality}, ${userDetails?.city}, ${userDetails?.state}, ${userDetails?.pincode}, ${userDetails?.country}`}</p> */}
                              <div className="d-flex gap-2 justify-content-center mt-3">
                                <Link
                                  to={`tel:${userBooking?.trainer?.mobile}`}
                                  className="btn btn-info text-light py-2"
                                >
                                  <i className="fa fa-phone"></i>
                                </Link>

                                <Link
                                  to={`mailto:${userBooking?.trainer?.email}`}
                                  className="btn btn-danger text-light py-2"
                                >
                                  <i className="fa fa-envelope"></i>
                                </Link>
                              </div>
                              <div className="mt-2">
                                <Link
                                  to={`/trainers/details/${userBooking?.trainer?._id}`}
                                  className="btn btn-dark p-2"
                                >
                                  View Profile
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-center">
                              <div className="text-center">
                                <i
                                  className="ti-face-sad"
                                  style={{ fontSize: "50px" }}
                                ></i>
                                <p className="p-2">Trainer not Assigned Yet</p>
                                <button
                                  className="btn btn-dark p-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#assignTrainer"
                                >
                                  Assign Trainer
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Slot Details */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#slotSection"
                      aria-expanded="false"
                      aria-controls="slotSection"
                    >
                      Booked Slot Details
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#slotSection"
                      aria-expanded="false"
                      aria-controls="slotSection"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse show" id="slotSection">
                    <div className="p-2 row">
                      <div className="col-md-12">
                        <p>
                          {userBooking?.bookingTimeSlot ? (
                            <div className="row">
                              <div className="col-md-12">
                                <span className="badge bg-success">
                                  {userBooking?.bookingTimeSlot?.title}
                                </span>
                              </div>

                              <div className="col-md-6">
                                <ul className="mt-2 list-group">
                                  {userBooking?.bookingTimeSlot?.monday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      MONDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.mondayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}

                                  {userBooking?.bookingTimeSlot?.tuesday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      TUESDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.tuesdayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}

                                  {userBooking?.bookingTimeSlot?.wednesday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      WEDNESDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.wednesdayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}

                                  {userBooking?.bookingTimeSlot?.thursday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      THURSDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.thursdayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}

                                  {userBooking?.bookingTimeSlot?.friday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      FRIDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.fridayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}

                                  {userBooking?.bookingTimeSlot?.saturday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      SATURDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.saturdayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}

                                  {userBooking?.bookingTimeSlot?.sunday ? (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                      SUNDAY
                                      <span className="badge bg-primary rounded-pill">
                                        {moment(
                                          userBooking?.bookingTimeSlot
                                            ?.sundayTime,
                                          "h:mm: a"
                                        ).format("h:mm A")}
                                      </span>
                                    </li>
                                  ) : null}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendly Booking */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#eventBookingDetails"
                      aria-expanded="false"
                      aria-controls="eventBookingDetails"
                    >
                      Calendly Booking
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#eventBookingDetails"
                      aria-expanded="false"
                      aria-controls="eventBookingDetails"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse show" id="eventBookingDetails">
                    <div className="p-2 row">
                      <div className="col-md-12">
                        <p>
                          {onboardingSteps?.map((item) => {
                            return item.eventName ? (
                              <div className="row">
                                <div
                                  className="col-md-6"
                                  style={{
                                    background: "#fee9e4",
                                    padding: "10px",
                                    marginBottom: "5px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <h6 className="ms-2 mb-3">
                                    <span
                                      className="badge bg-success"
                                      style={{ fontSize: "13px" }}
                                    >
                                      {item.eventName}
                                    </span>
                                  </h6>

                                  <p className="ms-2 d-flex gap-2">
                                    <span>Start Time : </span>
                                    <span className="badge bg-light text-info">
                                      <i className="ti-calendar"></i>{" "}
                                      {moment(item.startTime).format(
                                        "DD-MMM-YYYY"
                                      )}
                                    </span>

                                    <span className="badge bg-light text-info">
                                      <i className="ti-timer"></i>{" "}
                                      {moment(item.startTime).format("HH:mm A")}
                                    </span>
                                  </p>
                                  <p className="ms-2 d-flex gap-2">
                                    <span>End Time : </span>

                                    <span className="badge bg-light text-info">
                                      <i className="ti-calendar"></i>{" "}
                                      {moment(item.endTime).format(
                                        "DD-MMM-YYYY"
                                      )}
                                    </span>
                                    <span className="badge bg-light text-info">
                                      <i className="ti-timer"></i>{" "}
                                      {moment(item.endTime).format("HH:mm A")}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#invoiceSection"
                      aria-expanded="false"
                      aria-controls="invoiceSection"
                    >
                      Invoice
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#invoiceSection"
                      aria-expanded="false"
                      aria-controls="invoiceSection"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div className="collapse" id="invoiceSection">
                    <div className="p-2 row">
                      <div className="col-md-12">
                        <div className="text-center">
                          <h3>Invoice</h3>
                          <p className="p-0 m-0">Invoice No: </p>
                          <p className="p-0 m-0">Invoice Date: </p>
                        </div>

                        <div className="d-flex justify-content-between">
                          {/* Invoice  To */}
                          <div className="">
                            <h6 className="text-success">Invoice to</h6>
                            <h4 className="p-0 m-0">{userBooking?.name}</h4>
                            <p className="p-0 m-0">{userBooking?.mobile}</p>
                            <p className="p-0 m-0">{userBooking?.email}</p>
                          </div>
                          {/* Invoice  From */}
                          <div className="">
                            <h6 className="text-success">Invoice From</h6>
                            <h4 className="p-0 m-0">
                              Equilibrium - Mind and Yoga
                            </h4>
                            <p className="p-0 m-0">
                              Mumbai, Maharashtra, India
                            </p>
                          </div>
                        </div>
                        <div
                          className="card card-body shadow-none rounded mt-4"
                          style={{
                            background: "#fee9e4",
                            border: 0,
                          }}
                        >
                          <table
                            className="table-striped-new"
                            style={{ fontSize: "0.875rem" }}
                          >
                            <thead>
                              <tr>
                                <th>SN</th>
                                <th>PROGRAM</th>
                                <th>PLAN</th>
                                <th>PRICE</th>
                                <th>QTY</th>
                                <th>TOTAL</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td>#1</td>
                                <td>{userBooking?.program?.name}</td>
                                <td>{userBooking?.plan?.name}</td>
                                <td>{userBooking?.plan?.name}</td>
                                <td>{1}</td>
                                <td>{userBooking?.subtotalAmount}</td>
                              </tr>

                              {userBooking?.couponCode ? (
                                <tr>
                                  <td colSpan={3}></td>
                                  <td colSpan={2}>
                                    <p>Coupon Discount Amount</p>
                                    <p> {userBooking?.couponCode} </p>
                                  </td>
                                  <td>{-userBooking?.couponDiscountAmount}</td>
                                </tr>
                              ) : null}

                              {userBooking?.subscriptionDiscountAmount ? (
                                <tr>
                                  <td colSpan={3}></td>
                                  <td colSpan={2}>
                                    Subscription Discount Amount (
                                    {`${userBooking?.subscriptionDiscountPercentage}%`}
                                    )
                                  </td>
                                  <td>
                                    {-userBooking?.subscriptionDiscountAmount}
                                  </td>
                                </tr>
                              ) : null}

                              <tr>
                                <td colSpan={3}></td>
                                <td colSpan={2}>GST</td>
                                <td>{"N/A"}</td>
                              </tr>

                              <tr>
                                <td colSpan={3}></td>
                                <td colSpan={2}>
                                  <strong className="text-success">
                                    Total Amount
                                  </strong>
                                </td>
                                <td>
                                  <strong className="text-success">
                                    {userBooking?.totalAmount}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="d-flex justify-content-between mt-4 pt-3">
                          {/* Contact Us */}
                          <div className="">
                            <h6 className="text-success">Contact Us</h6>
                            <p className="p-0 m-0">
                              Equilibrium - Mind and Yoga
                            </p>
                            <p className="p-0 m-0">
                              Mumbai, Maharashtra, India
                            </p>
                            <p className="p-0 m-0">
                              <i className="fa fa-phone"></i> 9117162463
                            </p>
                            <p className="p-0 m-0">
                              <i className="fa fa-envelope"></i>{" "}
                              bikash.estaglobal@gmail.com
                            </p>
                          </div>

                          {/* Payment Info */}
                          <div className="">
                            <h6>Payment Info</h6>
                            <p></p>
                            <p></p>
                            <p></p>
                          </div>
                        </div>

                        <p className="text-center mt-4">
                          <strong>Notice</strong> : Lorem, ipsum dolor sit amet
                          consectetur adipisicing elit. Hic, sunt.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="modal fade"
        id="assignTrainer"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="assignTrainerLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="assignTrainerLabel">
                Assign Trainer to Plan
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <CustomSelect
                  label="Program Trainer"
                  placeholder="Select Trainer"
                  name="selectedTrainer"
                  required={true}
                  options={trainers}
                  value={selectedTrainer}
                  error={""}
                  touched={false}
                  handleChange={(value) => {
                    setSelectedTrainer(value);
                  }}
                  handleBlur={() => {}}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary p-2"
                data-bs-dismiss="modal"
                id="assignTrainerCloseBtn"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary p-2"
                onClick={handleAssignTrainer}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
