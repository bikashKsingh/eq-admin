import * as Yup from "yup";
import { BOOKING_STATUS } from "../utills";

export const bookingSchema = Yup.object({
  trainer: Yup.object().label("Trainer"),
  activatioDate: Yup.string().label("Activatio Date"),
  bookingStatus: Yup.string().label("Booking Status"),
});

export const bookingInitialValues: BookingValues = {
  trainer: null,
  activatioDate: "",
  bookingStatus: "BOOKED",
};

export interface BookingValues {
  trainer: {
    label: string;
    value: string;
  } | null;
  activatioDate: string;
  bookingStatus: BOOKING_STATUS;
}
