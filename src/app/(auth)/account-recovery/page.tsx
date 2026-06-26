import type { Metadata } from "next";
import { AccountRecoveryView } from "@/modules/authentication";

export const metadata: Metadata = {
  title: "Account recovery",
  description: "Recover your AutoBSE admin account",
};

export default function AccountRecoveryPage() {
  return <AccountRecoveryView />;
}
