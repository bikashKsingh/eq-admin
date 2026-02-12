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
  onboardingStepsSchema,
  OnboardingStepsValues,
  onboardingStepsInitialValues,
} from "../../validationSchemas/onboardingStepsSchema";
import React, { useEffect, useState } from "react";
import { generateSlug, get, post, put, remove } from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function EditOnboardingSteps() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [uspInputFields, setUspInputFields] = useState<string[]>([""]);

  type OnboardingStep = {
    title: string;
    content: string;
    linkText: string;
    linkUrl: string;
    isDownloadable: string;
    submitButtonText: string;
    eventName: string;
    error: string;
  };
  const [faqsInputFields, setFaqsInputFields] = useState<OnboardingStep[]>([]);

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
    setFieldError,
    setValues,
  } = useFormik({
    onSubmit: async function (
      values: OnboardingStepsValues,
      helpers: FormikHelpers<OnboardingStepsValues>
    ) {
      setLoading(true);

      // steps
      let steps = [];
      for (let step of faqsInputFields) {
        if (step.title && step.content) {
          steps.push({
            title: step.title,
            content: step.content,
            linkText: step.linkText,
            linkUrl: step.linkUrl,
            isDownloadable: step.isDownloadable,
            eventName: step.eventName,
            submitButtonText: step.submitButtonText,
          });
        }
      }

      const newValue = {
        ...values,
        steps,
      };

      if (values.categories?.length) {
        newValue.categories = values.categories.map((item: any) => item.value);
      }

      const apiResponse = await put(`/onboardingSteps/${id}`, newValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: onboardingStepsInitialValues,
    validationSchema: onboardingStepsSchema,
  });

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

  // get program details
  useEffect(
    function () {
      async function getData(id: string) {
        setLoading(true);
        const apiResponse: any = await get(`/onboardingSteps/${id}`, true);

        if (apiResponse?.status == 200) {
          const data: any = apiResponse.body;

          delete data._id;
          delete data.createdAt;
          delete data.updatedAt;

          data.status = `${data.status}`;

          if (data?.categories?.length) {
            data.categories = data?.categories?.map((item: any) => {
              return {
                label: item.name,
                value: item._id,
              };
            });
          }

          if (data.steps?.length) {
            let allSteps: any = data?.steps?.map((item: any) => {
              return {
                title: item.title,
                content: item.content,
                linkText: item.linkText,
                linkUrl: item.linkUrl,
                isDownloadable: `${item.isDownloadable}`,
                submitButtonText: item.submitButtonText,
                eventName: item.eventName,
              };
            });
            setFaqsInputFields(allSteps);
          }

          setValues(data);
        }
        setLoading(false);
      }
      if (id) getData(id);
    },
    [id]
  );

  // handleUploadProfilePic
  async function handleUploadProfilePic(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    const files = event.target.files;

    if (!files || files.length === 0) {
      setFieldTouched("defaultImage", true);
      setFieldError("defaultImage", "Profile Photo is required field");
      toast.error("Profile Photo is required field");
      return;
    }

    // Validate MIME type and append valid files to FormData
    // Check if the file's MIME type is in the allowed list
    let file = files[0];
    if (!mimeTypes.includes(file.type)) {
      setFieldTouched("defaultImage", true);
      setFieldError("defaultImage", "Must select the valid image file");
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
        setFieldTouched("defaultImage", false);
        setFieldError("defaultImage", "");
        setFieldValue("defaultImage", apiData.body[0].filepath);
      } else {
        setFieldTouched("defaultImage", false);
        setFieldError("defaultImage", apiData.message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteFile
  async function handleDeleteProfilePic(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);
      if (apiResponse?.status == 200) {
        setFieldError("defaultImage", "");
        setFieldValue("defaultImage", "");
      } else {
        setFieldError("defaultImage", "");
        setFieldValue("defaultImage", "");
        toast.error(apiResponse?.message);
      }

      const fileInput = document.getElementById(
        `defaultImageFile`
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ""; // Clear the input field
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  const handleAddFaqsFields = () => {
    setFaqsInputFields([
      ...faqsInputFields,
      {
        title: "",
        content: "",
        linkText: "",
        linkUrl: "",
        isDownloadable: "",
        submitButtonText: "",
        eventName: "",
        error: "",
      },
    ]);
  };
  const handleRemoveFaqsFields = (index: number) => {
    const updatedInputFields = [...faqsInputFields];
    updatedInputFields.splice(index, 1);
    setFaqsInputFields(updatedInputFields);
  };

  function getFileNameFromUrl(url: any) {
    // Create a URL object
    const urlObj = new URL(url);

    // Get the pathname from the URL
    const pathname = urlObj.pathname;

    // Extract the last part of the pathname as the filename
    const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

    return fileName;
  }

  function handleNameChange(evt: React.ChangeEvent<HTMLInputElement>) {
    // let value = validateTextNumber(evt.target.value);
    let value = evt.target.value;
    let name = evt.target.name;
    setFieldValue(name, value);

    let slug = generateSlug(value);
    setFieldValue("slug", slug);
  }

  const handleAddUspFields = () => {
    setUspInputFields([...uspInputFields, ""]);
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
              <h4 className="font-weight-bold mb-0">Edit Program</h4>
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
          <div className="card bg-transparent shadow-none border-0">
            <form className="forms-sample" onSubmit={handleSubmit}>
              {/* Basic Details */}
              <div className="card rounded-2">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-2">Basic Details</h5>
                    </div>
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Enter Title"
                        name="title"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        type="text"
                        placeholder="Enter title"
                        value={values.title}
                        required={true}
                        touched={touched.title}
                        error={errors.title}
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <CustomSelect
                        label="Select Categories"
                        placeholder="Select Categories"
                        name="categories"
                        required={true}
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

                    <div className="form-group col-md-3">
                      <label htmlFor="">
                        Status <span className="text-danger">*</span>
                      </label>
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
                </div>
              </div>

              {/* Steps */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 d-flex justify-content-between align-items-center">
                      <h5 className="mb-2">Steps</h5>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleAddFaqsFields}
                      >
                        <i className="fas fa-plus text-info"></i>
                      </button>
                    </div>

                    <div className="form-group col-md-12">
                      {faqsInputFields.map((feild, index) => (
                        <div className="row mb-4 border rounded py-2">
                          <div
                            className="mb-1 form-group col-md-12 d-flex"
                            key={index}
                          >
                            {/* <div className="">
                                          <label htmlFor={""}>Title</label>
                                        </div> */}
                            <input
                              className="form-control"
                              value={feild.title}
                              onChange={(e) => {
                                const updatedInputFields = [...faqsInputFields];
                                updatedInputFields[index]["title"] =
                                  e.target.value;
                                setFaqsInputFields(updatedInputFields);
                              }}
                              placeholder="Enter Title"
                            />

                            {index != 0 ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveFaqsFields(index)}
                                className="btn bg-light border"
                              >
                                <i className="fas fa-close text-danger"></i>
                              </button>
                            ) : null}
                          </div>

                          {/* Content */}
                          <div className="mb-1 form-group col-md-12">
                            {/* <label htmlFor={""}>Answer</label> */}
                            <CKEditor
                              editor={ClassicEditor}
                              data={feild.content}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                const updatedInputFields = [...faqsInputFields];
                                updatedInputFields[index]["content"] = data;
                                setFaqsInputFields(updatedInputFields);
                              }}
                              id={"requirements"}
                            />

                            <p className="custom-form-error text-danger">
                              {feild?.error}
                            </p>
                          </div>

                          {/* Link Text */}
                          <div className="mb-1 form-group col-md-6" key={index}>
                            <input
                              className="form-control"
                              value={feild.linkText}
                              onChange={(e) => {
                                const updatedInputFields = [...faqsInputFields];
                                updatedInputFields[index]["linkText"] =
                                  e.target.value;
                                setFaqsInputFields(updatedInputFields);
                              }}
                              placeholder="Enter link text"
                            />
                          </div>

                          {/* Link URL */}
                          <div className="mb-1 form-group col-md-6" key={index}>
                            <input
                              className="form-control"
                              value={feild.linkUrl}
                              onChange={(e) => {
                                const updatedInputFields = [...faqsInputFields];
                                updatedInputFields[index]["linkUrl"] =
                                  e.target.value;
                                setFaqsInputFields(updatedInputFields);
                              }}
                              placeholder="Enter link url"
                            />
                          </div>

                          {/* Link Text */}
                          <div
                            className="mb-1 form-group col-md-12"
                            key={index}
                          >
                            <input
                              className="form-control"
                              value={feild.eventName}
                              onChange={(e) => {
                                const updatedInputFields = [...faqsInputFields];
                                updatedInputFields[index]["eventName"] =
                                  e.target.value;
                                setFaqsInputFields(updatedInputFields);
                              }}
                              placeholder="Enter Event Name"
                            />
                          </div>

                          <div className="form-group col-md-6">
                            <label htmlFor="">
                              Is Downloadable
                              <span className="text-danger">*</span>
                            </label>
                            <div className="d-flex gap-3">
                              <div className="d-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name={`isDownloadable-${index}`}
                                  id={`isDownloadableTrue-${index}`}
                                  value={"true"}
                                  onChange={(e) => {
                                    const updatedInputFields = [
                                      ...faqsInputFields,
                                    ];
                                    updatedInputFields[index][
                                      "isDownloadable"
                                    ] = e.target.value;
                                    setFaqsInputFields(updatedInputFields);
                                  }}
                                  checked={
                                    faqsInputFields[index]["isDownloadable"] ==
                                    "true"
                                  }
                                />
                                <label
                                  htmlFor={`isDownloadableTrue-${index}`}
                                  className="mt-2"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="d-flex align-items-center gap-1">
                                <input
                                  type="radio"
                                  name={`isDownloadable-${index}`}
                                  id={`isDownloadableFalse-${index}`}
                                  value={"false"}
                                  onChange={(e) => {
                                    const updatedInputFields = [
                                      ...faqsInputFields,
                                    ];
                                    updatedInputFields[index][
                                      "isDownloadable"
                                    ] = e.target.value;
                                    setFaqsInputFields(updatedInputFields);
                                  }}
                                  checked={
                                    faqsInputFields[index]["isDownloadable"] ==
                                    "false"
                                  }
                                />
                                <label
                                  htmlFor={`isDownloadableFalse-${index}`}
                                  className="mt-2"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                            {/* {errors.isDownloadable && touched.isDownloadable ? (
                              <p className="custom-form-error text-danger">
                                {errors.isDownloadable}
                              </p>
                            ) : null} */}
                          </div>

                          {/* Submit Button Text */}
                          <div className="mb-1 form-group col-md-6" key={index}>
                            <input
                              className="form-control"
                              value={feild.submitButtonText}
                              onChange={(e) => {
                                const updatedInputFields = [...faqsInputFields];
                                updatedInputFields[index]["submitButtonText"] =
                                  e.target.value;
                                setFaqsInputFields(updatedInputFields);
                              }}
                              placeholder="Enter Button Text"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Images */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  {/* <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Program Images</h5>
                    </div>
                    <div className="form-group col-md-8">
                      <label htmlFor={"defaultImageFile"}>
                        Default Image <span className="text-danger"> *</span>
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="file"
                          name="defaultImageFile"
                          id="defaultImageFile"
                          onChange={(evt) => {
                            handleUploadProfilePic(evt);
                          }}
                          className="form-control"
                        />
                        {values.defaultImage ? (
                          <Link to={`${values.defaultImage}`} target="_blank">
                            <img
                              className="img"
                              height={43}
                              width={43}
                              src={`${values.defaultImage}`}
                            />
                          </Link>
                        ) : null}
                        {values.defaultImage ? (
                          <button
                            type="button"
                            className="btn p-1"
                            onClick={(evt) => {
                              handleDeleteProfilePic(
                                evt,
                                getFileNameFromUrl(values.defaultImage)
                              );
                            }}
                          >
                            <i className="fa fa-trash text-danger"></i>
                          </button>
                        ) : null}
                      </div>
                      {touched.defaultImage && errors.defaultImage ? (
                        <p className="custom-form-error text-danger">
                          {errors.defaultImage}
                        </p>
                      ) : null}
                    </div>
                  </div> */}

                  <SubmitButton loading={false} text="Update Step" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
