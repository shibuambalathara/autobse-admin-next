"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PERMISSIONS } from "@/auth/permissions";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import {
  Button,
  FormCard,
  PageContainer,
  Select,
  buttonVariants,
} from "@/components/ui";
import { FormField } from "@/components/forms";
import { Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  SINGLE_JOB_APPLICATION_QUERY,
  UPDATE_JOB_APPLICATION_MUTATION,
} from "@/graphql/documents/job-applications";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { formatDateOnly } from "@/lib/date-format";
import { JOB_APPLICATION_STATUS_OPTIONS } from "@/modules/job-applications/constants";
import { useAuthenticatedAdminQuery } from "@/modules/job-applications/hooks/useAuthenticatedAdminQuery";
import type {
  JobApplicationStatus,
  SingleJobApplicationResult,
} from "@/modules/job-applications/types";

interface JobApplicationDetailViewProps {
  applicationId: string;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-brand-500">{label}</dt>
      <dd className="mt-1 text-sm text-brand-900">{value || "—"}</dd>
    </div>
  );
}

function ExternalDetailLink({
  label,
  url,
  linkLabel,
}: {
  label: string;
  url?: string | null;
  linkLabel: string;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-brand-500">{label}</dt>
      <dd className="mt-1 text-sm">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-brand-600 underline hover:text-brand-900"
          >
            {linkLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-brand-400">Not provided</span>
        )}
      </dd>
    </div>
  );
}

export function JobApplicationDetailView({
  applicationId,
}: JobApplicationDetailViewProps) {
  const router = useRouter();
  const { role, can } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const canManage = can(PERMISSIONS.JOB_APPLICATIONS_MANAGE);
  const { canFetch } = useAuthenticatedAdminQuery();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<JobApplicationStatus | "">("");

  const { data, loading, error, refetch } = useQuery<SingleJobApplicationResult>(
    SINGLE_JOB_APPLICATION_QUERY,
    {
      variables: { where: { id: applicationId } },
      skip: !canFetch || !applicationId,
      fetchPolicy: "network-only",
    }
  );

  const [updateJobApplication, { loading: saving }] = useMutation(
    UPDATE_JOB_APPLICATION_MUTATION
  );

  const application = data?.job;

  useEffect(() => {
    if (!application) return;
    setNotes(application.notes ?? "");
    setStatus((application.status as JobApplicationStatus) ?? "");
  }, [application]);

  const handleSave = async () => {
    if (!status) {
      await Swal.fire({
        icon: "error",
        title: "Status required",
        text: "Please select an application status.",
      });
      return;
    }

    try {
      await updateJobApplication({
        variables: {
          where: { id: applicationId },
          data: {
            notes: notes.trim(),
            status,
          },
        },
      });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Job status and notes updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (submitError: unknown) {
      const { message } = extractGraphqlError(submitError);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Job application access restricted"
        description="Only administrators can view job applications."
      />
    );
  }

  if (!canFetch || loading) {
    return (
      <PageContainer
        title="Job Application"
        description="Review applicant details and update status."
      >
        <LoadingState label="Loading application…" />
      </PageContainer>
    );
  }

  if (error || !application) {
    return (
      <PageContainer
        title="Job Application"
        description="Review applicant details and update status."
      >
        <p className="text-sm text-red-600">
          {extractGraphqlError(error).message || "Application not found."}
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Job Application Details"
      description={
        application.career?.title
          ? `Applied for ${application.career.title}`
          : "Review applicant profile and admin notes."
      }
      actions={
        <Link
          href={ROUTES.jobs}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>
      }
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <FormCard title="Personal Information">
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem label="Full Name" value={application.fullName} />
            <DetailItem label="Mobile" value={application.mobile} />
            <DetailItem label="Email" value={application.email} />
            <DetailItem label="Address" value={application.address} />
            <DetailItem label="Gender" value={application.gender} />
            <DetailItem
              label="Date of Birth"
              value={formatDateOnly(application.dateOfBirth)}
            />
          </dl>
        </FormCard>

        <FormCard title="Experience">
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem
              label="Years of Experience"
              value={application.yearOfExperience}
            />
            <DetailItem label="Current Status" value={application.status} />
            {application.career?.id ? (
              <div>
                <dt className="text-sm font-medium text-brand-500">Career</dt>
                <dd className="mt-1">
                  <Link
                    href={ROUTES.careerEdit(application.career.id)}
                    className="text-sm font-medium text-brand-600 underline hover:text-brand-900"
                  >
                    {application.career.title ?? "View career"}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </FormCard>

        <FormCard title="Cover Letter">
          <p className="whitespace-pre-wrap text-sm text-brand-700">
            {application.coverLetter || "No cover letter provided."}
          </p>
        </FormCard>

        <FormCard title="Links & Documents">
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ExternalDetailLink label="CV" url={application.CV} linkLabel="View CV" />
            <ExternalDetailLink
              label="LinkedIn"
              url={application.linkedinProfile}
              linkLabel="View LinkedIn"
            />
            <ExternalDetailLink
              label="Portfolio"
              url={application.portfolioUrl}
              linkLabel="View portfolio"
            />
          </dl>
        </FormCard>

        {canManage ? (
          <FormCard
            title="Admin Notes & Status"
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.jobs)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave} isLoading={saving}>
                  Save Changes
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <FormField label="Admin Notes" htmlFor="job-application-notes">
                <Textarea
                  id="job-application-notes"
                  rows={4}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add internal notes here…"
                />
              </FormField>

              <FormField label="Update Status" htmlFor="job-application-status" required>
                <Select
                  id="job-application-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as JobApplicationStatus | "")
                  }
                  options={[
                    { label: "Select status", value: "" },
                    ...JOB_APPLICATION_STATUS_OPTIONS,
                  ]}
                />
              </FormField>
            </div>
          </FormCard>
        ) : null}
      </div>
    </PageContainer>
  );
}
