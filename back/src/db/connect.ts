import { Connection, connect as mongo_connect, connection, disconnect as mongo_disconect } from "mongoose";
import User from "db/models/user";
let db: Connection;
export const connect = async () => {
  const mongo_url = process.env.mongo_url as string;
  if (db) return;
  await mongo_connect(mongo_url);
  db = connection;
  console.log("Connected to database");

  db.once("open", async () => {
    console.log("Connected to database");
  });
  db.on("error", () => {
    console.log("Error connecting to database");
  });

  return db;
};
export const disconnect = async () => {
  if (!db) return;
  await mongo_disconect();
};
export const insert_sample_data = async () => {
  const user = new User({
    name: "Bill",
    email: "bill@initech.com",
    avatar: "https://i.imgur.com/dM7Thhn.png",
  });

  await user.save();
};
