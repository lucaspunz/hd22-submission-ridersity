import { Request, Response, Router, NextFunction } from "express";
import * as secrets from "secrets";
import User, { IUser } from "db/models/user";

const api = Router();

api.get("/", (req: Request, res: Response) => {
  return res.status(299).send("👋 API");
});

async function scuffed_user(req: Request): Promise<{ user: IUser | null; error: string | null }> {
  // extract x-auth header
  const auth = req.header("X-Auth");
  if (!auth) {
    return { user: null, error: "No auth token" };
  }
  // verify auth token
  const { data, error } = secrets.verify_and_decode(auth, secrets.JWT_access);
  if (error) {
    return { user: null, error: "Invalid auth token" };
  }
  // find user
  const db_user = await User.findById(data._id);
  if (!db_user) {
    return { user: null, error: "Could not find user" };
  }
  return { user: db_user, error: null };
}

api.get("/findRides", async (req: Request, res: Response) => {
  const { user, error } = await scuffed_user(req);
  if (error) return res.status(401).json({ err: error });
  return res.json({ name: user?.name });
});

export default api;
