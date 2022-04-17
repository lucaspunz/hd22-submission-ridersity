import { atom, RecoilState } from "recoil";

export enum authEnum {
  waitingOnCall,
  out,
  in,
}
export const authState: RecoilState<authEnum> = atom({
  key: "isAuth",
  default: authEnum.waitingOnCall,
});
export const jwtState: RecoilState<{ token: string; expires: number } | null> = atom({
  key: "jwt",
  default: null,
});
export const userState = atom({
  key: "user",
  default: {
    _id: undefined,
    email: undefined,
    name: undefined,
    avatar: undefined,
    socials: {
      facebook: undefined,
      twitter: undefined,
      instagram: undefined,
    },
    social_payments: {
      cash_app: undefined,
      venmo: undefined,
      paypal: undefined,
      zelle: undefined,
      apple_pay: undefined,
      google_pay: undefined,
    },
  },
});
export const stepState: RecoilState<number> = atom({
  key: "step",
  default: 1,
});
