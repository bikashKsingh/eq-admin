import {
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  newsletterSchema,
  NewsletterValues,
  newsletterInitialValues,
} from "../../validationSchemas/updateNewsletterSchema";
import { useEffect, useState } from "react";
import { get, put } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditNewsletter() {
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
  } = useFormik({
    onSubmit: async function (
      values: NewsletterValues,
      helpers: FormikHelpers<NewsletterValues>
    ) {
      setUpdating(true);

      const apiResponse = await put(`/newsletters/${id}`, values);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: newsletterInitialValues,
    validationSchema: newsletterSchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        let url = `/newsletters/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
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
              <h4 className="font-weight-bold mb-0">Edit Newsletter Email</h4>
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
                      label="Email"
                      name="email"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="email"
                      placeholder="Enter email"
                      value={values.email}
                      required={true}
                      touched={touched.email}
                      error={errors.email}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="">Subscription Status</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="subscriptionStatus"
                          id="subscribed"
                          value={"SUBSCRIBED"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.subscriptionStatus == "SUBSCRIBED"}
                        />
                        <label htmlFor="subscribed" className="mt-2">
                          Subscribed
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="subscriptionStatus"
                          id="unsubscribed"
                          value={"UNSUBSCRIBED"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.subscriptionStatus == "UNSUBSCRIBED"}
                        />
                        <label htmlFor="unsubscribed" className="mt-2">
                          Unsubscribed
                        </label>
                      </div>
                    </div>
                    {errors.subscriptionStatus && touched.subscriptionStatus ? (
                      <p className="custom-form-error text-danger">
                        {errors.subscriptionStatus}
                      </p>
                    ) : null}
                  </div>
                </div>

                <SubmitButton loading={updading} text="Update Email" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
