import * as Yup from "yup";

export const planSchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),
  days: Yup.string().required().label("Days"),
  allowSubscription: Yup.string().required().label("Allwo Subscription"),
  subscriptionDiscountPercentage: Yup.number()
    .required()
    .label("Off Percentage"),
  status: Yup.bool().label("Status"),
});

export const planInitialValues: PlanValues = {
  name: "",
  slug: "",
  days: "0",
  allowSubscription: "false",
  subscriptionDiscountPercentage: "0",
  status: "true",
};

export interface PlanValues {
  name: string;
  slug: string;
  days: string;
  allowSubscription: string;
  subscriptionDiscountPercentage: string;
  status: string;
}
