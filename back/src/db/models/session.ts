import { Schema, model, ObjectId } from "mongoose";

interface ISession {
  id: string;
  link: ObjectId;
  expires: number;
  created: number;
}
const sessionSchema = new Schema<ISession>({
  id: { type: String, required: true },
  link: { type: Schema.Types.ObjectId, required: true },
  expires: { type: Number, required: true },
  created: { type: Number, required: true },
});
const Session = model<ISession>("Session", sessionSchema);
export default Session;
