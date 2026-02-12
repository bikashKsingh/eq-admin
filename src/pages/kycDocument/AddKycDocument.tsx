import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import { useEffect, useState } from "react";
import { get, post, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  kycDocumentInitialValues,
  kycDocumentSchema,
  KycDocumentValues,
} from "../../validationSchemas/kycDocumentValidationSchema";

export function AddKycDocument() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [documentFormats, setDocumentFormats] = useState<any[]>([]);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    validateField,
  } = useFormik({
    onSubmit: async function (
      values: KycDocumentValues,
      helpers: FormikHelpers<KycDocumentValues>
    ) {
      setLoading(true);
      const newValue = {
        ...values,
        formats: values?.formats?.map((value) => value.value),
      };

      const apiResponse = await post("/kycDocuments", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: kycDocumentInitialValues,
    validationSchema: kycDocumentSchema,
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

  // get document formats
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/documentFormats", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.format,
            value: value._id,
          };
        });
        setDocumentFormats(modifiedValue);
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
              <h4 className="font-weight-bold mb-0">Add KYC Document</h4>
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
                      label="Document Title"
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={(event) => {
                        const value = event.target.value;
                        setFieldValue("title", validateTextNumber(value));
                      }}
                      type="text"
                      placeholder="Enter coupon code"
                      value={values.title}
                      required={true}
                      touched={touched.title}
                      error={errors.title}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Document Format"
                      placeholder="Select format"
                      name="format"
                      required={true}
                      options={documentFormats}
                      value={values.formats}
                      error={errors.formats}
                      touched={touched.formats}
                      handleChange={(value) => {
                        setFieldValue("formats", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("formats", true);
                      }}
                      isMulti={true}
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

                <SubmitButton loading={loading} text="Add Document" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
