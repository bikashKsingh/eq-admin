import {
  CustomSelect,
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  couponSchema,
  CouponValues,
  couponInitialValues,
} from "../../validationSchemas/couponSchema";
import { useEffect, useState } from "react";
import { get, put, validateNumber, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  couponStatusOption,
  applyForOption,
  discountTypeOption,
  COUPON_STATUS,
  COUPON_USERS,
  COUPON_DISCOUNT,
  couponLevelOption,
  COUPON_LEVEL,
} from "../../constants";
import moment from "moment";

export function EditCoupon() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [updading, setUpdating] = useState<boolean>(false);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [plans, setPlans] = useState([]);

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
      values: CouponValues,
      helpers: FormikHelpers<CouponValues>
    ) {
      setUpdating(true);

      const updatedValue = {
        ...values,
        couponStatus: values.couponStatus?.value,
        applyFor: values.applyFor?.value,
        discountType: values.discountType?.value,
        couponLevel: values.couponLevel?.value,

        categories: values?.categories?.map((item) => {
          return item.value;
        }),
        programs: values?.programs?.map((item) => {
          return item.value;
        }),
        plans: values?.plans?.map((item) => {
          return item.value;
        }),
      };

      const apiResponse = await put(`/coupons/${id}`, updatedValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: couponInitialValues,
    validationSchema: couponSchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        let url = `/coupons/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          delete apiData.isDeleted;
          delete apiData.createdAt;
          delete apiData.updatedAt;
          delete apiData._id;

          apiData.autoApply = `${apiData.autoApply}`;

          apiData.startDate = moment(apiData.startDate).format("YYYY-MM-DD");
          apiData.expiryDate = moment(apiData.expiryDate).format("YYYY-MM-DD");
          apiData.couponStatus = {
            label:
              COUPON_STATUS[apiData.couponStatus as keyof typeof COUPON_STATUS],
            value: apiData.couponStatus,
          };

          apiData.couponLevel = {
            label:
              COUPON_LEVEL[apiData.couponLevel as keyof typeof COUPON_LEVEL],
            value: apiData.couponLevel,
          };

          apiData.applyFor = {
            label: COUPON_USERS[apiData.applyFor as keyof typeof COUPON_USERS],
            value: apiData.applyFor,
          };

          apiData.discountType = {
            label:
              COUPON_DISCOUNT[
                apiData.discountType as keyof typeof COUPON_DISCOUNT
              ],
            value: apiData.discountType,
          };

          // categories
          if (apiData?.categories?.length) {
            apiData.categories = apiData?.categories?.map((item: any) => {
              return {
                label: item.name,
                value: item._id,
              };
            });
          }

          // programs
          if (apiData?.programs?.length) {
            apiData.programs = apiData?.programs?.map((item: any) => {
              return {
                label: item.name,
                value: item._id,
              };
            });
          }

          // plans
          if (apiData?.plans?.length) {
            apiData.plans = apiData?.plans?.map((item: any) => {
              return {
                label: item.name,
                value: item._id,
              };
            });
          }

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

  // get category
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/categories", true);
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

  // get programs
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/programs", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setPrograms(modifiedValue);
      }
    }

    getData();
  }, []);

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

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Edit Coupon</h4>
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
          <div className="card">
            <div className="card-body">
              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Coupon Code"
                      name="couponCode"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "couponCode",
                          validateTextNumber(evt.target.value)
                        );
                      }}
                      type="text"
                      placeholder="Enter coupon code"
                      value={values.couponCode}
                      required={true}
                      touched={touched.couponCode}
                      error={errors.couponCode}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Coupon Apply For"
                      placeholder="Select user"
                      name="applyFor"
                      required={true}
                      options={applyForOption}
                      value={values.applyFor}
                      error={errors.applyFor}
                      touched={touched.applyFor}
                      handleChange={(value) => {
                        setFieldValue("applyFor", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("applyFor", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Discount Type"
                      placeholder="Select discount type"
                      name="discountType"
                      required={true}
                      options={discountTypeOption}
                      value={values.discountType}
                      error={errors.discountType}
                      touched={touched.discountType}
                      handleChange={(value) => {
                        setFieldValue("discountType", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("discountType", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Discount"
                      name="discount"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "discount",
                          validateNumber(evt.target.value)
                        );
                      }}
                      type="number"
                      placeholder="Enter discount"
                      value={values.discount}
                      required={true}
                      touched={touched.discount}
                      error={errors.discount}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Coupon Level (Applicable for Coupons)"
                      placeholder="Select coupon level"
                      name="couponLevel"
                      required={true}
                      options={couponLevelOption}
                      value={values.couponLevel}
                      error={errors.couponLevel}
                      touched={touched.couponLevel}
                      handleChange={(value) => {
                        setFieldValue("couponLevel", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("couponLevel", true);
                      }}
                      isMulti={false}
                    />
                  </div>

                  {values.couponLevel?.value === "CATEGORY" ? (
                    <div className="form-group col-md-6">
                      <CustomSelect
                        label="Categories (Applicable for Coupons)"
                        placeholder="Select categories"
                        name="categories"
                        required={false}
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
                  ) : values.couponLevel?.value === "PROGRAM" ? (
                    <div className="form-group col-md-6">
                      <CustomSelect
                        label="Programs (Applicable for Coupons)"
                        placeholder="Select programs"
                        name="programs"
                        required={false}
                        options={programs}
                        value={values.programs}
                        error={errors.programs}
                        touched={touched.programs}
                        handleChange={(value) => {
                          setFieldValue("programs", value);
                        }}
                        handleBlur={() => {
                          setFieldTouched("programs", true);
                        }}
                        isMulti={true}
                      />
                    </div>
                  ) : values.couponLevel?.value === "PLAN" ? (
                    <div className="form-group col-md-6">
                      <CustomSelect
                        label="Plans (Applicable for Coupons)"
                        placeholder="Select Plans"
                        name="plans"
                        required={false}
                        options={plans}
                        value={values.plans}
                        error={errors.plans}
                        touched={touched.plans}
                        handleChange={(value) => {
                          setFieldValue("plans", value);
                        }}
                        handleBlur={() => {
                          setFieldTouched("plans", true);
                        }}
                        isMulti={true}
                      />
                    </div>
                  ) : null}

                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Description"
                      name="description"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Coupon description"
                      value={values.description}
                      touched={touched.description}
                      error={errors.description}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Mininum Amount"
                      name="minimumAmount"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "minimumAmount",
                          validateNumber(evt.target.value)
                        );
                      }}
                      type="number"
                      placeholder="Enter amount"
                      value={values.minimumAmount}
                      required={true}
                      touched={touched.minimumAmount}
                      error={errors.minimumAmount}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="No of Uses Times"
                      name="numberOfUsesTimes"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "numberOfUsesTimes",
                          validateNumber(evt.target.value)
                        );
                      }}
                      type="number"
                      placeholder="Enter amount"
                      value={values.numberOfUsesTimes}
                      required={true}
                      touched={touched.numberOfUsesTimes}
                      error={errors.numberOfUsesTimes}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Coupon Activition Date"
                      name="startDate"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="date"
                      placeholder=""
                      value={values.startDate}
                      required={true}
                      touched={touched.startDate}
                      error={errors.startDate}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Coupon Expiry Date"
                      name="expiryDate"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="date"
                      placeholder=""
                      value={values.expiryDate}
                      required={true}
                      touched={touched.expiryDate}
                      error={errors.expiryDate}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="">Auto Apply Coupon</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="autoApply"
                          id="true"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.autoApply == "true"}
                        />
                        <label htmlFor="true" className="mt-2">
                          Yes
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="autoApply"
                          id="false"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.autoApply == "false"}
                        />
                        <label htmlFor="false" className="mt-2">
                          No
                        </label>
                      </div>
                    </div>
                    {errors.autoApply && touched.autoApply ? (
                      <p className="custom-form-error text-danger">
                        {errors.autoApply}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Coupon Status"
                      placeholder="Select coupon status"
                      name="couponStatus"
                      required={true}
                      options={couponStatusOption}
                      value={values.couponStatus}
                      error={errors.couponStatus}
                      touched={touched.couponStatus}
                      handleChange={(value) => {
                        setFieldValue("couponStatus", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("couponStatus", true);
                      }}
                    />
                  </div>
                </div>

                <SubmitButton loading={updading} text="Update Coupon" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
