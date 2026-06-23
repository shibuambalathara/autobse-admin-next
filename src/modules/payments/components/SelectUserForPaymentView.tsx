"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { USERS_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";
import type { UserListItem } from "@/modules/users/types";
import type { TableColumn } from "@/types";
import { useMemo, useState } from "react";

const USER_PICKER_PAGE_SIZE = 10;

export function SelectUserForPaymentView() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<{
    users: { users: UserListItem[]; usersCount: number };
  }>(USERS_QUERY, {
    variables: {
      search: searchQuery || undefined,
      orderBy: [{ createdAt: "DESC" }],
      take: USER_PICKER_PAGE_SIZE,
      skip: (page - 1) * USER_PICKER_PAGE_SIZE,
    },
    fetchPolicy: "network-only",
  });

  const users = data?.users?.users ?? [];
  const total = data?.users?.usersCount ?? 0;

  const columns = useMemo(
    (): TableColumn<UserListItem>[] => [
      {
        id: "name",
        header: "Name",
        cell: (row) =>
          `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "—",
      },
      { id: "mobile", header: "Mobile", accessor: "mobile" },
      { id: "state", header: "State", accessor: "state" },
      {
        id: "select",
        header: "Action",
        cell: (row) => (
          <button
            type="button"
            onClick={() => router.push(ROUTES.createPayment(row.id))}
            className={buttonVariants({ size: "sm" })}
          >
            Select
          </button>
        ),
      },
    ],
    [router]
  );

  return (
    <PageContainer
      title="Create Payment"
      description="Search and select a user to record a new payment."
      actions={
        <Link
          href={ROUTES.payments}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Back to Payments
        </Link>
      }
    >
      {loading && users.length === 0 ? (
        <LoadingState label="Loading users…" />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          isLoading={loading}
          variant="users"
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search by name or mobile…"
          pagination={{ page, pageSize: USER_PICKER_PAGE_SIZE, total }}
          onPageChange={setPage}
          emptyTitle="No users found"
          emptyDescription="Try a different search term."
        />
      )}
    </PageContainer>
  );
}
