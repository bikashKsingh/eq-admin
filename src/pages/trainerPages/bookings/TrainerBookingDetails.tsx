import {
  CustomSelect,
  GoBackButton,
  OverlayLoading,
} from "../../../components";
import { useEffect, useState } from "react";
import { get, post, put, remove } from "../../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

export function TrainerBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [userBooking, setUserBooking] = useState<any>(null);
  const [trainers, setTrainers] = useState<any>();
  const [selectedTrainer, setSelectedTrainer] = useState<any>();
  const [trainerAssigning, setTrainerAssigning] = useState<boolean>(true);
  const [needReload, setNeedReload] = useState<boolean>(false);

  // get program plan details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/bookings/trainersBooking/${id}`, true);
        if (apiResponse?.status == 200) {
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
      const apiResponse = await get(`/trainers`, true);
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

          {/* User & Session Details */}
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
                      User & Session Details
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
                                <td>{userBooking?.name}</td>
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
                          <h5 className="">Session Details</h5>
                        </div>
                        <div
                          className="card card-body shadow-none rounded"
                          style={{
                            background: "#fafafa",
                            border: 0,
                            height: "100%",
                          }}
                        >
                          {/* need content */}
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
