import {
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  budgetSchema,
  BudgetValues,
  budgetInitialValues,
} from "../../validationSchemas/budgetSchema";
import { useEffect, useState } from "react";
import { get, put, validateNumber, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditBudget() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [updading, setUpdating] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    onSubmit: async function (
      values: BudgetValues,
      helpers: FormikHelpers<BudgetValues>
    ) {
      setUpdating(true);
      const apiResponse = await put(`/budgets/${id}`, values);
      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: budgetInitialValues,
    validationSchema: budgetSchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        let url = `/budgets/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          apiData.status = `${apiData.status}`;
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
              <h4 className="font-weight-bold mb-0">Edit Yoga Experience</h4>
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

                <SubmitButton loading={false} text="Update Budget" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
