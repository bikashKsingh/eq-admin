import { GoBackButton, InputBox, SubmitButton } from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  calendarSchema,
  CalendarValues,
  calendarInitialValues,
} from "../../validationSchemas/calendarSchema";
import { generateSlug, validateTextNumber } from "../../utills";
import { useGoogleLogin } from "@react-oauth/google";
import { useRef } from "react";

export function AddCalendar() {
  const latestFormValues = useRef<CalendarValues>(calendarInitialValues);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    onSubmit: async function (
      values: CalendarValues,
      helpers: FormikHelpers<CalendarValues>
    ) {
      latestFormValues.current = values;
      login(); // call the login function defined using useGoogleLogin
    },
    initialValues: calendarInitialValues,
    validationSchema: calendarSchema,
  });

  function handleTitleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = validateTextNumber(evt.target.value);
    let name = evt.target.name;
    setFieldValue(name, value);
    let slug = generateSlug(value);
    setFieldValue("slug", slug);
  }

  const createCalendarEvent = async (
    accessToken: string,
    eventDetails: CalendarValues
  ) => {
    try {
      const response = await fetch("http://localhost:5500/api/v1/calendars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: accessToken,
          eventData: {
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: eventDetails.start,
            end: eventDetails.end,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create calendar event:", errorData);
        return false;
      }

      const responseData = await response.json();
      console.log("Calendar event created successfully:", responseData);
      return true;
    } catch (error) {
      console.error("There was an error sending the request:", error);
      return false;
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    const accessToken = tokenResponse.access_token;

    console.log(tokenResponse);

    await createCalendarEvent(accessToken, latestFormValues.current);
  };

  // ✅ This hook must be called at the top level
  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    scope: "https://www.googleapis.com/auth/calendar.events",
  });

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Calendar</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin">
          <form className="forms-sample" onSubmit={handleSubmit}>
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Summary"
                      name="summary"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter summary"
                      value={values.summary}
                      required={true}
                      touched={touched.summary}
                      error={errors.summary}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Description"
                      name="description"
                      handleBlur={handleBlur}
                      handleChange={handleTitleChange}
                      type="text"
                      placeholder="Enter description"
                      value={values.description}
                      required={true}
                      touched={touched.description}
                      error={errors.description}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Start"
                      name="start"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="datetime-local"
                      placeholder="Enter category start"
                      value={values.start}
                      required={true}
                      touched={touched.start}
                      error={errors.start}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="End"
                      name="end"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="datetime-local"
                      placeholder="Enter end"
                      value={values.end}
                      required={true}
                      touched={touched.end}
                      error={errors.end}
                    />
                  </div>

                  <div className="">
                    <SubmitButton loading={false} text="Schedule Meeting" />
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
