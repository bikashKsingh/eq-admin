import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  programSchema,
  ProgramValues,
  programInitialValues,
} from "../../validationSchemas/programSchema";
import React, { useEffect, useState } from "react";
import {
  generateSlug,
  get,
  post,
  remove,
  validateSlug,
  validateTextNumber,
} from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function AddBooking() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [programRequirements, setProgramRequirements] = useState([]);
  const [kycDocuments, setKycDocumnets] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [uspInputFields, setUspInputFields] = useState<string[]>([""]);

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
  } = useFormik({
    onSubmit: async function (
      values: ProgramValues,
      helpers: FormikHelpers<ProgramValues>
    ) {
      setLoading(true);

      // faqs
      let faqs = [];
      for (let faq of faqsInputFields) {
        if (faq.question && faq.answer) {
          faqs.push({
            question: faq.question,
            answer: faq.answer,
          });
        }
      }

      let requirements = [];
      if (values.requirements) {
        requirements = values.requirements.map((value) => value.value);
      }

      // item
      let usp = [];
      for (let item of uspInputFields) {
        if (item) {
          usp.push(item);
        }
      }

      const newValue = {
        ...values,
        category: values.category?.value,
        subCategory: values.subCategory?.value,
        faqs,
        images: values.images || [],
        requirements: requirements,
        usp: usp,
      };

      const apiResponse = await post("/programs", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: programInitialValues,
    validationSchema: programSchema,
  });

  type Certificate = { question: string; answer: string; error: string };
  const [faqsInputFields, setFaqsInputFields] = useState<Certificate[]>([
    {
      question: "",
      answer: "",
      error: "",
    },
  ]);

  // get category
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/programRequirements", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.title,
            value: value._id,
          };
        });
        setProgramRequirements(modifiedValue);
      }
    }

    getData();
  }, []);

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

  // get sub category
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/subCategories", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setSubCategories(modifiedValue);
      }
    }
    getData();
  }, []);

  // get kyc documents
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/kycDocuments", true);
      if (apiResponse?.status == 200) {
        setKycDocumnets(apiResponse.body);
        // const kyc = apiResponse?.body?.map(({ _id, title, formats }: any) => {
        //   return { _id, title, formats, file: "", error: "" };
        // });

        // setSelectedKycDocuments(kyc);
      }
    }

    getData();
  }, []);

  // handleUploadFile
  // async function handleUploadFile(
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   acceptType: any,
  //   index: number
  // ) {
  //   const mimeTypes = acceptType?.map((value: any) => value.mimeType) || [
  //     "application/pdf",
  //   ];

  //   const files = event.target.files;
  //   const inputElementName: "certificateFile" | "kycFile" = event.target
  //     .name as "certificateFile" | "kycFile";

  //   if (!files || files.length === 0) {
  //     toast.error("Please select at least one file.");
  //     return;
  //   }

  //   const formData = new FormData();

  //   // Validate MIME type and append valid files to FormData
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];

  //     // Check if the file's MIME type is in the allowed list
  //     if (!mimeTypes.includes(file.type)) {
  //       if (inputElementName == "kycFile") {
  //         let kycDocsFiles = [...kycDocuments];
  //         kycDocuments[index]["error"] = "File type is not allowed";
  //         return setKycDocumnets(kycDocsFiles);
  //       } else if (inputElementName == "certificateFile") {
  //         let certificateFields = [...faqsInputFields];
  //         certificateFields[index]["error"] = "File type is not allowed";
  //         return setFaqsInputFields(certificateFields);
  //       }
  //     }
  //   }

  //   // Append each file to the FormData object
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append("files", files[i]);
  //   }

  //   try {
  //     let url = `${API_URL}/fileUploads`;
  //     const apiResponse = await fetch(url, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const apiData = await apiResponse.json();

  //     if (apiData.status == 200) {
  //       if (inputElementName == "kycFile") {
  //         let kycDocsFiles = [...kycDocuments];
  //         kycDocuments[index]["error"] = "";
  //         kycDocuments[index]["file"] = apiData.body[0];
  //         setKycDocumnets(kycDocsFiles);
  //       } else if (inputElementName == "certificateFile") {
  //         let certificateFields = [...faqsInputFields];
  //         certificateFields[index]["error"] = "";
  //         certificateFields[index]["file"] = apiData.body[0];
  //         setFaqsInputFields(certificateFields);
  //       }
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message);
  //   }

  // }

  // handleDeleteFile
  // async function handleDeleteFile(
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   fileName: string,
  //   index: number,
  //   deleteFile?: "kycFile" | "certificateFile"
  // ) {
  //   event.preventDefault();

  //   try {
  //     const apiResponse = await remove(`/fileUploads/${fileName}`);
  //     if (apiResponse?.status == 200) {
  //       if (deleteFile == "kycFile") {
  //         let kycDocsFiles = [...kycDocuments];
  //         kycDocuments[index]["error"] = "";
  //         kycDocuments[index]["file"] = null;
  //         setKycDocumnets(kycDocsFiles);
  //       } else if (deleteFile == "certificateFile") {
  //         let certificateFields = [...faqsInputFields];
  //         certificateFields[index]["error"] = "";
  //         certificateFields[index]["file"] = null;
  //         setFaqsInputFields(certificateFields);
  //       }
  //     } else {
  //       toast.error(apiResponse?.message);
  //     }

  //     // Clear the input field value after the file is deleted successfully
  //     if (deleteFile == "kycFile") {
  //       const fileInput = document.getElementById(
  //         `kycInputFile${index}`
  //       ) as HTMLInputElement;
  //       if (fileInput) {
  //         fileInput.value = ""; // Clear the input field
  //       }
  //     } else if (deleteFile == "certificateFile") {
  //       const fileInput = document.getElementById(
  //         `certificateInputFile${index}`
  //       ) as HTMLInputElement;
  //       if (fileInput) {
  //         fileInput.value = ""; // Clear the input field
  //       }
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message);
  //   }
  // }

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
      { question: "", answer: "", error: "" },
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
              <h4 className="font-weight-bold mb-0">Add Program</h4>
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
            {/* Basic Details */}
            <div className="card rounded-2">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Basic Details</h5>
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Program Name"
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={handleNameChange}
                      type="text"
                      placeholder="Enter program name"
                      value={values.name}
                      required={true}
                      touched={touched.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Program Slug"
                      name="slug"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue("slug", validateSlug(evt.target.value));
                      }}
                      type="text"
                      placeholder="Enter slug"
                      value={values.slug}
                      required={true}
                      touched={touched.slug}
                      error={errors.slug}
                    />
                  </div>

                  {/* <div className="form-group col-md-6">
                    <label htmlFor="">
                      Gender <span className="text-danger">*</span>{" "}
                    </label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          id="male"
                          value={"MALE"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.gender == "MALE"}
                        />
                        <label htmlFor="male" className="mt-2">
                          MALE
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          id="female"
                          value={"FEMALE"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.gender == "FEMALE"}
                        />
                        <label htmlFor="female" className="mt-2">
                          FEMALE
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          id="other"
                          value={"OTHER"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.gender == "OTHER"}
                        />
                        <label htmlFor="other" className="mt-2">
                          OTHER
                        </label>
                      </div>
                    </div>
                    {errors.gender && touched.gender ? (
                      <p className="custom-form-error text-danger">
                        {errors.gender}
                      </p>
                    ) : null}
                  </div> */}

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Program Category"
                      placeholder="Select Category"
                      name="category"
                      required={true}
                      options={categories}
                      value={values.category}
                      error={errors.category}
                      touched={touched.category}
                      handleChange={(value) => {
                        setFieldValue("category", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("category", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Program Sub Category"
                      placeholder="Select sub Category"
                      name="subCategory"
                      required={true}
                      options={subCategories}
                      value={values.subCategory}
                      error={errors.subCategory}
                      touched={touched.subCategory}
                      handleChange={(value) => {
                        setFieldValue("subCategory", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("subCategory", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Display Order"
                      name="displayOrder"
                      handleBlur={handleBlur}
                      handleChange={handleNameChange}
                      type="number"
                      placeholder="Enter display order"
                      value={values.displayOrder}
                      required={true}
                      touched={touched.displayOrder}
                      error={errors.displayOrder}
                    />
                  </div>

                  <div className="form-group col-md-3">
                    <label htmlFor="">
                      Is Trail Program <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="isTrial"
                          id="isTrialTrue"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.isTrial == "true"}
                        />
                        <label htmlFor="isTrialTrue" className="mt-2">
                          Yes
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="isTrial"
                          id="isTrialFalse"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.isTrial == "false"}
                        />
                        <label htmlFor="isTrialFalse" className="mt-2">
                          No
                        </label>
                      </div>
                    </div>
                    {errors.isTrial && touched.isTrial ? (
                      <p className="custom-form-error text-danger">
                        {errors.isTrial}
                      </p>
                    ) : null}
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

            {/* Program Description */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Program Description</h5>
                  </div>
                  <div className="col-md-12 form-group">
                    <label htmlFor={"descriptions"} className="mb-2">
                      About the Program
                    </label>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue("descriptions", data);
                      }}
                      onBlur={(event, editor) => {
                        setFieldTouched("descriptions", true);
                      }}
                      onFocus={(event, editor) => {}}
                      id={"descriptions"}
                    />
                    {errors.descriptions && touched.descriptions ? (
                      <p className="custom-form-error text-danger">
                        {errors.descriptions}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-md-12 form-group">
                    <label htmlFor={"descriptions"} className="mb-2">
                      Highlights
                    </label>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue("highlights", data);
                      }}
                      onBlur={(event, editor) => {
                        setFieldTouched("highlights", true);
                      }}
                      // onFocus={(event, editor) => {}}
                      id={"highlights"}
                    />
                    {errors.highlights && touched.highlights ? (
                      <p className="custom-form-error text-danger">
                        {errors.highlights}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-md-12 form-group">
                    <label htmlFor={"benefits"} className="mb-2">
                      What you will get in this Program
                    </label>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue("benefits", data);
                      }}
                      onBlur={(event, editor) => {
                        setFieldTouched("benefits", true);
                      }}
                      // onFocus={(event, editor) => {}}
                      id={"benefits"}
                    />
                    {errors.benefits && touched.benefits ? (
                      <p className="custom-form-error text-danger">
                        {errors.benefits}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-md-12 form-group">
                    <label htmlFor={"descriptions"} className="mb-2">
                      How it Works
                    </label>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFieldValue("howItWorks", data);
                      }}
                      onBlur={(event, editor) => {
                        setFieldTouched("howItWorks", true);
                      }}
                      // onFocus={(event, editor) => {}}
                      id={"howItWorks"}
                    />
                    {errors.howItWorks && touched.howItWorks ? (
                      <p className="custom-form-error text-danger">
                        {errors.howItWorks}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-md-12 form-group">
                    <CustomSelect
                      label="Program Requirements"
                      placeholder="Select requirements"
                      name="requirements"
                      required={true}
                      options={programRequirements}
                      value={values.requirements}
                      error={errors.requirements}
                      touched={touched.requirements}
                      isMulti={true}
                      handleChange={(value) => {
                        setFieldValue("requirements", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("requirements", true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Program USP */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5 className="mb-2">Program USP</h5>
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
                        <div className="mb-1 form-group col-md-12">
                          <label htmlFor={""}>USP Title</label>
                          <div className="d-flex gap-1">
                            <input
                              className="form-control"
                              value={feild}
                              onChange={(e) => {
                                const updatedInputFields = [...uspInputFields];
                                updatedInputFields[index] = validateTextNumber(
                                  e.target.value
                                );
                                setUspInputFields(updatedInputFields);
                              }}
                              placeholder="Enter USP"
                            />

                            {index != 0 ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveUspFields(index)}
                                className="btn bg-light border"
                              >
                                <i className="fas fa-close text-danger"></i>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5 className="mb-2">FAQs</h5>
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
                      <div className="row mb-2">
                        <div className="col-md-12">
                          <label htmlFor={""}>Question</label>
                        </div>
                        <div
                          className="mb-1 form-group col-md-12 d-flex gap-1"
                          key={index}
                        >
                          <input
                            className="form-control"
                            value={feild.question}
                            onChange={(e) => {
                              const updatedInputFields = [...faqsInputFields];
                              updatedInputFields[index]["question"] =
                                e.target.value;
                              setFaqsInputFields(updatedInputFields);
                            }}
                            placeholder="Enter Question"
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

                        <div className="mb-1 form-group col-md-12">
                          <label htmlFor={""}>Answer</label>
                          <CKEditor
                            editor={ClassicEditor}
                            data={feild.answer}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              const updatedInputFields = [...faqsInputFields];
                              updatedInputFields[index]["answer"] = data;
                              setFaqsInputFields(updatedInputFields);
                            }}
                            id={"requirements"}
                          />

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

            {/* Meta Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Meta Details</h5>
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
                </div>
              </div>
            </div>

            {/* Program Images */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
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
                </div>

                <SubmitButton loading={false} text="Add Program" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
