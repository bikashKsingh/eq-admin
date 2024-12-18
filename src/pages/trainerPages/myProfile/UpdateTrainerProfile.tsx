import {
  CustomSelect,
  GoBackButton,
  InputBox,
  OverlayLoading,
  SubmitButton,
  TextareaBox,
} from "../../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  updateTrainerSchema,
  TrainerValues,
  trainerInitialValues,
} from "../../../validationSchemas/trainerSchema";
import React, { useEffect, useState } from "react";
import {
  get,
  post,
  put,
  remove,
  validateText,
  validateUsername,
} from "../../../utills";

import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../constants";
import moment from "moment";

export function UpdateTrainerProfile() {
  const navigate = useNavigate();

  const [trainerInterests, setTrainerInterests] = useState([]);
  const [trainerDesignations, setTrainerDesignations] = useState([]);
  const [trainerSpecialities, setTrainerSpecialities] = useState([]);
  const [trainerLevels, setTrainerLevels] = useState([]);
  const [kycDocuments, setKycDocumnets] = useState<any[]>([]);
  const [uploadedGalleryImages, setUploadedGalleryImages] = useState<any[]>([]);

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
    getFieldProps,
    setValues,
  } = useFormik({
    onSubmit: async function (
      values: TrainerValues,
      helpers: FormikHelpers<TrainerValues>
    ) {
      // certificate
      let certificates = [];
      for (let certificate of certificateInputFields) {
        if (
          certificate.title &&
          (certificate?.file?.filename || certificate.certificateFile)
        ) {
          let certificateFile =
            certificate?.file?.filepath || certificate.certificateFile;

          certificates.push({
            title: certificate.title,
            certificateFile: certificateFile,
          });
        }
      }

      // kycDocuments
      let kycDocs = [];
      let kycErrorCount = 0;
      let requiredDocs = [...kycDocuments];
      for (let i = 0; i < requiredDocs.length; i++) {
        if (requiredDocs[i]?.file?.filename || requiredDocs[i].documentFile) {
          let documentFile =
            requiredDocs[i]?.file?.filepath || requiredDocs[i].documentFile;

          kycDocs.push({
            title: requiredDocs[i].title,
            documentFile: documentFile,
          });
        } else {
          requiredDocs[i].error = `${requiredDocs[i].title} is required field`;
          kycErrorCount++;
        }
      }

      if (kycErrorCount != 0) {
        toast.error("Fill all the required fields");
        setKycDocumnets(requiredDocs);
        return;
      }

      const newValue = {
        ...values,
        specialities: values.specialities?.map(({ value }) => value),
        interests: values.interests?.map(({ value }) => value),
        level: values.level?.value,
        designation: values.designation?.value,
        certificates,
        kycDocuments: kycDocs,
        gallery: uploadedGalleryImages || [],
        password: undefined,
      };

      const apiResponse = await put(`/trainers/updateProfile`, newValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
    },
    initialValues: trainerInitialValues,
    validationSchema: updateTrainerSchema,
  });

  type Certificate = {
    title: string;
    file: any | null;
    error: string;
    documentFile?: string;
    certificateFile?: string;
  };
  const [certificateInputFields, setCertificateInputFields] = useState<
    Certificate[]
  >([
    {
      title: "",
      file: null,
      error: "",
    },
  ]);
  const handleAddCertificateFields = () => {
    setCertificateInputFields([
      ...certificateInputFields,
      { title: "", file: null, error: "" },
    ]);
  };
  const handleRemoveCertificateFields = (index: number) => {
    const updatedInputFields = [...certificateInputFields];
    updatedInputFields.splice(index, 1);
    setCertificateInputFields(updatedInputFields);
  };

  // get trainer specialities
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/trainerSpecialities", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.title,
            value: value._id,
          };
        });
        setTrainerSpecialities(modifiedValue);
      }
    }

    getData();
  }, []);

  // get trainer interests
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/trainerInterests", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.title,
            value: value._id,
          };
        });
        setTrainerInterests(modifiedValue);
      }
    }

    getData();
  }, []);

  // get trainer designations
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/trainerDesignations", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.title,
            value: value._id,
          };
        });
        setTrainerDesignations(modifiedValue);
      }
    }

    getData();
  }, []);

  // get trainer interests
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/trainerLevels", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.title,
            value: value._id,
          };
        });
        setTrainerLevels(modifiedValue);
      }
    }

    getData();
  }, []);

  // get kyc documents
  // useEffect(function () {
  //   async function getData() {
  //     const apiResponse = await get("/kycDocuments", true);
  //     if (apiResponse?.status == 200) {
  //       setKycDocumnets(apiResponse.body);
  //     }
  //   }

  //   getData();
  // }, []);

  // handleUploadFile
  async function handleUploadFile(
    event: React.ChangeEvent<HTMLInputElement>,
    acceptType: any,
    index: number
  ) {
    const mimeTypes = acceptType?.map((value: any) => value.mimeType) || [
      "application/pdf",
    ];

    const files = event.target.files;
    const inputElementName: "certificateFile" | "kycFile" = event.target
      .name as "certificateFile" | "kycFile";

    if (!files || files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();

    // Validate MIME type and append valid files to FormData
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if the file's MIME type is in the allowed list
      if (!mimeTypes.includes(file.type)) {
        if (inputElementName == "kycFile") {
          let kycDocsFiles = [...kycDocuments];
          kycDocuments[index]["error"] = "File type is not allowed";
          return setKycDocumnets(kycDocsFiles);
        } else if (inputElementName == "certificateFile") {
          let certificateFields = [...certificateInputFields];
          certificateFields[index]["error"] = "File type is not allowed";
          return setCertificateInputFields(certificateFields);
        }
      }
    }

    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      let url = `${API_URL}/fileUploads`;
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const apiData = await apiResponse.json();

      if (apiData.status == 200) {
        if (inputElementName == "kycFile") {
          let kycDocsFiles = [...kycDocuments];
          kycDocuments[index]["error"] = "";
          kycDocuments[index]["file"] = apiData.body[0];
          setKycDocumnets(kycDocsFiles);
        } else if (inputElementName == "certificateFile") {
          let certificateFields = [...certificateInputFields];
          certificateFields[index]["error"] = "";
          certificateFields[index]["file"] = apiData.body[0];
          setCertificateInputFields(certificateFields);
        }
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteFile
  async function handleDeleteFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
    index: number,
    deleteFile?: "kycFile" | "certificateFile"
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);
      // if (apiResponse?.status == 200) {
      if (apiResponse?.status == 200 || apiResponse?.status == 400) {
        if (deleteFile == "kycFile") {
          let kycDocsFiles = [...kycDocuments];
          kycDocuments[index]["error"] = "";
          kycDocuments[index]["file"] = null;
          kycDocuments[index]["documentFile"] = "";
          setKycDocumnets(kycDocsFiles);
        } else if (deleteFile == "certificateFile") {
          let certificateFields = [...certificateInputFields];
          certificateFields[index]["error"] = "";
          certificateFields[index]["file"] = null;
          certificateFields[index]["certificateFile"] = "";
          setCertificateInputFields(certificateFields);
        }
      } else {
        toast.error(apiResponse?.message);
      }

      // Clear the input field value after the file is deleted successfully
      if (deleteFile == "kycFile") {
        const fileInput = document.getElementById(
          `kycInputFile${index}`
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ""; // Clear the input field
        }
      } else if (deleteFile == "certificateFile") {
        const fileInput = document.getElementById(
          `certificateInputFile${index}`
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ""; // Clear the input field
        }
      }
    } catch (error: any) {
      // toast.error(error?.message);
    }
  }

  // handleUploadProfilePic
  async function handleUploadProfilePic(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    const files = event.target.files;

    if (!files || files.length === 0) {
      setFieldTouched("profilePhoto", true);
      setFieldError("profilePhoto", "Profile Photo is required field");
      toast.error("Profile Photo is required field");
      return;
    }

    // Validate MIME type and append valid files to FormData
    // Check if the file's MIME type is in the allowed list
    let file = files[0];
    if (!mimeTypes.includes(file.type)) {
      setFieldTouched("profilePhoto", true);
      setFieldError("profilePhoto", "Must select the valid image file");
      toast.error("Must select the valid image file");
      console.log("error");
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
        setFieldTouched("profilePhoto", false);
        setFieldError("profilePhoto", "");
        setFieldValue("profilePhoto", apiData.body[0].filepath);
      } else {
        setFieldTouched("profilePhoto", false);
        setFieldError("profilePhoto", apiData.message);
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
        setFieldError("profilePhoto", "");
        setFieldValue("profilePhoto", "");
      } else {
        setFieldError("profilePhoto", "");
        setFieldValue("profilePhoto", "");
        toast.error(apiResponse?.message);
      }

      const fileInput = document.getElementById(
        `profilePhotoFile`
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ""; // Clear the input field
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleUpladGalleryImages
  async function handleUpladGalleryImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const mimeTypes = ["image/jpeg", "image/png", "image/webp"];

    const files = event.target.files;

    if (!files || files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();

    // Validate MIME type and append valid files to FormData
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if the file's MIME type is in the allowed list
      if (!mimeTypes.includes(file.type)) {
        // if (inputElementName == "kycFile") {
        //   let kycDocsFiles = [...kycDocuments];
        //   kycDocuments[index]["error"] = "File type is not allowed";
        //   return setKycDocumnets(kycDocsFiles);
        // } else if (inputElementName == "certificateFile") {
        //   let certificateFields = [...faqsInputFields];
        //   certificateFields[index]["error"] = "File type is not allowed";
        //   return setFaqsInputFields(certificateFields);
        // }
      }
    }

    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      let url = `${API_URL}/fileUploads`;
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const apiData = await apiResponse.json();

      if (apiData.status == 200) {
        let images = apiData?.body?.map((item: any) => item.filepath);

        setUploadedGalleryImages((old) => {
          return [...old, ...images];
        });
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteGalleryImage
  async function handleDeleteGalleryImage(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
    index: number
  ) {
    event.preventDefault();
    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);

      if (apiResponse?.status == 200) {
        let images = [...uploadedGalleryImages];
        images.splice(index, 1);
        setUploadedGalleryImages(images);
      } else {
        let images = [...uploadedGalleryImages];
        images.splice(index, 1);
        setUploadedGalleryImages(images);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // Get Data From Database
  useEffect(function () {
    async function getData() {
      setLoading(true);
      let url = `/trainers/profile`;
      const apiResponse = await get(url, true);
      if (apiResponse?.status == 200) {
        const apiData = apiResponse.body;
        delete apiData.isDeleted;
        delete apiData.createdAt;
        delete apiData.updatedAt;
        delete apiData._id;
        delete apiData.status;

        apiData.password = "";

        apiData.dob = moment(apiData.dob).format("YYYY-MM-DD");
        apiData.level = {
          label: apiData?.level?.title,
          value: apiData?.level?._id,
        };

        apiData.designation = {
          label: apiData?.designation?.title,
          value: apiData?.designation?._id,
        };

        // interests
        apiData.interests = apiData?.interests?.map((interest: any) => {
          return {
            label: interest.title,
            value: interest._id,
          };
        });

        apiData.specialities = apiData?.specialities?.map((sepciality: any) => {
          return {
            label: sepciality.title,
            value: sepciality._id,
          };
        });

        // Certificate
        let certificates = apiData?.certificates?.map((certificate: any) => {
          return {
            title: certificate.title,
            certificateFile: certificate.certificateFile,
          };
        });
        setCertificateInputFields(certificates);

        // docs
        setKycDocumnets(apiData.kycDocuments);

        if (apiData?.gallery?.length) {
          setUploadedGalleryImages(apiData.gallery);
        }

        setValues(apiData);
      } else {
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    }
    getData();
  }, []);

  function getFileNameFromUrl(url: any) {
    // Create a URL object
    const urlObj = new URL(url);

    // Get the pathname from the URL
    const pathname = urlObj.pathname;

    // Extract the last part of the pathname as the filename
    const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

    return fileName;
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Update Profile</h4>
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
          <form className="forms-sample" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="card rounded-2">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Personal Details</h5>
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Trainer Name"
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue("name", validateText(evt.target.value));
                      }}
                      type="text"
                      placeholder="Enter trainer name"
                      value={values.name}
                      required={true}
                      touched={touched.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Trainer User Name"
                      name="userName"
                      handleBlur={handleBlur}
                      handleChange={(evt) => {
                        setFieldValue(
                          "userName",
                          validateUsername(evt.target.value)
                        );
                      }}
                      type="text"
                      placeholder="Enter trainer username"
                      value={values.userName}
                      required={true}
                      touched={touched.userName}
                      error={errors.userName}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Trainer Designation"
                      placeholder="Select Designation"
                      name="designation"
                      required={true}
                      options={trainerDesignations}
                      value={values.designation}
                      error={errors.designation}
                      touched={touched.designation}
                      handleChange={(value) => {
                        setFieldValue("designation", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("designation", true);
                      }}
                      isMulti={false}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="DOB"
                      name="dob"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="date"
                      placeholder="Enter DOB"
                      value={values.dob}
                      required={true}
                      touched={touched.dob}
                      error={errors.dob}
                    />
                  </div>

                  <div className="form-group col-md-6">
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
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Trainer Level"
                      placeholder="Select Level"
                      name="level"
                      required={true}
                      options={trainerLevels}
                      value={values.level}
                      error={errors.level}
                      touched={touched.level}
                      handleChange={(value) => {
                        setFieldValue("level", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("level", true);
                      }}
                    />
                  </div>

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
                    <InputBox
                      label="Mobile"
                      name="mobile"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter mobile"
                      value={values.mobile}
                      required={true}
                      touched={touched.mobile}
                      error={errors.mobile}
                    />
                  </div>

                  {/* <div className="form-group col-md-6">
                    <InputBox
                      label="Password"
                      name="password"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter password"
                      value={values.password}
                      required={true}
                      touched={touched.password}
                      error={errors.password}
                    />
                  </div> */}

                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Bio"
                      name="bio"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Trainer bio"
                      value={values.bio}
                      touched={touched.bio}
                      error={errors.bio}
                    />
                  </div>

                  <div className="form-group col-md-8">
                    <label htmlFor={"profilePhotoFile"}>
                      Profile Photo <span className="text-danger"> *</span>
                    </label>
                    <div className="d-flex gap-2">
                      <input
                        type="file"
                        name="profilePhotoFile"
                        id="profilePhotoFile"
                        onChange={(evt) => {
                          handleUploadProfilePic(evt);
                        }}
                        className="form-control"
                      />
                      {values.profilePhoto ? (
                        <Link to={`${values.profilePhoto}`} target="_blank">
                          <img
                            className="img"
                            height={43}
                            width={43}
                            src={`${values.profilePhoto}`}
                          />
                        </Link>
                      ) : null}
                      {values.profilePhoto ? (
                        <button
                          type="button"
                          className="btn p-1"
                          onClick={(evt) => {
                            handleDeleteProfilePic(
                              evt,
                              getFileNameFromUrl(values?.profilePhoto)
                            );
                          }}
                        >
                          <i className="fa fa-trash text-danger"></i>
                        </button>
                      ) : null}
                    </div>
                    {touched.profilePhoto && errors.profilePhoto ? (
                      <p className="custom-form-error text-danger">
                        {errors.profilePhoto}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Other Details</h5>
                  </div>

                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Trainer Interests"
                      placeholder="Select Interests"
                      name="interests"
                      required={true}
                      options={trainerInterests}
                      value={values.interests}
                      error={errors.interests}
                      touched={touched.level}
                      handleChange={(value) => {
                        setFieldValue("interests", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("interests", true);
                      }}
                      isMulti={true}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Trainer Speciality"
                      placeholder="Select Speciality"
                      name="specialities"
                      required={true}
                      options={trainerSpecialities}
                      value={values.specialities}
                      error={errors.specialities}
                      touched={touched.level}
                      handleChange={(value) => {
                        setFieldValue("specialities", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("specialities", true);
                      }}
                      isMulti={true}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <InputBox
                      label="Meeting Link"
                      name="meetingLink"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter meeting link"
                      value={values.meetingLink}
                      required={false}
                      touched={touched.meetingLink}
                      error={errors.meetingLink}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer Certificates */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h5 className="mb-2">Trainer Certificates</h5>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleAddCertificateFields}
                    >
                      <i className="fas fa-plus text-info"></i>
                    </button>
                  </div>
                  <div className="form-group col-md-12">
                    {certificateInputFields.map((feild, index) => {
                      let filename = feild?.file?.filename;
                      if (feild.certificateFile)
                        filename = getFileNameFromUrl(feild?.certificateFile);
                      return (
                        <div className="row mb-2">
                          <div className="mb-1 form-group col-md-5" key={index}>
                            <label htmlFor={""}>Certificate Title</label>
                            <input
                              className="form-control"
                              value={feild.title}
                              onChange={(e) => {
                                const updatedInputFields = [
                                  ...certificateInputFields,
                                ];
                                updatedInputFields[index]["title"] =
                                  e.target.value;
                                setCertificateInputFields(updatedInputFields);
                              }}
                              placeholder="Cretificate title"
                            />
                          </div>

                          <div className="mb-1 form-group col-md-6">
                            <label htmlFor={""}>Certificate PDF</label>
                            <div className="d-flex gap-1">
                              <input
                                className="form-control"
                                type="file"
                                accept=".pdf"
                                name="certificateFile"
                                // value={feild.file}
                                id={`certificateInputFile${index}`}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleUploadFile(event, null, index);
                                }}
                                placeholder="Cretificate title"
                              />

                              <div className="d-flex gap-2 align-items-center">
                                {filename ? (
                                  <Link
                                    target="_blank"
                                    to={`/fileDetails/${filename}`}
                                    className="btn bg-light border"
                                  >
                                    <i className="fa fa-check-circle text-success"></i>
                                  </Link>
                                ) : null}
                                {filename ? (
                                  <button
                                    className="btn bg-light border"
                                    type="button"
                                    onClick={(event) => {
                                      handleDeleteFile(
                                        event,
                                        filename,
                                        index,
                                        "certificateFile"
                                      );
                                    }}
                                  >
                                    <i className="fa fa-trash text-danger"></i>
                                  </button>
                                ) : null}
                              </div>

                              {index != 0 ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveCertificateFields(index)
                                  }
                                  className="btn bg-light border"
                                >
                                  <i className="fas fa-close text-danger"></i>
                                </button>
                              ) : null}
                            </div>

                            <p className="custom-form-error text-danger">
                              {feild?.error}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer KYC Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Trainer KYC Details</h5>
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Address"
                      name="address"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter address"
                      value={values.address}
                      required={true}
                      touched={touched.address}
                      error={errors.address}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Locality"
                      name="locality"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter locality"
                      value={values.locality}
                      required={true}
                      touched={touched.locality}
                      error={errors.locality}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="City"
                      name="city"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter city"
                      value={values.city}
                      required={true}
                      touched={touched.city}
                      error={errors.city}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Pincode"
                      name="pincode"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter pincode"
                      value={values.pincode}
                      required={true}
                      touched={touched.pincode}
                      error={errors.pincode}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Country"
                      name="country"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter country"
                      value={values.country}
                      required={true}
                      touched={touched.country}
                      error={errors.country}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="State"
                      name="state"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter state"
                      value={values.state}
                      required={true}
                      touched={touched.state}
                      error={errors.state}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    {kycDocuments?.map((kycDocument: any, index: number) => {
                      const extensions = kycDocument?.formats
                        ?.map((value: any) => {
                          return `.${value.format}`;
                        })
                        .join(",");

                      let filename = kycDocument?.file?.filename;
                      if (kycDocument.documentFile)
                        filename = getFileNameFromUrl(kycDocument.documentFile);

                      return (
                        <div className="row mb-2">
                          <div className="mb-1 form-group col-md-5 d-flex gap-2">
                            <div className="">
                              <label htmlFor={""}>
                                {kycDocument.title}{" "}
                                <span className="text-danger">*</span>{" "}
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                name="kycFile"
                                accept={extensions}
                                onChange={(event) => {
                                  handleUploadFile(
                                    event,
                                    kycDocument.formats,
                                    index
                                  );
                                }}
                                id={`kycInputFile${index}`}
                              />
                              {kycDocument.error ? (
                                <p className="custom-form-error text-danger">
                                  {kycDocument.error}
                                </p>
                              ) : null}
                            </div>
                            <div className="d-flex gap-2 align-items-center pt-4">
                              {filename ? (
                                <Link
                                  target="_blank"
                                  to={`/fileDetails/${filename}`}
                                  className="btn p-1"
                                >
                                  <i
                                    className="fa fa-check-circle text-success"
                                    style={{ fontSize: "20px" }}
                                  ></i>
                                </Link>
                              ) : null}
                              {filename ? (
                                <button
                                  className="btn p-1"
                                  type="button"
                                  onClick={(event) => {
                                    handleDeleteFile(
                                      event,
                                      filename,
                                      index,
                                      "kycFile"
                                    );
                                  }}
                                >
                                  <i
                                    className="fa fa-trash text-danger"
                                    style={{ fontSize: "20px" }}
                                  ></i>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer Gallery */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-3">Trainer Gallery</h5>
                  </div>

                  <div className="form-group col-md-8">
                    <label htmlFor={"imagesFile"}>Select Images</label>
                    <div className="d-flex gap-2">
                      <input
                        type="file"
                        name="imagesFile"
                        id="imagesFile"
                        onChange={(evt) => {
                          handleUpladGalleryImages(evt);
                        }}
                        className="form-control"
                        multiple={true}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="d-flex gap-4">
                      {uploadedGalleryImages?.map(
                        (file: any, index: number) => {
                          return (
                            <div className="gallery-image">
                              <button
                                type="button"
                                className="btn btn-danger gallery-image-remove"
                                onClick={(evt) => {
                                  handleDeleteGalleryImage(
                                    evt,
                                    file.filename,
                                    index
                                  );
                                }}
                              >
                                X
                              </button>
                              <img className="img img-thumbnail" src={file} />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-3">Social Links</h5>
                  </div>
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Facebook"
                      name="facebook"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="url"
                      placeholder="Enter facebook url"
                      value={values.facebook}
                      touched={touched.facebook}
                      error={errors.facebook}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Instagram"
                      name="instagram"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="url"
                      placeholder="Enter instagram url"
                      value={values.instagram}
                      required={false}
                      touched={touched.instagram}
                      error={errors.instagram}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Twitter (X)"
                      name="x"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="url"
                      placeholder="Enter twitter url"
                      value={values.x}
                      required={false}
                      touched={touched.x}
                      error={errors.x}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Linkedin"
                      name="linkedin"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="url"
                      placeholder="Enter linkedin url"
                      value={values.linkedin}
                      required={false}
                      touched={touched.linkedin}
                      error={errors.linkedin}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Youtube"
                      name="youtube"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="url"
                      placeholder="Enter youtube url"
                      value={values.youtube}
                      required={false}
                      touched={touched.youtube}
                      error={errors.youtube}
                    />
                  </div>
                </div>

                <SubmitButton loading={false} text="Update Profile" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
