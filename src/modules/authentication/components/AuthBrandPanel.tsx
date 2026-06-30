import { Car, Gavel, ShieldCheck } from "lucide-react";
import { AUTH_COPY } from "@/modules/authentication/forms/validation";

const features = [
  {
    icon: Gavel,
    title: "Auction Management",
    description:
      "Create and manage live auctions, events and bidding workflows.",
  },
  {
    icon: Car,
    title: "Vehicle Inventory",
    description: "Track listings, sellers and vehicle lifecycle with ease.",
  },
  {
    icon: ShieldCheck,
    title: "Role Based Access",
    description: "Secure access with role-based permissions across teams.",
  },
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between px-10 py-12 xl:px-14 xl:py-14 lg:flex">
      <div>
        <p className="text-[26px] font-bold leading-none tracking-tight text-white">
          AUTO<span className="text-[#FF6B00]">BSE</span>
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
          Management Portal
        </p>

        <h1 className="mt-12 max-w-md text-[2.5rem] font-bold leading-[1.15] tracking-tight text-white xl:text-5xl">
          {AUTH_COPY.heroTitle}
          <br />
          <span className="text-[#FF6B00]">{AUTH_COPY.heroHighlight}</span>
        </h1>
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/55">
          {AUTH_COPY.heroDescription}
        </p>
      </div>

      <ul className="my-10 space-y-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <li key={feature.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00]/15 text-[#FF6B00]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/45">
                  {feature.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-white/30">
        &copy; {new Date().getFullYear()} AUTOBSE. All rights reserved.
      </p>
    </aside>
  );
}
