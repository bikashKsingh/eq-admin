import * as Yup from "yup";

export const programSchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),
  category: Yup.object().required().label("Category"),

  sessionDuration: Yup.string().required().label("Session Duration"),
  displayOrder: Yup.number().required().label("Display Order"),
  isTrial: Yup.string().label("Is Trial"),

  compareWith: Yup.object().nullable().label("Compare With"),

  defaultImage: Yup.string().required().label("Default Image"),
  defaultVideo: Yup.string().url().label("Default Image"),

  images: Yup.array().nullable().label("Images"),
  shortDescriptions: Yup.string().required().label("Short Descriptions"),
  rescheduleAndCancelPolicy: Yup.string()
    .required()
    .label("Rescheduling and Cancellation Policy"),
  highlights: Yup.string().optional().label("Highlights"),
  requirements: Yup.array().optional().label("Requirements"),

  inclusionsAndbenefits: Yup.string()
    .optional()
    .label("Inclusions and Benefits"),
  programValidityPolicy: Yup.string()
    .optional()
    .label("Program Validity Policy"),

  faqs: Yup.array().nullable().label("Faqs"),

  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
  status: Yup.string().required().label("Status"),

  goals: Yup.array().label("Goals"),
  ageRanges: Yup.array().label("Age Ranges"),
  isInjured: Yup.string().label("IS Injured"),
  yogaExperiences: Yup.array().label("Yoga Experiences"),
  timeSlots: Yup.array().label("Time Slots"),
  // budgets: Yup.array().label("Budgets"),
});

export const programInitialValues: ProgramValues = {
  name: "",
  slug: "",
  category: null,
  sessionDuration: "0",
  displayOrder: "0",
  isTrial: "false",
  compareWith: null,

  defaultImage: "",
  defaultVideo: "",
  images: null,
  shortDescriptions: "",
  rescheduleAndCancelPolicy: "",
  highlights: "",
  requirements: null,
  faqs: null,
  inclusionsAndbenefits: "",
  programValidityPolicy: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  status: "true",

  goals: null,
  ageRanges: null,
  isInjured: "false",
  yogaExperiences: null,
  timeSlots: null,
  // budgets: null,
};

export interface ProgramValues {
  name: string;
  slug: string;
  category: {
    label: string;
    value: string;
  } | null;

  sessionDuration: string;
  displayOrder: string;
  isTrial: string;
  compareWith: {
    label: string;
    value: string;
  } | null;

  defaultImage: string;
  defaultVideo: string;
  images: string[] | null;
  shortDescriptions: string;
  rescheduleAndCancelPolicy: string;
  highlights: string;
  requirements: any[] | null;
  faqs: any[] | null;
  inclusionsAndbenefits: string;
  programValidityPolicy: string;

  //   profilePhoto: FileType | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  status: string;

  goals:
    | {
        label: string;
        value: string;
      }[]
    | null;
  ageRanges:
    | {
        label: string;
        value: string;
      }[]
    | null;
  isInjured: string;
  yogaExperiences:
    | {
        label: string;
        value: string;
      }[]
    | null;
  timeSlots:
    | {
        label: string;
        value: string;
      }[]
    | null;
  // budgets:
  //   | {
  //       label: string;
  //       value: string;
  //     }[]
  //   | null;
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
