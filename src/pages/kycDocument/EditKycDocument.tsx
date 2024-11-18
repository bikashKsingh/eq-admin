import {
  CustomSelect,
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  kycDocumentSchema,
  KycDocumentValues,
  kycDocumentInitialValues,
} from "../../validationSchemas/kycDocumentValidationSchema";
import { useEffect, useState } from "react";
import { get, put, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditKycDocument() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [updading, setUpdating] = useState<boolean>(false);
  const [documentFormats, setDocumentFormats] = useState<any[]>([]);
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
      values: KycDocumentValues,
      helpers: FormikHelpers<KycDocumentValues>
    ) {
      setUpdating(true);

      const updateValue = {
        ...values,
        formats: values?.formats?.map((value) => value.value),
      };

      const apiResponse = await put(`/kycDocuments/${id}`, updateValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: kycDocumentInitialValues,
    validationSchema: kycDocumentSchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        let url = `/kycDocuments/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          apiData.status = `${apiData.status}`;
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
              <h4 className="font-weight-bold mb-0">Edit Document Format</h4>
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
                      label="Document Title"
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "title",
                          validateTextNumber(evt.target.value)
                        );
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
                        if (value) {
                          setFieldTouched("formats", false);
                        }
                      }}
                      handleBlur={() => {
                        // setFieldTouched("formats", true);
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

                <SubmitButton loading={updading} text="Update Level" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
