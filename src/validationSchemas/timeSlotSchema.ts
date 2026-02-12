import * as Yup from "yup";

export const timeSlotSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  image: Yup.string().required().label("Image"),
  isGroupAvailable: Yup.string().required().label("Is Group Available"),
  displayOrder: Yup.string().required().label("Display Order"),
  status: Yup.string().label("Status"),
});

export const timeSlotInitialValues: TimeSlotValues = {
  title: "",
  image: "",
  isGroupAvailable: "false",
  displayOrder: "1",
  status: "true",
};

export interface TimeSlotValues {
  title: string;
  image: string;
  isGroupAvailable: string;
  displayOrder: string;
  status: string;
}
