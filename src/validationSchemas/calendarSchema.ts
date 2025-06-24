import * as Yup from "yup";

export const calendarSchema = Yup.object({
  summary: Yup.string().required().label("Summary"),
  description: Yup.string().required().label("Description"),
  start: Yup.string().required().label("Start"),
  end: Yup.string().required().label("End"),
});

export const calendarInitialValues: CalendarValues = {
  summary: "",
  description: "",
  start: "",
  end: "",
};

export interface CalendarValues {
  summary: string;
  description: string;
  start: string;
  end: string;
}
