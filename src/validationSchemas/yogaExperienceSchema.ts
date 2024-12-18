import * as Yup from "yup";

export const yogaExperienceSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  displayOrder: Yup.string().required().label("Display Order"),
  status: Yup.string().required().label("Status"),
});

export const yogaExperienceInitialValues: YogaExperienceValues = {
  title: "",
  displayOrder: "1",
  status: "true",
};

export interface YogaExperienceValues {
  title: string;
  displayOrder: string;
  status: string;
}
