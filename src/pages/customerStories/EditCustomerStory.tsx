import {
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../constants";
import { get, put, remove, validateNumber } from "../../utills";
import {
  customerStoryInitialValues,
  customerStorySchema,
  CustomerStoryValues,
} from "../../validationSchemas/customerStorySchema";

const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
const videoMimeTypes = ["video/mp4", "video/webm", "video/ogg"];

function getFileNameFromUrl(url: string) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  return pathname.substring(pathname.lastIndexOf("/") + 1);
}

export function EditCustomerStory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

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
    setFieldError,
  } = useFormik({
    onSubmit: async function (
      values: CustomerStoryValues,
      helpers: FormikHelpers<CustomerStoryValues>,
    ) {
      setUpdating(true);
      const apiResponse = await put(`/customerStories/${id}`, values);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setUpdating(false);
    },
    initialValues: customerStoryInitialValues,
    validationSchema: customerStorySchema,
  });

  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse = await get(`/customerStories/${id}`, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          apiData.status = `${apiData.status}`;
          apiData.displayOrder = `${apiData.displayOrder}`;
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
    [id],
  );

  async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      setFieldTouched("mediaUrl", true);
      setFieldError("mediaUrl", "Story media is required");
      toast.error("Story media is required");
      return;
    }

    const file = files[0];
    const mediaType = imageMimeTypes.includes(file.type)
      ? "image"
      : videoMimeTypes.includes(file.type)
        ? "video"
        : "";

    if (!mediaType) {
      setFieldTouched("mediaUrl", true);
      setFieldError("mediaUrl", "Select a valid image or video file");
      toast.error("Select a valid image or video file");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const apiResponse = await fetch(`${API_URL}/fileUploads`, {
        method: "POST",
        body: formData,
      });
      const apiData = await apiResponse.json();

      if (apiData.status == 200) {
        setFieldTouched("mediaUrl", false);
        setFieldError("mediaUrl", "");
        setFieldValue("mediaUrl", apiData.body[0].filepath);
        setFieldValue("mediaType", mediaType);
      } else {
        setFieldTouched("mediaUrl", true);
        setFieldError("mediaUrl", apiData.message);
        toast.error(apiData.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  async function handleDeleteFile(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    try {
      const apiResponse = await remove(
        `/fileUploads/${getFileNameFromUrl(values.mediaUrl)}`,
      );
      if (apiResponse?.status != 200) {
        toast.error(apiResponse?.message);
      }
      setFieldError("mediaUrl", "");
      setFieldValue("mediaUrl", "");
      const fileInput = document.getElementById("storyMediaFile") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex gap-2 align-items-center">
            <GoBackButton />
            <h4 className="font-weight-bold mb-0">Edit Customer Story</h4>
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
                      label="Customer Name"
                      name="customerName"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter customer name"
                      value={values.customerName}
                      touched={touched.customerName}
                      error={errors.customerName}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Display Order"
                      name="displayOrder"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue("displayOrder", validateNumber(evt.target.value));
                      }}
                      type="text"
                      placeholder="Enter display order"
                      value={values.displayOrder}
                      required={true}
                      touched={touched.displayOrder}
                      error={errors.displayOrder}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Title / Caption"
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Enter story title or caption"
                      value={values.title}
                      touched={touched.title}
                      error={errors.title}
                    />
                  </div>

                  <div className="form-group col-md-8">
                    <label htmlFor="storyMediaFile">
                      Story Media <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="file"
                        name="storyMediaFile"
                        id="storyMediaFile"
                        onChange={handleUploadFile}
                        className="form-control"
                        accept="image/png,image/jpg,image/jpeg,image/webp,video/mp4,video/webm,video/ogg"
                      />
                      {values.mediaUrl ? (
                        <Link to={values.mediaUrl} target="_blank" className="btn btn-light">
                          View
                        </Link>
                      ) : null}
                      {values.mediaUrl ? (
                        <button
                          type="button"
                          className="btn p-2 bg-light"
                          onClick={handleDeleteFile}
                        >
                          <i className="fa fa-trash text-danger"></i>
                        </button>
                      ) : null}
                    </div>
                    {touched.mediaUrl && errors.mediaUrl ? (
                      <p className="custom-form-error text-danger">{errors.mediaUrl}</p>
                    ) : null}
                  </div>

                  <div className="form-group col-md-4">
                    <label htmlFor="">Status</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          id="story-active"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "true"}
                        />
                        <label htmlFor="story-active" className="mt-2">
                          Active
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          id="story-disabled"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "false"}
                        />
                        <label htmlFor="story-disabled" className="mt-2">
                          Disabled
                        </label>
                      </div>
                    </div>
                  </div>

                  {values.mediaUrl ? (
                    <div className="form-group col-md-12">
                      {values.mediaType === "video" ? (
                        <video src={values.mediaUrl} controls style={{ maxWidth: 240 }} />
                      ) : (
                        <img src={values.mediaUrl} alt="" style={{ maxWidth: 160 }} />
                      )}
                    </div>
                  ) : null}
                </div>

                <SubmitButton loading={updating} text="Update Customer Story" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
