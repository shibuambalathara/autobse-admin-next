import { Car, Gavel, ShieldCheck } from "lucide-react";
import { AUTH_COPY } from "@/modules/authentication/forms/validation";

interface AuthBrandPanelProps {
  className?: string;
}

const features = [
  {
    icon: Gavel,
    title: "Auction management",
    description: "Manage live auctions, events, and bidding workflows.",
  },
  {
    icon: Car,
    title: "Vehicle inventory",
    description: "Track listings, sellers, and vehicle lifecycle.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Secure access with role-based permissions across teams.",
  },
];

export function AuthBrandPanel({ className }: AuthBrandPanelProps) {
  return (
    <aside
      className={`relative hidden overflow-hidden bg-brand-900 lg:flex lg:flex-col ${className ?? ""}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_45%)]" />

      <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-brand-300">
            Management Portal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white xl:text-5xl">
            AUTO<span className="text-orange-400">BSe</span>
          </h1>
          <p className="mt-3 max-w-md text-base text-brand-200">
            {AUTH_COPY.tagline}
          </p>
        </div>

        <ul className="space-y-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-white">{feature.title}</p>
                  <p className="mt-0.5 text-sm text-brand-300">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-brand-400">
          &copy; {new Date().getFullYear()} AUTOBSe. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
