import * as Yup from "yup";

export const trainerInterestSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  status: Yup.string().required().label("Status"),
});

export const trainerInterestInitialValues: TrainerInterestValues = {
  title: "",
  status: "true",
};

export interface TrainerInterestValues {
  title: string;
  status: string;
}
