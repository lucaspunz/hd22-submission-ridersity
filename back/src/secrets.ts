import JWT from "jsonwebtoken";

export const JWT_refresh = process.env.JWT_refresh as string;
export const JWT_state = process.env.JWT_state as string;
export const JWT_access = process.env.JWT_access as string;
export const prod = process.env.NODE_ENV === "production";

export function verify_and_decode(token: string, secret: string): { data: any | null; error: string | null } {
  try {
    const data = JWT.verify(token, secret, { algorithms: ["HS384"] });
    return { data, error: null };
  } catch (err) {
    return { data: null, error: "error" };
  }
}
