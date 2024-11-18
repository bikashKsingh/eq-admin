import {
  CustomSelect,
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  paymentSettingSchema,
  PaymentSettingValues,
  paymentSettingInitialValues,
} from "../../validationSchemas/paymentSettingValidationSchema";
import { useEffect, useState } from "react";
import { get, put, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditPaymentSetting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentCompany, setPaymentCompany] = useState<any[]>([
    {
      label: "RAZORPAY",
      value: "RAZORPAY",
    },
    {
      label: "INSTAMOJO",
      value: "INSTAMOJO",
    },
    {
      label: "PHONEPE",
      value: "PHONEPE",
    },
  ]);
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
    setFieldTouched,
  } = useFormik({
    onSubmit: async function (
      values: PaymentSettingValues,
      helpers: FormikHelpers<PaymentSettingValues>
    ) {
      setUpdating(true);

      const updateValue = {
        ...values,
        company: values.company?.value,
      };

      const apiResponse = await put(`/paymentSettings/${id}`, updateValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: paymentSettingInitialValues,
    validationSchema: paymentSettingSchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        let url = `/paymentSettings/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          apiData.status = `${apiData.status}`;
          apiData.company = {
            label: apiData.company,
            value: apiData.company,
          };
          apiData.formats = apiData?.formats?.map((value: any) => {
            return {
              label: value.format,
              value: value._id,
            };
          });
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
              <h4 className="font-weight-bold mb-0">Edit Payment Details</h4>
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
                      label="API Key"
                      name="apiKey"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter API key"
                      value={values.apiKey}
                      required={true}
                      touched={touched.apiKey}
                      error={errors.apiKey}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="API Secret"
                      name="apiSecret"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter API seceret"
                      value={values.apiSecret}
                      required={true}
                      touched={touched.apiSecret}
                      error={errors.apiSecret}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Merchant Id"
                      name="merchantId"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter merchant id"
                      value={values.merchantId}
                      required={false}
                      touched={touched.merchantId}
                      error={errors.merchantId}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Select Company"
                      placeholder="Select format"
                      name="format"
                      required={true}
                      options={paymentCompany}
                      value={values.company}
                      error={errors.company}
                      touched={touched.company}
                      handleChange={(value) => {
                        setFieldValue("company", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("company", true);
                      }}
                      isMulti={false}
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

                <SubmitButton loading={loading} text="Update Details" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
