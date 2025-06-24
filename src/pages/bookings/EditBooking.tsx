import {
  CustomSelect,
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  bookingSchema,
  BookingValues,
  bookingInitialValues,
} from "../../validationSchemas/bookingSchema";
import React, { useEffect, useState } from "react";
import { get, post, put } from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export function EditBooking() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [trainers, setTrainers] = useState([]);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    setValues,
  } = useFormik({
    onSubmit: async function (
      values: BookingValues,
      helpers: FormikHelpers<BookingValues>
    ) {
      setLoading(true);

      const newValue = {
        ...values,
        trainer: values?.trainer?.value,
      };

      const apiResponse = await put(`/bookings/${id}`, newValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: bookingInitialValues,
    validationSchema: bookingSchema,
  });

  // get booking details
  useEffect(function () {
    async function getData() {
      const apiResponse = await get(`/bookings/${id}`, true);
      if (apiResponse?.status == 200) {
        let trainer = apiResponse?.body?.trainer;
        let bookingStatus = apiResponse?.body?.bookingStatus;
        let activationDate = apiResponse?.body?.activationDate;

        let value: any = { bookingStatus };
        if (trainer) {
          value.trainer = {
            label: trainer?.name,
            value: trainer?._id,
          };
        }
        if (activationDate) {
          value.activationDate = moment(activationDate).format("YYYY-MM-DD");
        }
        setValues(value);
      }
    }

    getData();
  }, []);

  // get trainer
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/trainers", true);
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

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Edit Booking</h4>
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

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card rounded-2">
            <div className="card-body">
              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Activation Date"
                      name="activationDate"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="date"
                      placeholder=""
                      value={values.activationDate}
                      required={false}
                      touched={touched.activationDate}
                      error={errors.activationDate}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Program Trainer"
                      placeholder="Select Trainer"
                      name="selectedTrainer"
                      required={true}
                      options={trainers}
                      value={values.trainer}
                      error={""}
                      touched={false}
                      handleChange={(value) => {
                        setFieldValue("trainer", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("trainer", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="">Status</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="bookingStatus"
                          id="booked"
                          value={"BOOKED"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.bookingStatus == "BOOKED"}
                        />
                        <label htmlFor="booked" className="mt-2">
                          Booked
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="bookingStatus"
                          id="cancel"
                          value={"CANCELLED"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.bookingStatus == "CANCELLED"}
                        />
                        <label htmlFor="cancel" className="mt-2">
                          Cancel
                        </label>
                      </div>

                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="bookingStatus"
                          id="active"
                          value={"ACTIVE"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.bookingStatus == "ACTIVE"}
                        />
                        <label htmlFor="active" className="mt-2">
                          Active
                        </label>
                      </div>
                    </div>
                    {errors.bookingStatus && touched.bookingStatus ? (
                      <p className="custom-form-error text-danger">
                        {errors.bookingStatus}
                      </p>
                    ) : null}
                  </div>
                </div>

                <SubmitButton loading={false} text="Update Booking" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
