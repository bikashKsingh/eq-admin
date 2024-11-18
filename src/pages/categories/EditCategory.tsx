import {
  GoBackButton,
  InputBox,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  categorySchema,
  CategoryValues,
  categoryInitialValues,
} from "../../validationSchemas/addCategorySchema";
import { useEffect, useState } from "react";
import { get, post, put, remove, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constants";

export function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  type USP = {
    title: string;
    icon: string;
    error: string;
  };
  const [uspInputFields, setUspInputFields] = useState<USP[]>([
    {
      title: "",
      icon: "",
      error: "",
    },
  ]);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldError,
    setFieldTouched,
    setFieldValue,
  } = useFormik({
    onSubmit: async function (
      values: CategoryValues,
      helpers: FormikHelpers<CategoryValues>
    ) {
      setLoading(true);
      // certificate
      let usp = [];
      for (let certificate of uspInputFields) {
        if (certificate.title && certificate.icon) {
          usp.push({
            title: certificate.title,
            icon: certificate.icon,
          });
        }
      }

      const newValue = { ...values, usp };

      const apiResponse = await put(`/categories/${id}`, newValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: categoryInitialValues,
    validationSchema: categorySchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        let url = `/categories/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          delete apiData.isDeleted;
          delete apiData.createdAt;
          delete apiData.updatedAt;
          delete apiData._id;
          setValues(apiData);

          // Certificate
          let usp = apiData?.usp?.map((value: any) => {
            return {
              title: value.title,
              icon: value.icon,
            };
          });
          setUspInputFields(usp);
        } else {
          toast.error(apiResponse?.message);
        }
      }

      if (id) getData(id);
    },
    [id]
  );

  // handleUploadFile
  async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    const files = event.target.files;

    if (!files || files.length === 0) {
      setFieldTouched("image", true);
      setFieldError("image", "Image is required field");
      toast.error("Image is required field");
      return;
    }

    // Validate MIME type and append valid files to FormData
    // Check if the file's MIME type is in the allowed list
    let file = files[0];
    if (!mimeTypes.includes(file.type)) {
      setFieldTouched("image", true);
      setFieldError("image", "Must select the valid image file");
      toast.error("Must select the valid image file");
      return;
    }

    const formData = new FormData();

    formData.append("files", file);

    try {
      let url = `${API_URL}/fileUploads`;
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const apiData = await apiResponse.json();

      if (apiData.status == 200) {
        setFieldTouched("image", false);
        setFieldError("image", "");
        setFieldValue("image", apiData.body[0].filepath);
      } else {
        setFieldTouched("image", false);
        setFieldError("image", apiData.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteFile
  async function handleDeleteFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);
      if (apiResponse?.status == 200) {
        setFieldError("image", "");
        setFieldValue("image", "");
      } else {
        setFieldError("image", "");
        setFieldValue("image", "");
        toast.error(apiResponse?.message);
      }

      const fileInput = document.getElementById(
        `imageFile`
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ""; // Clear the input field
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  function getFileNameFromUrl(url: any) {
    // Create a URL object
    const urlObj = new URL(url);

    // Get the pathname from the URL
    const pathname = urlObj.pathname;

    // Extract the last part of the pathname as the filename
    const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

    return fileName;
  }

  const handleAddUspFields = () => {
    setUspInputFields([...uspInputFields, { title: "", icon: "", error: "" }]);
  };
  const handleRemoveUspFields = (index: number) => {
    const updatedInputFields = [...uspInputFields];
    updatedInputFields.splice(index, 1);
    setUspInputFields(updatedInputFields);
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Edit Category</h4>
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
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Category Name"
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "name",
                          validateTextNumber(evt.target.value)
                        );
                      }}
                      type="text"
                      placeholder="Enter category name"
                      value={values.name}
                      required={true}
                      touched={touched.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Category Slug"
                      name="slug"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter category slug"
                      value={values.slug}
                      required={true}
                      touched={touched.slug}
                      error={errors.slug}
                    />
                  </div>

                  <div className="form-group col-md-8">
                    <label htmlFor={"imageFile"}>
                      Category Image <span className="text-danger"> *</span>
                    </label>
                    <div className="d-flex gap-2">
                      <input
                        type="file"
                        name="imageFile"
                        id="imageFile"
                        onChange={(evt) => {
                          handleUploadFile(evt);
                        }}
                        className="form-control"
                      />
                      {values.image ? (
                        <Link to={`${values.image}`} target="_blank">
                          <img
                            className="img"
                            height={43}
                            width={43}
                            src={`${values.image}`}
                          />
                        </Link>
                      ) : null}
                      {values.image ? (
                        <button
                          type="button"
                          className="btn p-1"
                          onClick={(evt) => {
                            handleDeleteFile(
                              evt,
                              getFileNameFromUrl(values.image)
                            );
                          }}
                        >
                          <i className="fa fa-trash text-danger"></i>
                        </button>
                      ) : null}
                    </div>
                    {touched.image && errors.image ? (
                      <p className="custom-form-error text-danger">
                        {errors.image}
                      </p>
                    ) : null}
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
                </div>
              </div>
            </div>

            {/* Category USP */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5 className="mb-2">Category USP</h5>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleAddUspFields}
                    >
                      <i className="fas fa-plus text-info"></i>
                    </button>
                  </div>
                  <div className="form-group col-md-12">
                    {uspInputFields.map((feild, index) => (
                      <div className="row mb-2">
                        <div className="mb-1 form-group col-md-5" key={index}>
                          <label htmlFor={""}>USP Icon</label>
                          <div className="d-flex">
                            <input
                              className="form-control"
                              value={feild.icon}
                              onChange={(e) => {
                                const updatedInputFields = [...uspInputFields];
                                updatedInputFields[index]["icon"] =
                                  e.target.value;
                                setUspInputFields(updatedInputFields);
                              }}
                              placeholder="USP Icon"
                            />
                            {feild.icon ? (
                              <div className="bg-light d-flex align-items-center px-3 border">
                                <i className={`${feild.icon}`}></i>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mb-1 form-group col-md-6">
                          <label htmlFor={""}>USP Title</label>
                          <div className="d-flex gap-1">
                            <input
                              className="form-control"
                              value={feild.title}
                              onChange={(e) => {
                                const updatedInputFields = [...uspInputFields];
                                updatedInputFields[index]["title"] =
                                  validateTextNumber(e.target.value);
                                setUspInputFields(updatedInputFields);
                              }}
                              placeholder="USP Title"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveUspFields(index)}
                              className="btn bg-light border"
                            >
                              <i className="fas fa-close text-danger"></i>
                            </button>
                          </div>

                          <p className="custom-form-error text-danger">
                            {feild?.error}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Video */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Features Video</h5>
                  </div>
                  <div className="form-group col-md-12">
                    <InputBox
                      label="Video Link"
                      name="video"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter meta title"
                      value={values.video}
                      touched={touched.video}
                      error={errors.video}
                    />
                  </div>

                  {values.video ? (
                    <div className="form-group col-md-12">
                      <iframe
                        width={"100%"}
                        height="315"
                        src={`${values.video}&rel=0`}
                        title="YouTube video player"
                        frameBorder={"0"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* META Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">META Details</h5>
                  </div>
                  <div className="form-group col-md-12">
                    <InputBox
                      label="Meta Title"
                      name="metaTitle"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter meta title"
                      value={values.metaTitle}
                      touched={touched.metaTitle}
                      error={errors.metaTitle}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Meta Description"
                      name="metaDescription"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Enter meta description"
                      value={values.metaDescription}
                      touched={touched.metaDescription}
                      error={errors.metaDescription}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Meta Keywords"
                      name="metaKeywords"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Enter meta keywords (comma saparated values)"
                      value={values.metaKeywords}
                      touched={touched.metaKeywords}
                      error={errors.metaKeywords}
                    />
                  </div>

                  <div className="">
                    <SubmitButton loading={false} text="Update Category" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
