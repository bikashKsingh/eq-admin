import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";

import {
  programPlanSchema,
  ProgramPlanValues,
  programPlanInitialValues,
} from "../../validationSchemas/programPlanSchema";
import { useEffect, useState } from "react";
import { generateSlug, get, post } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function AddProgramPlan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [programDetails, setProgramDetails] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  // const [planTypes, setPlanTypes] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    onSubmit: async function (
      values: ProgramPlanValues,
      helpers: FormikHelpers<ProgramPlanValues>,
    ) {
      setLoading(true);

      const newValue = {
        ...values,
        program: id,
        plan: values?.plan?.value,
        // planType: values.planType?.value,
      };

      const apiResponse = await post("/programPlans", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: programPlanInitialValues,
    validationSchema: programPlanSchema,
  });

  // Get Program Details
  useEffect(
    function () {
      async function getData(id: string) {
        let url = `/programs/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          setProgramDetails(apiData);
        } else {
          toast.error(apiResponse?.message);
        }
      }
      if (id) getData(id);
    },
    [id],
  );

  // get plans
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/plans", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setPlans(modifiedValue);
      }
    }

    getData();
  }, []);

  // get plan type
  // useEffect(function () {
  //   async function getData() {
  //     const apiResponse = await get("/planTypes", true);
  //     if (apiResponse?.status == 200) {
  //       const modifiedValue = apiResponse?.body?.map((value: any) => {
  //         return {
  //           label: value.title,
  //           value: value._id,
  //         };
  //       });
  //       setPlanTypes(modifiedValue);
  //     }
  //   }

  //   getData();
  // }, []);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Add Program Plan</h4>
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
          <form className="forms-sample" onSubmit={handleSubmit}>
            <div className="card rounded-2">
              <div className="card-body">
                <div className="row">
                  {/* <div className="form-group col-md-6">
                    <InputBox
                      label="Program Name"
                      name="name"
                      handleBlur={() => {}}
                      handleChange={() => {}}
                      type="text"
                      placeholder="Enter plan name"
                      value={programDetails?.name}
                      required={true}
                      touched={false}
                      error={""}
                      readonly={true}
                    />
                  </div> */}

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Select Plan"
                      placeholder="Select plan"
                      name="plan"
                      required={true}
                      options={plans}
                      value={values.plan}
                      error={errors.plan}
                      touched={touched.plan}
                      isMulti={false}
                      handleChange={(value) => {
                        setFieldValue("plan", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("plan", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-3">
                    <label htmlFor="">
                      Default Plan <span className="text-danger"> *</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="isDefault"
                          id="defaultTrue"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.isDefault == "true"}
                        />
                        <label htmlFor="defaultTrue" className="mt-2">
                          Yes
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="isDefault"
                          id="defaultFalse"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.isDefault == "false"}
                        />
                        <label htmlFor="defaultFalse" className="mt-2">
                          No
                        </label>
                      </div>
                    </div>
                    {errors.isDefault && touched.isDefault ? (
                      <p className="custom-form-error text-danger">
                        {errors.isDefault}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-group col-md-3">
                    <label htmlFor="">
                      Status <span className="text-danger"> *</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          id="statusTrue"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "true"}
                        />
                        <label htmlFor="statusTrue" className="mt-2">
                          Active
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="status"
                          id="statusFalse"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "false"}
                        />
                        <label htmlFor="statusFalse" className="mt-2">
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

                  {/* <div className="form-group col-md-6">
                    <CustomSelect
                      label="Select Plan Type"
                      placeholder="Select plan type"
                      name="planType"
                      required={true}
                      options={planTypes}
                      value={values.planType}
                      error={errors.planType}
                      touched={touched.planType}
                      isMulti={false}
                      handleChange={(value) => {
                        setFieldValue("planType", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("planType", true);
                      }}
                    />
                  </div> */}

                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Short Description"
                      name="shortDescription"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Enter short description"
                      value={values.shortDescription}
                      touched={touched.shortDescription}
                      error={errors.shortDescription}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Sale Price INR"
                      name="salePriceInr"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter sale price (INR)"
                      value={values?.salePriceInr}
                      required={true}
                      touched={touched.salePriceInr}
                      error={errors.salePriceInr}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="MRP INR"
                      name="mrpInr"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter MRP (INR)"
                      value={values?.mrpInr}
                      required={true}
                      touched={touched.mrpInr}
                      error={errors.mrpInr}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Sale Price (Dollar)"
                      name="salePriceDollar"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter sale price (Dollar)"
                      value={values?.salePriceDollar}
                      required={true}
                      touched={touched.salePriceDollar}
                      error={errors.salePriceDollar}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="MRP (Dollar)"
                      name="mrpDollar"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter sale price (INR)"
                      value={values?.mrpDollar}
                      required={true}
                      touched={touched.mrpDollar}
                      error={errors.mrpDollar}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="PT Sessions"
                      name="ptSession"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter PT Sessions"
                      value={values?.ptSession}
                      required={true}
                      touched={touched.ptSession}
                      error={errors.ptSession}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Group Sessions"
                      name="groupSession"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter Group Sessions"
                      value={values?.groupSession}
                      required={true}
                      touched={touched.groupSession}
                      error={errors.groupSession}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Plan Duration (in Days)"
                      name="planDuration"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter program duration"
                      value={values?.planDuration}
                      required={true}
                      touched={touched.planDuration}
                      error={errors.planDuration}
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
                      value={values?.displayOrder}
                      required={true}
                      touched={touched.displayOrder}
                      error={errors.displayOrder}
                    />
                  </div>

                  {/* <div className="form-group col-md-6">
                    <label htmlFor="">
                      Cancellable <span className="text-danger"> *</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="isCancellable"
                          id="true"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.isCancellable == "true"}
                        />
                        <label htmlFor="true" className="mt-2">
                          Active
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="isCancellable"
                          id="false"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.isCancellable == "false"}
                        />
                        <label htmlFor="false" className="mt-2">
                          Disabled
                        </label>
                      </div>
                    </div>
                    {errors.isCancellable && touched.isCancellable ? (
                      <p className="custom-form-error text-danger">
                        {errors.isCancellable}
                      </p>
                    ) : null}
                  </div> */}

                  {/* <div className="form-group col-md-6">
                    <InputBox
                      label="Cancellation Period"
                      name="cancellationPeriod"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="number"
                      placeholder="Enter cancellation period"
                      value={values?.cancellationPeriod}
                      required={true}
                      touched={touched.cancellationPeriod}
                      error={errors.cancellationPeriod}
                    />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Othet Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Othet Details</h5>
                  </div>

                  <div className="col-md-12 form-group">
                    <label htmlFor={"features"} className="mb-2">
                      Features
                    </label>
                    <CKEditor
                      editor={ClassicEditor as any}
                      data=""
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue("features", data);
                      }}
                      onBlur={(event, editor) => {
                        setFieldTouched("features", true);
                      }}
                      onFocus={(event, editor) => {}}
                      id={"features"}
                    />
                    {errors.features && touched.features ? (
                      <p className="custom-form-error text-danger">
                        {errors.features}
                      </p>
                    ) : null}
                  </div>
                </div>

                <SubmitButton loading={false} text="Add Plan" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
