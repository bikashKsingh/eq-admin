import * as Yup from "yup";

export const goalSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  image: Yup.string().required().label("Image"),
  status: Yup.string().label("Status"),
});

export const goalInitialValues: GoalValues = {
  title: "",
  image: "",
  status: "true",
};

export interface GoalValues {
  title: string;
  image: string;
  status: string;
}
