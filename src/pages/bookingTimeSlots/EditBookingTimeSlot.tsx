import {
  CustomSelect,
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  bookingTimeSlotSchema,
  BookingTimeSlotValues,
  bookingTimeSlotInitialValues,
} from "../../validationSchemas/bookingTimeSlotSchema";
import { useEffect, useState } from "react";
import { get, put, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditBookingTimeSlot() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [updading, setUpdating] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    onSubmit: async function (
      values: BookingTimeSlotValues,
      helpers: FormikHelpers<BookingTimeSlotValues>
    ) {
      setUpdating(true);

      let updatedValues = {
        ...values,
        categories: values?.categories?.map((item) => {
          return item.value;
        }),
      };

      const apiResponse = await put(`/bookingTimeSlots/${id}`, updatedValues);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: bookingTimeSlotInitialValues,
    validationSchema: bookingTimeSlotSchema,
  });

  // Get Categories
  useEffect(function () {
    async function getData() {
      let url = `/categories`;
      const apiResponse = await get(url, true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setCategories(modifiedValue);
      }
    }
    getData();
  }, []);

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        let url = `/bookingTimeSlots/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          apiData.status = `${apiData.status}`;
          apiData.monday = `${apiData.monday}`;
          apiData.tuesday = `${apiData.tuesday}`;
          apiData.wednesday = `${apiData.wednesday}`;
          apiData.thursday = `${apiData.thursday}`;
          apiData.friday = `${apiData.friday}`;
          apiData.saturday = `${apiData.saturday}`;
          apiData.sunday = `${apiData.sunday}`;

          if (apiData?.categories?.length) {
            apiData.categories = apiData?.categories?.map((item: any) => {
              return {
                label: item.name,
                value: item._id,
              };
            });
          }

          delete apiData.isDeleted;
          delete apiData.createdAt;
          delete apiData.updatedAt;
          delete apiData._id;
          setValues(apiData);
        } else {
          toast.error(apiResponse?.message);
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
              <h4 className="font-weight-bold mb-0">Edit Booking Time Slot</h4>
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

      {loading ? <OverlayLoading /> : null}

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card rounded-2">
            <div className="card-body">
              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Slot Title"
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter slot title"
                      value={values.title}
                      required={true}
                      touched={touched.title}
                      error={errors.title}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Program Category"
                      placeholder="Select Category"
                      name="categories"
                      required={true}
                      options={categories}
                      value={values.categories}
                      error={errors.categories}
                      touched={touched.categories}
                      handleChange={(value) => {
                        setFieldValue("categories", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("categories", true);
                      }}
                      isMulti={true}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Display Order"
                      name="displayOrder"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter display order"
                      value={values.displayOrder}
                      required={true}
                      touched={touched.displayOrder}
                      error={errors.displayOrder}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="">Status</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          id="true"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "true"}
                        />
                        <label htmlFor="true" className="mt-2">
                          Active
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="status"
                          id="false"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "false"}
                        />
                        <label htmlFor="false" className="mt-2">
                          Disabled
                        </label>
                      </div>
                    </div>
                    {errors.status && touched.status ? (
                      <p className="custom-form-error text-danger">
                        {errors.status}
                      </p>
                    ) : null}
                  </div>

                  {/* Monday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Monday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Monday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="monday"
                              name="monday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "monday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.monday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="monday"
                            ></label>
                          </div>
                        </div>
                        {errors.monday && touched.monday ? (
                          <p className="custom-form-error text-danger">
                            {errors.monday}
                          </p>
                        ) : null}
                      </div>

                      {/* Monday Time */}
                      {values.monday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Monday Time"
                            name="mondayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.mondayTime}
                            required={true}
                            touched={touched.mondayTime}
                            error={errors.mondayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Tuesday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Tuesday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Tuesday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="tuesday"
                              name="tuesday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "tuesday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.tuesday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="tuesday"
                            ></label>
                          </div>
                        </div>
                        {errors.tuesday && touched.tuesday ? (
                          <p className="custom-form-error text-danger">
                            {errors.tuesday}
                          </p>
                        ) : null}
                      </div>

                      {/* Tuesday Time */}
                      {values.tuesday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Tuesday Time"
                            name="tuesdayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.tuesdayTime}
                            required={true}
                            touched={touched.tuesdayTime}
                            error={errors.tuesdayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Wednesday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Wednesday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Wednesday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="wednesday"
                              name="wednesday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "wednesday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.wednesday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="wednesday"
                            ></label>
                          </div>
                        </div>
                        {errors.wednesday && touched.wednesday ? (
                          <p className="custom-form-error text-danger">
                            {errors.wednesday}
                          </p>
                        ) : null}
                      </div>

                      {/* Wednesday Time */}
                      {values.wednesday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Wednesday Time"
                            name="wednesdayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.wednesdayTime}
                            required={true}
                            touched={touched.wednesdayTime}
                            error={errors.wednesdayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Thursday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Thursday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Thursday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="thursday"
                              name="thursday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "thursday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.thursday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="thursday"
                            ></label>
                          </div>
                        </div>
                        {errors.thursday && touched.thursday ? (
                          <p className="custom-form-error text-danger">
                            {errors.thursday}
                          </p>
                        ) : null}
                      </div>

                      {/* Thursday Time */}
                      {values.thursday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Thursday Time"
                            name="thursdayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.thursdayTime}
                            required={true}
                            touched={touched.thursdayTime}
                            error={errors.thursdayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Friday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Friday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Friday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="friday"
                              name="friday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "friday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.friday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="friday"
                            ></label>
                          </div>
                        </div>
                        {errors.friday && touched.friday ? (
                          <p className="custom-form-error text-danger">
                            {errors.friday}
                          </p>
                        ) : null}
                      </div>

                      {/* Friday Time */}
                      {values.friday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Friday Time"
                            name="fridayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.fridayTime}
                            required={true}
                            touched={touched.fridayTime}
                            error={errors.fridayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Saturday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Saturday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Saturday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="saturday"
                              name="saturday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "saturday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.saturday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="saturday"
                            ></label>
                          </div>
                        </div>
                        {errors.saturday && touched.saturday ? (
                          <p className="custom-form-error text-danger">
                            {errors.saturday}
                          </p>
                        ) : null}
                      </div>

                      {/* Saturday Time */}
                      {values.saturday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Saturday Time"
                            name="saturdayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.saturdayTime}
                            required={true}
                            touched={touched.saturdayTime}
                            error={errors.saturdayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Sunday */}
                  <div className="col-md-12">
                    <div className="row">
                      {/* Sunday */}
                      <div className="form-group col-md-6">
                        <label htmlFor="">Sunday</label>
                        <div className="ps-5">
                          <div className="form-check form-switch m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="sunday"
                              name="sunday"
                              onChange={(evt) => {
                                setFieldValue(
                                  "sunday",
                                  `${evt.target.checked}`
                                );
                              }}
                              checked={values.sunday == "true"}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="sunday"
                            ></label>
                          </div>
                        </div>
                        {errors.sunday && touched.sunday ? (
                          <p className="custom-form-error text-danger">
                            {errors.sunday}
                          </p>
                        ) : null}
                      </div>

                      {/* Sunday Time */}
                      {values.sunday == "true" ? (
                        <div className="form-group col-md-6">
                          <InputBox
                            label="Sunday Time"
                            name="sundayTime"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            type="time"
                            placeholder="Enter time for monday"
                            value={values.sundayTime}
                            required={true}
                            touched={touched.sundayTime}
                            error={errors.sundayTime}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <SubmitButton loading={false} text="Update Booking Time Slot" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
