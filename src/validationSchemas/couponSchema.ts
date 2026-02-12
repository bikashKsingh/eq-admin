import * as Yup from "yup";
import {
  CoponUserTypes,
  CouponDiscountTypes,
  CouponStatusTypes,
  CouponLevelTypes,
} from "../constants";

export const couponSchema = Yup.object({
  couponCode: Yup.string().required().label("Coupon Code"),
  applyFor: Yup.object().required().label("Apply For"),
  discountType: Yup.object().required().label("Discount Type"),
  discount: Yup.number().required().label("Discount"),

  categories: Yup.array().nullable().label("Categories"),
  programs: Yup.array().nullable().label("Programs"),
  plans: Yup.array().nullable().label("Plans"),
  autoApply: Yup.string().label("Auto Apply"),

  couponLevel: Yup.object().required().label("Coupon Level"),

  description: Yup.string().label("Description"),
  minimumAmount: Yup.number().required().label("Minimum Amount"),
  numberOfUsesTimes: Yup.number().required().label("No of Uses"),
  startDate: Yup.string().required().label("Start Date"),
  expiryDate: Yup.string().required().label("Expiry Date"),
  couponStatus: Yup.object().required().label("Coupon Status"),
});

export const couponInitialValues: CouponValues = {
  couponCode: "",
  applyFor: null,
  discountType: null,
  discount: "",

  categories: null,
  programs: null,
  plans: null,
  autoApply: "false",

  couponLevel: null,

  description: "",
  minimumAmount: "",
  numberOfUsesTimes: "",
  startDate: "",
  expiryDate: "",
  couponStatus: null,
};

export interface CouponValues {
  couponCode: string;
  applyFor: {
    label: string;
    value: CoponUserTypes;
  } | null;
  discountType: {
    label: string;
    value: CouponDiscountTypes;
  } | null;
  discount: string;

  categories:
    | {
        label: string;
        value: string;
      }[]
    | null;
  programs:
    | {
        label: string;
        value: string;
      }[]
    | null;
  plans:
    | {
        label: string;
        value: string;
      }[]
    | null;
  autoApply: string;

  couponLevel: {
    label: string;
    value: CouponLevelTypes;
  } | null;

  description: string;
  minimumAmount: string;
  numberOfUsesTimes: string;
  startDate: string;
  expiryDate: string;
  couponStatus: {
    label: string;
    value: CouponStatusTypes;
  } | null;
}
