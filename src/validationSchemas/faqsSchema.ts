import * as Yup from "yup";

export const faqsSchema = Yup.object({
  question: Yup.string().required().label("Question"),
  answer: Yup.string().required().label("Answer"),

  status: Yup.string().label("Status"),
});

export const faqsInitialValues: FaqsValue = {
  question: "",
  answer: "",
  status: "true",
};

export interface FaqsValue {
  question: string;
  answer: string;

  status: string;
}
