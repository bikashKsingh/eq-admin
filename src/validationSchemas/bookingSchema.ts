import * as Yup from "yup";
import { BOOKING_STATUS } from "../utills";

export const bookingSchema = Yup.object({
  trainer: Yup.object().label("Trainer"),
  activationDate: Yup.string().label("Activatio Date"),
  bookingStatus: Yup.string().label("Booking Status"),
});

export const bookingInitialValues: BookingValues = {
  trainer: null,
  activationDate: "",
  bookingStatus: "BOOKED",
};

export interface BookingValues {
  trainer: {
    label: string;
    value: string;
  } | null;
  activationDate: string;
  bookingStatus: BOOKING_STATUS;
}
