import * as Yup from "yup";

export const planTypeSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  isDefault: Yup.string().required().label("Default"),
  status: Yup.string().required().label("Status"),
});

export const planTypeInitialValues: PlanTypeValues = {
  title: "",
  isDefault: "false",
  status: "true",
};

export interface PlanTypeValues {
  title: string;
  isDefault: string;
  status: string;
}
