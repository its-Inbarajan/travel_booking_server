export interface IUserType {
  _id: string;
  profile: string;
  email: string;
  password?: string;
  user_name: string;
  user_type: "admin" | "user";
  isVerifyed: boolean;
  googleId: string;
  provider: "local" | "google"; // ✅ Track login method
}
