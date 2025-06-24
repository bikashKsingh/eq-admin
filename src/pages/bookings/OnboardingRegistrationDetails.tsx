import { CustomSelect, GoBackButton, OverlayLoading } from "../../components";

import { useEffect, useState } from "react";
import { get, post, put, remove } from "../../utills";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import DOMPurify from "dompurify";

export function OnboardingRegistrationDetails() {
  const navigate = useNavigate();
  const { bookingId, userId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [onboardingRegDetails, setOnboardingRegDetails] = useState<any>(null);

  // get booking onboarding details
  useEffect(
    function () {
      async function getData(bookingId: string) {
        setLoading(true);
        const apiResponse = await get(`/bookings/${bookingId}`, true);
        if (apiResponse?.status == 200) {
          setBookingDetails(apiResponse?.body);
        }
        setLoading(false);
      }
      if (bookingId) getData(bookingId);
    },
    [bookingId]
  );

  // get onboarding registration details
  useEffect(
    function () {
      async function getData(userId: string) {
        setLoading(true);
        const apiResponse = await get(
          `/onboardingRegistrations?user=${userId}`,
          true
        );
        if (apiResponse?.status == 200) {
          if (apiResponse?.body?.length) {
            setOnboardingRegDetails(apiResponse?.body[0]);
          }
        }

        setLoading(false);
      }
      if (userId) getData(userId);
    },
    [userId]
  );

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">
                Onboarding Registration Details
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
                        to={`/bookings/edit/${bookingId}`}
                      >
                        <i className="ti-pencil-alt"></i> Update Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Registration Details */}
          <div className="col-md-12">
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-2 cursor-hand"
                      data-bs-toggle="collapse"
                      data-bs-target="#onboardingRegistration"
                      aria-expanded="false"
                      aria-controls="onboardingRegistration"
                    >
                      Onboarding Registration Details
                    </h5>
                    <button
                      className="btn btn-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#onboardingRegistration"
                      aria-expanded="false"
                      aria-controls="onboardingRegistration"
                    >
                      <i className="fa fa-angle-down text-primary" />
                    </button>
                  </div>

                  <div
                    className="collapse mt-2 show"
                    id="onboardingRegistration"
                  >
                    <div className="p-2 mb-1 row pb-1">
                      <div
                        key={onboardingRegDetails?._id}
                        className="card card-body shadow-none rounded"
                        style={{
                          background: "#fee9e4",
                          border: 0,
                          height: "100%",
                        }}
                      >
                        {/* Content */}

                        <table
                          className="table-striped-new"
                          style={{ fontSize: "0.875rem" }}
                        >
                          <tbody>
                            <tr>
                              <td scope="row">Name</td>
                              <td>
                                {onboardingRegDetails?.firstName
                                  ? `${onboardingRegDetails?.firstName} ${onboardingRegDetails?.lastName}`
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Email</td>
                              <td>{onboardingRegDetails?.email || "N/A"}</td>
                            </tr>
                            <tr>
                              <td scope="row">Mobile</td>
                              <td>
                                {onboardingRegDetails?.mobile
                                  ? `${onboardingRegDetails?.countryCode}-${onboardingRegDetails?.mobile}`
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Location</td>
                              <td>{onboardingRegDetails?.location || "N/A"}</td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Month-Year of Joining EQ for the first time
                              </td>
                              <td>{onboardingRegDetails?.location || "N/A"}</td>
                            </tr>
                            <tr>
                              <td scope="row">Date of birth</td>
                              <td>{onboardingRegDetails?.dob || "N/A"}</td>
                            </tr>
                            <tr>
                              <td scope="row">Height (Ft)</td>
                              <td>{onboardingRegDetails?.height || "N/A"}</td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Weight (kg) at the time of joining EQ
                              </td>
                              <td>
                                {onboardingRegDetails?.weightAtJoining || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Current weight (kg)</td>
                              <td>
                                {onboardingRegDetails?.currentWeight || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Occupation</td>
                              <td>
                                {onboardingRegDetails?.occupation || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                What is the program you have signed up for?
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  {onboardingRegDetails?.program?.name
                                    ? `${onboardingRegDetails?.program?.name} - ${onboardingRegDetails?.plan?.name}`
                                    : "N/A"}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                What all options describe you the best? Check
                                top 3 that apply?
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  {onboardingRegDetails?.preferences?.map(
                                    (item: any) => {
                                      return (
                                        <span className="badge bg-info">
                                          {item}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Any existing Health issues(PCOS, Thyroid,
                                Allergies, Digestive issues etc.)/Surgeries in
                                past/Injuries in past/ Stress, Anxiety or
                                Depression
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.existingHealthIssues ||
                                  "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Are you currently on any medication
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.currentMedication ||
                                  "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Were you ever detected with Covid
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.covidDetected == true
                                    ? "Yes"
                                    : "No"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Gender</td>
                              <td>{`${
                                onboardingRegDetails?.gender || "N/A"
                              }`}</td>
                            </tr>
                            <tr>
                              <td scope="row">Workout frequency</td>
                              <td>
                                {`${
                                  onboardingRegDetails?.workoutFrequency ||
                                  "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Favorite workout format</td>
                              <td>
                                <div className="d-flex gap-1">
                                  {onboardingRegDetails?.favoriteWorkouts?.map(
                                    (item: any) => {
                                      return (
                                        <span className="badge bg-info">
                                          {item}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">Fitness Goal</td>
                              <td>
                                <div className="d-flex gap-1">
                                  {onboardingRegDetails?.fitnessGoals?.map(
                                    (item: any) => {
                                      return (
                                        <span className="badge bg-info">
                                          {item}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td scope="row">Food Choices</td>
                              <td>{`${
                                onboardingRegDetails?.foodChoice || "N/A"
                              }`}</td>
                            </tr>
                            <tr>
                              <td scope="row">Any Food Allergies</td>
                              <td>
                                {`${
                                  onboardingRegDetails?.foodAllergies || "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                What is the frequency of egg and non-veg per
                                week
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.eggAndNonVegFrequency ||
                                  "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                What is the frequency of eating
                                outside/junk/sugar/stress eating
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.junkSugarStressFrequency ||
                                  "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                How much water you consume in a day
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.dailyWaterConsumption ||
                                  "N/A"
                                }`}
                              </td>
                            </tr>

                            <tr>
                              <td scope="row">
                                What beverage do you prefer the most on a daily
                                basis
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  {onboardingRegDetails?.dailyBeverage?.map(
                                    (item: any) => {
                                      return (
                                        <span className="badge bg-info">
                                          {item}
                                        </span>
                                      );
                                    }
                                  )}
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td scope="row">Do you smoke</td>
                              <td>{`${
                                onboardingRegDetails?.smoke || "N/A"
                              }`}</td>
                            </tr>
                            <tr>
                              <td scope="row">Do you consume Alcohol</td>
                              <td>{`${
                                onboardingRegDetails?.alcohol || "N/A"
                              }`}</td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Anything specific would you like us to know
                              </td>
                              <td>
                                {`${
                                  onboardingRegDetails?.personalNotes || "N/A"
                                }`}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                Are you on Instagram? If yes, please share your
                                Instagram Id so that we can tag you in your
                                progress pictures :
                              </td>
                              <td>{`${
                                onboardingRegDetails?.instagramId || "N/A"
                              }`}</td>
                            </tr>
                            <tr>
                              <td scope="row">
                                How did you get to know about us?
                              </td>
                              <td>{`${
                                onboardingRegDetails?.sourceChanel || "N/A"
                              }`}</td>
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
        </div>
      )}
    </div>
  );
}
