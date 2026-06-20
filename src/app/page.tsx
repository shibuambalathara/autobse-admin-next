import { ROUTES } from "@/constants";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(ROUTES.dashboard);
}
