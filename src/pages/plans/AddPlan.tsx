import { GoBackButton, InputBox, SubmitButton } from "../../components";
import { FormikHelpers, useFormik } from "formik";

import {
  planSchema,
  PlanValues,
  planInitialValues,
} from "../../validationSchemas/planSchema";
import { useState } from "react";
import {
  generateSlug,
  post,
  validateNumber,
  validateSlug,
  validateTextNumber,
} from "../../utills";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function AddPlan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    onSubmit: async function (
      values: PlanValues,
      helpers: FormikHelpers<PlanValues>
    ) {
      setLoading(true);
      const apiResponse = await post("/plans", values, true);
      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: planInitialValues,
    validationSchema: planSchema,
  });

  function handleTitleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = validateTextNumber(evt.target.value);
    let name = evt.target.name;
    setFieldValue(name, value);

    let slug = generateSlug(value);
    setFieldValue("slug", slug);
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Add Plan</h4>
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
                      label="Plan Name"
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={handleTitleChange}
                      type="text"
                      placeholder="Enter plan name"
                      value={values.name}
                      required={true}
                      touched={touched.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Plan Slug"
                      name="slug"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue("slug", validateSlug(evt.target.value));
                      }}
                      type="text"
                      placeholder="Enter plan slug"
                      value={values.slug}
                      required={true}
                      touched={touched.slug}
                      error={errors.slug}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Duration in Days"
                      name="days"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue("days", validateNumber(evt.target.value));
                      }}
                      type="number"
                      placeholder="Enter days"
                      value={values.days}
                      required={true}
                      touched={touched.days}
                      error={errors.days}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="">Allow Subscription</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="allowSubscription"
                          id="allowSubscriptionTrue"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.allowSubscription == "true"}
                        />
                        <label htmlFor="allowSubscriptionTrue" className="mt-2">
                          Yes
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="allowSubscription"
                          id="allowSubscriptionFalse"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.allowSubscription == "false"}
                        />
                        <label
                          htmlFor="allowSubscriptionFalse"
                          className="mt-2"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    {errors.allowSubscription && touched.allowSubscription ? (
                      <p className="custom-form-error text-danger">
                        {errors.allowSubscription}
                      </p>
                    ) : null}
                  </div>

                  {values.allowSubscription == "true" ? (
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Subscription Discount Percentage"
                        name="subscriptionDiscountPercentage"
                        handleBlur={handleBlur}
                        handleChange={(evt) => {
                          setFieldValue(
                            "subscriptionDiscountPercentage",
                            validateNumber(evt.target.value)
                          );
                        }}
                        type="number"
                        placeholder="Enter off percentage"
                        value={values.subscriptionDiscountPercentage}
                        required={false}
                        touched={touched.subscriptionDiscountPercentage}
                        error={errors.subscriptionDiscountPercentage}
                      />
                    </div>
                  ) : null}

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
                </div>

                <SubmitButton loading={false} text="Add Plan" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
