"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@apollo/client";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { SINGLE_CAREER_QUERY } from "@/graphql/documents/careers";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { JobApplicationFilterFields } from "@/modules/job-applications/components/JobApplicationFilterFields";
import { CoverLetterModal } from "@/modules/job-applications/components/modals/CoverLetterModal";
import { useJobApplicationsList } from "@/modules/job-applications/hooks/useJobApplicationsList";
import { createJobApplicationsTableColumns } from "@/modules/job-applications/tables/job-applications-table-columns";
import type { SingleCareerResult } from "@/modules/career/types";

interface JobApplicationsListViewProps {
  careerId?: string;
}

export function JobApplicationsListView({
  careerId,
}: JobApplicationsListViewProps) {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useJobApplicationsList({ careerId });
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");

  const { data: careerData } = useQuery<SingleCareerResult>(SINGLE_CAREER_QUERY, {
    variables: { where: { id: careerId } },
    skip: !careerId || !list.canFetch,
    fetchPolicy: "cache-first",
  });

  const openCoverLetter = useCallback((text: string) => {
    setCoverLetterText(text);
    setCoverLetterOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      createJobApplicationsTableColumns({
        onViewCoverLetter: openCoverLetter,
        showDesignation: !careerId,
      }),
    [careerId, openCoverLetter]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.applications.length === 0);

  const pageTitle = careerId
    ? `Applications${careerData?.career?.title ? `: ${careerData.career.title}` : ""}`
    : "Job Applications";

  const pageDescription = careerId
    ? "Review applications submitted for this career posting."
    : "Review and manage job applications across all career postings.";

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Job application access restricted"
        description="Only administrators can view job applications."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={pageTitle}
        description={pageDescription}
        actions={
          careerId ? (
            <Link
              href={ROUTES.career}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Careers
            </Link>
          ) : undefined
        }
      >
        {careerId ? (
          <div className="mb-4 lg:hidden">
            <Link
              href={ROUTES.career}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Careers
            </Link>
          </div>
        ) : null}

        <JobApplicationFilterFields
          status={list.status}
          onStatusChange={list.setStatus}
          onClear={list.clearFilters}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading job applications…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load job applications"
            description={extractGraphqlError(list.error).message}
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.applications}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by name, email…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No job applications found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <CoverLetterModal
        open={coverLetterOpen}
        text={coverLetterText}
        onClose={() => setCoverLetterOpen(false)}
      />
    </div>
  );
}
