import type { Metadata } from "next";
import { UserResetPasswordView } from "@/modules/authentication";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your AutoBSE admin account",
};

export default function UserResetPasswordPage() {
  return <UserResetPasswordView />;
}
