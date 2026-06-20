import type { Metadata } from "next";
import { LoginView } from "@/modules/authentication";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the AutoBSE admin panel",
};

export default function LoginPage() {
  return <LoginView />;
}
