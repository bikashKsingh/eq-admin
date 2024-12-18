import { GoBackButton, InputBox, SubmitButton } from "../../components";
import { FormikHelpers, useFormik } from "formik";
import { useEffect, useState } from "react";
import { post, validateNumber, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  budgetInitialValues,
  budgetSchema,
  BudgetValues,
} from "../../validationSchemas/budgetSchema";

export function AddBudget() {
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
      values: BudgetValues,
      helpers: FormikHelpers<BudgetValues>
    ) {
      setLoading(true);

      const apiResponse = await post("/budgets", values, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: budgetInitialValues,
    validationSchema: budgetSchema,
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if the Alt key and Backspace key are pressed
      if (event.altKey && event.key === "Backspace") {
        console.log("Alt + Backspace was pressed!");
        // You can trigger any action here
        navigate(-1);
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Add Budget</h4>
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
                      label="Minimum Amount"
                      name="minimum"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "minimum",
                          validateNumber(evt.target.value)
                        );
                      }}
                      type="text"
                      placeholder="Enter minimum amount"
                      value={values.minimum}
                      required={true}
                      touched={touched.minimum}
                      error={errors.minimum}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Maximum Amount"
                      name="maximum"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "maximum",
                          validateNumber(evt.target.value)
                        );
                      }}
                      type="text"
                      placeholder="Enter maximum amount"
                      value={values.maximum}
                      required={true}
                      touched={touched.maximum}
                      error={errors.maximum}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <InputBox
                      label="Short Description"
                      name="shortDescription"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter description"
                      value={values.shortDescription}
                      touched={touched.shortDescription}
                      error={errors.shortDescription}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Display Order"
                      name="displayOrder"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "displayOrder",
                          validateNumber(evt.target.value)
                        );
                      }}
                      type="text"
                      placeholder="Enter display Order"
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
                </div>

                <SubmitButton loading={false} text="Add Budget" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
