import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import { useEffect, useState } from "react";
import { post } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  documentFormatInitialValues,
  documentFormatSchema,
  DocumentFormatValues,
} from "../../validationSchemas/documentValidationSchema";

import { DOCUMENT_FORMAT_OPTIONS, MIME_TYPE } from "../../constants";

export function AddDocumentFormat() {
  const navigate = useNavigate();
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
    validateField,
  } = useFormik({
    onSubmit: async function (
      values: DocumentFormatValues,
      helpers: FormikHelpers<DocumentFormatValues>
    ) {
      setLoading(true);
      const newValue = {
        ...values,
        format: values.format?.value,
      };

      const apiResponse = await post("/documentFormats", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: documentFormatInitialValues,
    validationSchema: documentFormatSchema,
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
              <h4 className="font-weight-bold mb-0">Add Document Format</h4>
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
                    <CustomSelect
                      label="Document Format"
                      placeholder="Select format"
                      name="format"
                      required={true}
                      options={DOCUMENT_FORMAT_OPTIONS}
                      value={values.format}
                      error={errors.format}
                      touched={touched.format}
                      handleChange={(value: any) => {
                        setFieldValue("format", value);
                        let key = value.value as keyof typeof MIME_TYPE;
                        setFieldValue("mimeType", MIME_TYPE[key]);
                      }}
                      handleBlur={() => {
                        setFieldTouched("format", true);
                      }}
                      isMulti={false}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="MIME Type"
                      name="mimeType"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter MIME type"
                      value={values.mimeType}
                      required={true}
                      touched={touched.mimeType}
                      error={errors.mimeType}
                      readonly={true}
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

                <SubmitButton loading={false} text="Add Format" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
