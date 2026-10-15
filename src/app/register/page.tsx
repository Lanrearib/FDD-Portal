import type { Metadata } from "next";
import { RegisterWizard } from "./register-wizard";

export const metadata: Metadata = { title: "Create your profile" };

export default function Register() {
  return <RegisterWizard />;
}
