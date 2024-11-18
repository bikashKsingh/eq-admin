import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),
  image: Yup.string().required().label("Image"),
  shortDescription: Yup.string().label("Short Description"),
  video: Yup.string().label("Video"),
  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
});

export const categoryInitialValues: CategoryValues = {
  name: "",
  slug: "",
  image: "",
  shortDescription: "",
  video: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export interface CategoryValues {
  name: string;
  slug: string;
  image: string;
  shortDescription: string;
  video: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
