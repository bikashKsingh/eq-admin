import * as Yup from "yup";

export const addProgramSchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),
  category: Yup.object().required().label("Category"),

  subCategory: Yup.object().required().label("Sub Category"),
  displayOrder: Yup.number().required().label("Display Order"),
  isTrial: Yup.string().label("Is Trial"),

  defaultImage: Yup.string().required().label("Default Image"),
  defaultVideo: Yup.string().url().label("Default Image"),

  images: Yup.array().nullable().label("Images"),
  descriptions: Yup.string().required().label("Descriptions"),
  highlights: Yup.string().optional().label("Highlights"),
  requirements: Yup.array().optional().label("Requirements"),

  benefits: Yup.string().optional().label("Benefits"),
  howItWorks: Yup.string().optional().label("How It Works"),

  faqs: Yup.array().nullable().label("Faqs"),

  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
  status: Yup.string().required().label("Status"),
});

export const programInitialValues: ProgramValues = {
  name: "",
  slug: "",
  category: null,
  subCategory: null,
  displayOrder: "0",
  isTrial: "false",
  defaultImage: "",
  defaultVideo: "",
  images: null,
  descriptions: "",
  highlights: "",
  requirements: null,
  faqs: null,
  benefits: "",
  howItWorks: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  status: "true",
};

export interface ProgramValues {
  name: string;
  slug: string;
  category: {
    label: string;
    value: string;
  } | null;

  subCategory: {
    label: string;
    value: string;
  } | null;
  displayOrder: string;
  isTrial: string;

  defaultImage: string;
  defaultVideo: string;
  images: string[] | null;
  descriptions: string;
  highlights: string;
  requirements: any[] | null;
  faqs: any[] | null;
  benefits: string;
  howItWorks: string;

  //   profilePhoto: FileType | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
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
