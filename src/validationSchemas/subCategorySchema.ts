import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),
  shortDescription: Yup.string().label("Short Description"),
  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
  status: Yup.bool().label("Status"),
});

export const categoryInitialValues: CategoryValues = {
  name: "",
  slug: "",
  shortDescription: "",
  status: "true",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export interface CategoryValues {
  name: string;
  slug: string;
  shortDescription: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
