import * as Yup from "yup";

export const programRequirementSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  status: Yup.string().required().label("Status"),
});

export const programRequirementInitialValues: ProgramRequirementValues = {
  title: "",
  status: "true",
};

export interface ProgramRequirementValues {
  title: string;
  status: string;
}
