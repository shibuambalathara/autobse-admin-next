"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  FormCard,
  Input,
  Modal,
  PageContainer,
  buttonVariants,
} from "@/components/ui";
import { FormField } from "@/components/forms";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { useUserDetail } from "@/modules/users/hooks/useUserDetail";
import { UserDetailSidebar } from "@/modules/users/components/UserDetailSidebar";
import { EditUserProfileForm } from "@/modules/users/forms/EditUserProfileForm";
import { UserDocumentsForm } from "@/modules/users/forms/UserDocumentsForm";

interface UserDetailViewProps {
  userId: string;
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const detail = useUserDetail(userId);

  if (detail.loading) {
    return <LoadingState label="Loading user details…" />;
  }

  if (!detail.user) {
    return (
      <PageContainer title="User Not Found">
        <EmptyState
          title="User not found"
          description="The requested user could not be loaded."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`${detail.user.firstName} ${detail.user.lastName ?? ""}`.trim()}
      description={`User #${detail.user.idNo ?? "—"} · ${detail.user.role ?? "—"}`}
      actions={
        <Link
          href={ROUTES.users}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UserDetailSidebar
            user={detail.user}
            userId={userId}
            onResetPassword={() => detail.setShowPasswordModal(true)}
          />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <FormCard
            title="User Details"
            description="Edit profile information."
            actions={
              <Button
                type="button"
                size="sm"
                variant={detail.isEditable ? "secondary" : "outline"}
                onClick={() => detail.setIsEditable((v) => !v)}
              >
                {detail.isEditable ? "Cancel Edit" : "Edit"}
              </Button>
            }
          >
            <EditUserProfileForm
              defaultValues={detail.defaultFormValues()}
              isEditable={detail.isEditable}
              selectedStateCode={detail.selectedStateCode}
              stateOptions={detail.stateOptions}
              sellerOptions={detail.sellerOptions}
              onStateChange={detail.handleStateChange}
              onSubmit={detail.submitProfile}
              loading={detail.updating}
            />
          </FormCard>
          <UserDocumentsForm
            userId={userId}
            fileData={detail.fileData}
            onFileChange={detail.handleFileChange}
            onSubmit={detail.submitDocuments}
          />
        </div>
      </div>

      <Modal
        open={detail.showPasswordModal}
        onClose={() => detail.setShowPasswordModal(false)}
        title="Reset User Password"
      >
        <div className="space-y-4">
          <FormField label="New Password" htmlFor="new-password">
            <Input
              id="new-password"
              type="password"
              value={detail.newPassword}
              onChange={(e) => detail.setNewPassword(e.target.value)}
            />
          </FormField>
          <FormField label="Confirm Password" htmlFor="confirm-password">
            <Input
              id="confirm-password"
              type="password"
              value={detail.confirmPassword}
              onChange={(e) => detail.setConfirmPassword(e.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => detail.setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              isLoading={detail.resettingPassword}
              onClick={() => void detail.confirmPasswordReset()}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
