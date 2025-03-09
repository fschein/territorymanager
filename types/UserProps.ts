export interface UserProps {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: "admin" | "user" | "elder" | string;
  password: string;
}
