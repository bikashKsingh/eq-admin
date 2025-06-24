import * as Yup from "yup";

export const bookingTimeSlotSchema = Yup.object({
  title: Yup.string().required().label("Title"),

  categories: Yup.array().required().label("Title"),

  status: Yup.string().required().label("Status"),

  displayOrder: Yup.string().required().label("Display Order"),

  monday: Yup.string().label("Monday"),
  mondayTime: Yup.string().label("Monday Time"),

  tuesday: Yup.string().label("Tuesday"),
  tuesdayTime: Yup.string().label("Tuesday Time"),

  wednesday: Yup.string().label("Wednesday"),
  wednesdayTime: Yup.string().label("Wednesday Time"),

  thursday: Yup.string().label("Thursday"),
  thursdayTime: Yup.string().label("Thursday Time"),

  friday: Yup.string().label("Friday"),
  fridayTime: Yup.string().label("Friday Time"),

  saturday: Yup.string().label("Saturday"),
  saturdayTime: Yup.string().label("Saturday Time"),

  sunday: Yup.string().label("Sunday"),
  sundayTime: Yup.string().label("Sunday Time"),
});

export const bookingTimeSlotInitialValues: BookingTimeSlotValues = {
  title: "",

  categories: null,

  status: "true",

  displayOrder: "0",

  monday: "false",
  mondayTime: "",

  tuesday: "false",
  tuesdayTime: "",

  wednesday: "false",
  wednesdayTime: "",

  thursday: "false",
  thursdayTime: "",

  friday: "false",
  fridayTime: "",

  saturday: "false",
  saturdayTime: "",

  sunday: "false",
  sundayTime: "",
};

export interface BookingTimeSlotValues {
  title: string;

  categories: { label: string; value: string }[] | null;

  status: string;

  displayOrder: string;

  monday: string;
  mondayTime: string;

  tuesday: string;
  tuesdayTime: string;

  wednesday: string;
  wednesdayTime: string;

  thursday: string;
  thursdayTime: string;

  friday: string;
  fridayTime: string;

  saturday: string;
  saturdayTime: string;

  sunday: string;
  sundayTime: string;
}
