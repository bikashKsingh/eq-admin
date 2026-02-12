import * as Yup from "yup";

export const trainerLevelSchema = Yup.object({
  title: Yup.string().required().label("Title"),
  displayOrder: Yup.string().required().label("Display Order"),
  status: Yup.string().required().label("Status"),
});

export const trainerLevelInitialValues: TrainerLevelValues = {
  title: "",
  displayOrder: "1",
  status: "true",
};

export interface TrainerLevelValues {
  title: string;
  displayOrder: string;
  status: string;
}
