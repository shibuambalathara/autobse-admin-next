"use client";

import Link from "next/link";
import { Plus, ShieldBan } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { SELLER_ROUTES } from "@/modules/sellers/constants";

const mobileActionButtonClass =
  "box-border flex h-11 w-full max-w-full items-center justify-start gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-left text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50";

interface SellersPageToolbarProps {
  canManage: boolean;
  isAdmin: boolean;
}

export function SellersPageToolbar({
  canManage,
  isAdmin,
}: SellersPageToolbarProps) {
  if (!canManage && !isAdmin) {
    return null;
  }

  return (
    <div className="mb-4 w-full min-w-0 max-w-full">
      <div className="w-full min-w-0 space-y-3 lg:hidden">
        {canManage && (
          <Link
            href={ROUTES.sellersAdd}
            className={cn(
              mobileActionButtonClass,
              "justify-center border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">Add seller</span>
          </Link>
        )}

        {isAdmin && (
          <div className="flex w-full min-w-0 flex-col gap-2">
            <Link
              href={SELLER_ROUTES.blockedDealersList}
              className={mobileActionButtonClass}
            >
              <ShieldBan className="h-4 w-4 shrink-0 text-neutral-500" />
              <span className="truncate">Blocked dealers</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
