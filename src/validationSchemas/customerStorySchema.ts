import * as Yup from "yup";

export const customerStorySchema = Yup.object({
  customerName: Yup.string().label("Customer Name"),
  title: Yup.string().label("Title"),
  mediaUrl: Yup.string().required().label("Story Media"),
  mediaType: Yup.string().oneOf(["image", "video"]).required().label("Media Type"),
  displayOrder: Yup.string().required().label("Display Order"),
  status: Yup.string().required().label("Status"),
});

export const customerStoryInitialValues: CustomerStoryValues = {
  customerName: "",
  title: "",
  mediaUrl: "",
  mediaType: "image",
  displayOrder: "1",
  status: "true",
};

export interface CustomerStoryValues {
  customerName: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  displayOrder: string;
  status: string;
}
