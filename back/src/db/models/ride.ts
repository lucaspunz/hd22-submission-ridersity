import { Schema, model, ObjectId } from "mongoose";

export enum pay_status_enum {
  pending = "pending",
  paid = "paid",
}

export interface IRide {
  driver: ObjectId;

  date: Date;

  seats: number;
  seats_left: number;

  price: number;
  city_from: string;
  city_to: string;

  pickup: string;
  dropoff: string;

  passengers: { _id: ObjectId; pay_status: pay_status_enum }[];
}
const rideSchema = new Schema<IRide>({
  driver: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  seats: { type: Number, required: true },
  seats_left: { type: Number, required: true },
  price: { type: Number, required: true },
  city_from: { type: String, required: true },
  city_to: { type: String, required: true },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  passengers: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      pay_status: { type: String, required: true },
    },
  ],
});
const Ride = model<IRide>("Ride", rideSchema);
export default Ride;
