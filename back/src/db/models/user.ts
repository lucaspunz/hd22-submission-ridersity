import { Schema, model } from "mongoose";

export interface IUser {
  google_id: string;
  name: string;
  email: string;
  avatar?: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  social_payments?: {
    cash_app?: string;
    venmo?: string;
    paypal?: string;
    zelle?: string;
    apple_pay?: string;
    google_pay?: string;
  };
}
const userSchema = new Schema<IUser>({
  google_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  socials: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  social_payments: {
    cash_app: String,
    venmo: String,
    paypal: String,
    zelle: String,
    apple_pay: String,
    google_pay: String,
  },
});
const User = model<IUser>("User", userSchema);
export default User;
