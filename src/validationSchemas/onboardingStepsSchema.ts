import * as Yup from "yup";

export const onboardingStepsSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  categories: Yup.array().required().label("Categories"),
  steps: Yup.array().nullable().label("Steps"),
  status: Yup.string().required().label("Status"),
});

export const onboardingStepsInitialValues: OnboardingStepsValues = {
  title: "",
  categories: null,
  steps: null,
  status: "false",
};

export interface OnboardingStepsValues {
  title: string;
  categories:
    | {
        label: string;
        value: string;
      }[]
    | null;

  steps: any[] | null;
  status: string;
}

export type FileType = {
  fieldname: string;
  encoding: string;
  originalname: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
  filepath: string;
};
