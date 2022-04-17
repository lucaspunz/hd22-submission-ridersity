import { Request, Response, Router } from "express";
import * as secrets from "secrets";
import JWT from "jsonwebtoken";
import fetch, { Headers } from "node-fetch";
import Session from "db/models/session";
import { nanoid } from "nanoid";
import User from "db/models/user";
const auth = Router();

auth.get("/logout", async (req: Request, res: Response) => {
  const refresh_cookie = req.cookies["ridersity_refresh"];
  if (!refresh_cookie) {
    return res.sendStatus(401);
  }
  const { data, error } = secrets.verify_and_decode(refresh_cookie, secrets.JWT_refresh);
  if (error) {
    res.cookie("ridersity_refresh", "", {
      maxAge: 1,
      httpOnly: true,
    });
    return res.sendStatus(401);
  }
  await Session.deleteOne({ _id: data._id });
  return res.sendStatus(204);
});

auth.get("/refresh", async (req: Request, res: Response) => {
  const refresh_cookie = req.cookies["ridersity_refresh"];
  if (!refresh_cookie) {
    return res.sendStatus(401);
  }
  const { data, error } = secrets.verify_and_decode(refresh_cookie, secrets.JWT_refresh);
  if (error) {
    res.cookie("ridersity_refresh", "", {
      maxAge: 1,
      httpOnly: true,
    });
    return res.sendStatus(401);
  }
  const find_session = await Session.findById(data._id);
  if (!find_session) {
    return res.sendStatus(401);
  }
  const find_user = await User.findById(find_session.link);
  if (!find_user) {
    return res.sendStatus(401);
  }
  const expires = Math.floor(Date.now() / 1000) + 60 * 15;
  const new_token = JWT.sign({ _id: find_user._id }, secrets.JWT_access, {
    expiresIn: "15 minutes",
    algorithm: "HS384",
  });
  return res.status(299).json({
    token: new_token,
    expires: expires,
    user: {
      _id: find_user._id,
      email: find_user.email,
      name: find_user.name,
      avatar: find_user.avatar,
    },
  });
});

auth.get("/google", (req: Request, res: Response) => {
  const rRedirect = req.query.redirect;
  const refreshCookie = req.cookies["ridersity_refresh"];
  //   if (refreshCookie) {
  //     JWT.decode(refreshCookie, {});
  //     const { data, error } = secrets.verify_and_decode(refreshCookie, secrets.JWT_refresh);
  //     if (!error) {
  //       Session.findOne();
  //     }
  //   }
  const rState = nanoid(30);
  const stateJWT = JWT.sign({ state: rState, redirect: rRedirect }, secrets.JWT_state, {
    algorithm: "HS384",
    expiresIn: "15 minutes",
  });
  res.cookie("ridersity_state", stateJWT, {
    path: "/",
    maxAge: 900 * 1000,
    secure: secrets.prod,
    httpOnly: true,
    sameSite: "lax",
  });
  const redirect = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  redirect.searchParams.append("client_id", process.env.google_id as string);
  redirect.searchParams.append("redirect_uri", process.env.google_redirect as string);
  redirect.searchParams.append("response_type", "code");
  redirect.searchParams.append(
    "scope",
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
  );
  redirect.searchParams.append("access_type", "online");
  redirect.searchParams.append("state", rState);
  redirect.searchParams.append("hd", "ucdavis.edu");
  return res.redirect(redirect.toString());
});

auth.get("/google/callback", async (req: Request, res: Response) => {
  const state = req.query.state;
  const code = req.query.code;
  if (!state || !code) {
    return res.status(400).send("Missing state or code");
  }
  const state_cookie = req.cookies["ridersity_state"];
  res.cookie("ridersity_state", "", {
    path: "/",
    maxAge: 1,
    secure: secrets.prod,
    httpOnly: true,
    sameSite: "lax",
  });
  if (!state_cookie) {
    return res.status(400).send("Missing state cookie");
  }
  const { data, error } = secrets.verify_and_decode(state_cookie, secrets.JWT_state);
  if (error) {
    console.log(error);
    return res.status(400).send("Issue with state cookie");
  }
  if (!data || data.state !== state) {
    return res.status(400).send("Invalid state");
  }
  const exchange = await exchange_token(code as string);
  if (exchange.error) {
    return res.status(400).send("Issue with oauth exchange");
  }
  // jwt decode oauth
  const g_data_jwt = JWT.decode(exchange.oauth_data.id_token, { complete: true });
  const g_data = g_data_jwt?.payload as {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    hd: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
  };
  if (!g_data.email_verified) {
    return res.status(400).send("Email not verified");
  }
  if (g_data.hd !== "ucdavis.edu") {
    return res.status(400).send("Not a UCD email");
  }
  const db_user = await User.findOneAndUpdate(
    { email: g_data.email },
    {
      google_id: g_data.sub,
      email: g_data.email,
      name: g_data.name,
      avatar: g_data.picture,
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );
  const created = Math.floor(Date.now() / 1000);
  const expires = created + 60 * 60 * 24 * 90;
  const sess = new Session({
    id: nanoid(25),
    link: db_user.id,
    created,
    expires,
  });
  const db_session = await Session.create(sess);
  const refresh_token = JWT.sign({ _id: db_session._id.toHexString() }, secrets.JWT_refresh, {
    algorithm: "HS384",
    expiresIn: "90 days",
  });
  // set cookie
  res.cookie("ridersity_refresh", refresh_token, {
    path: "/",
    expires: new Date(expires * 1000),
    secure: secrets.prod,
    httpOnly: true,
    sameSite: "strict",
  });
  const redirect = new URL(process.env.front_url as string);
  redirect.searchParams.append("login", "true");
  if (data.redirect?.length > 0) {
    redirect.searchParams.append("redirect", data.redirect as string);
  }
  return res.redirect(redirect.toString());
});

interface exchange_response {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}
async function exchange_token(code: string): Promise<{ oauth_data: any | null; error: string | null }> {
  const fetch_google = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    body: `code=${code}&client_id=${process.env.google_id}&client_secret=${process.env.google_secret}&redirect_uri=${process.env.google_redirect}&grant_type=authorization_code`,
  });
  if (fetch_google.status !== 200) {
    return { oauth_data: null, error: "Issue with fetching google" };
  }
  const oauth_data = (await fetch_google.json()) as exchange_response;
  return { oauth_data: oauth_data, error: null };
}

export default auth;
