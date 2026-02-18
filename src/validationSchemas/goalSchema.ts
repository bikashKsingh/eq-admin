import * as Yup from "yup";

export const goalSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  image: Yup.string().optional().label("Image"),
  status: Yup.string().label("Status"),
  displayOrder: Yup.string().label("Display Order"),
});

export const goalInitialValues: GoalValues = {
  title: "",
  image: "",
  status: "true",
  displayOrder: "0",
};

export interface GoalValues {
  title: string;
  image: string;
  displayOrder: string;
  status: string;
}
