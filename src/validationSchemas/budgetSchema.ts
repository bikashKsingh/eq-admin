import * as Yup from "yup";

export const budgetSchema = Yup.object({
  minimum: Yup.string().required().label("Minimum Amount"),
  maximum: Yup.string().required().label("Maximum Amount"),
  displayOrder: Yup.string().required().label("Display Order"),
  shortDescription: Yup.string().label("Short Description"),
  status: Yup.string().required().label("Status"),
});

export const budgetInitialValues: BudgetValues = {
  minimum: "0",
  maximum: "0",
  displayOrder: "1",
  shortDescription: "",
  status: "true",
};

export interface BudgetValues {
  minimum: string;
  maximum: string;
  displayOrder: string;
  shortDescription: string;
  status: string;
}
