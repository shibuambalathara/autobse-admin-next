"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { USER_LEGACY_ROUTES, USER_ROUTES } from "@/modules/users/constants/related-routes";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import type { UserDetail } from "@/modules/users/types";

interface UserDetailSidebarProps {
  user: UserDetail;
  userId: string;
  isEditable: boolean;
  onToggleEdit: () => void;
  onResetPassword: () => void;
}

export function UserDetailSidebar({
  user,
  userId,
  isEditable,
  onToggleEdit,
  onResetPassword,
}: UserDetailSidebarProps) {
  const quickLinks = [
    { label: "Active Bids", href: USER_ROUTES.bids(userId) },
    { label: "Payment Details", href: USER_ROUTES.payments(userId) },
    { label: "Create Payment", href: USER_ROUTES.createPayment(userId) },
    { label: "Notifications", href: USER_ROUTES.notifications(userId) },
    { label: "Blocked Sellers", href: USER_ROUTES.blockedSellers(userId) },
    { label: "Audit Log", href: ROUTES.userAuditLogs(userId) },
    { label: "Accepted Events", href: USER_LEGACY_ROUTES.termsCondition(userId) },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Profile</CardTitle>
        <Button
          type="button"
          size="sm"
          variant={isEditable ? "secondary" : "outline"}
          onClick={onToggleEdit}
        >
          {isEditable ? "Cancel Edit" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-brand-400">
            <span className="text-2xl font-semibold">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </span>
          </div>
        </div>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-brand-500">Name</dt>
            <dd className="font-medium text-brand-900">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-brand-500">Username</dt>
            <dd>{user.username ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-brand-500">Balance EMD</dt>
            <dd>{user.BalanceEMDAmount ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-brand-500">Buying Limit</dt>
            <dd>{user.vehicleBuyingLimit ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-brand-500">Registration Expiry</dt>
            <dd>{formatDate(user.registrationExpiryDate)}</dd>
          </div>
        </dl>
        <div className="space-y-2 border-t border-surface-border pt-4">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md border border-surface-border px-3 py-2 text-center text-sm text-brand-700 transition-colors hover:bg-brand-50"
            >
              {link.label}
            </a>
          ))}
          {user.role !== "dealer" && (
            <a
              href={USER_LEGACY_ROUTES.staffCreatedUsers(userId)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md border border-surface-border px-3 py-2 text-center text-sm text-brand-700 transition-colors hover:bg-brand-50"
            >
              View {user.firstName} created users
            </a>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onResetPassword}
          >
            Reset Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
