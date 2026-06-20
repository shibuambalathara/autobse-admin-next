"use client";

import { useState } from "react";
import { Car, CreditCard, Gavel, Users } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormCard,
  Modal,
  PageContainer,
  StatsCard,
  StatusBadge,
} from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import {
  Checkbox,
  DatePicker,
  FormField,
  FormGrid,
  FormSection,
  Input,
  Select,
  Textarea,
} from "@/components/forms";
import type { TableColumn } from "@/types";

interface DemoRow {
  id: string;
  name: string;
  status: "active" | "pending" | "rejected";
}

const demoColumns: TableColumn<DemoRow>[] = [
  { id: "name", header: "Name", accessor: "name", sticky: true },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} showDot />,
  },
];

const demoRows: DemoRow[] = [
  { id: "1", name: "HDFC Bank", status: "active" },
  { id: "2", name: "ICICI Bank", status: "pending" },
  { id: "3", name: "Bajaj Finance", status: "rejected" },
];

export function ComponentsShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <PageContainer
      title="Design System"
      description="Enterprise admin UI components — reusable, responsive, TypeScript-safe."
    >
      <div className="space-y-8">
        {/* Buttons */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Buttons
          </h2>
          <Card>
            <CardContent className="flex flex-wrap items-center gap-2 pt-5">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button isLoading loadingText="Saving…">
                Save
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Cards
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              label="Active Users"
              value="1,248"
              change="+12% this month"
              trend="up"
              icon={Users}
            />
            <StatsCard
              label="Live Auctions"
              value="18"
              change="3 ending today"
              icon={Gavel}
            />
            <StatsCard
              label="Vehicles"
              value="4,320"
              icon={Car}
            />
            <StatsCard
              label="Payments"
              value="₹2.4M"
              change="-4% vs last week"
              trend="down"
              icon={CreditCard}
            />
          </div>
          <FormCard
            title="Default Form Card"
            description="Structured container for create/edit forms."
            footer={
              <>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </>
            }
          >
            <p className="text-sm text-brand-600">
              Form fields go here. Uses consistent padding and footer actions.
            </p>
          </FormCard>
        </section>

        {/* Status badges */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Status Badges
          </h2>
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-5">
              <StatusBadge status="active" showDot />
              <StatusBadge status="pending" showDot />
              <StatusBadge status="live" showDot />
              <StatusBadge status="completed" showDot />
              <StatusBadge status="failed" showDot />
              <StatusBadge status="approved" showDot />
              <StatusBadge status="rejected" showDot />
            </CardContent>
          </Card>
        </section>

        {/* Table */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Table System
          </h2>
          <DataTable
            columns={demoColumns}
            data={demoRows.filter((r) =>
              r.name.toLowerCase().includes(search.toLowerCase())
            )}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search sellers…"
            pagination={{ page, pageSize: 10, total: demoRows.length }}
            onPageChange={setPage}
          />
        </section>

        {/* Forms */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Form System
          </h2>
          <FormCard title="User Details">
            <FormSection description="Multi-column on desktop, single-column on mobile.">
              <FormGrid columns={2}>
                <FormField label="First Name" htmlFor="ds-firstName" required>
                  <Input id="ds-firstName" placeholder="Enter first name" />
                </FormField>
                <FormField label="Last Name" htmlFor="ds-lastName" required>
                  <Input id="ds-lastName" placeholder="Enter last name" />
                </FormField>
                <FormField label="Role" htmlFor="ds-role">
                  <Select
                    id="ds-role"
                    placeholder="Select role"
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Staff", value: "staff" },
                    ]}
                  />
                </FormField>
                <FormField label="Start Date" htmlFor="ds-date">
                  <DatePicker id="ds-date" />
                </FormField>
                <FormField label="Notes" htmlFor="ds-notes" className="md:col-span-2">
                  <Textarea id="ds-notes" placeholder="Additional notes…" />
                </FormField>
                <Checkbox
                  id="ds-notify"
                  label="Send email notification"
                  description="Notify the user when account is created."
                  className="md:col-span-2"
                />
              </FormGrid>
            </FormSection>
          </FormCard>
        </section>

        {/* Feedback states */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-500">
            Feedback States
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Loading & Empty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowLoading(true);
                    setTimeout(() => setShowLoading(false), 1500);
                  }}
                >
                  Toggle Loading
                </Button>
              </div>
              {showLoading ? (
                <LoadingState label="Fetching data…" />
              ) : (
                <EmptyState
                  title="No records"
                  description="This is the empty state component."
                  action={<Button size="sm">Add Record</Button>}
                />
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Action"
        description="Reusable modal component."
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-sm text-brand-600">
          Modal content goes here. Wire to real actions during migration.
        </p>
      </Modal>
    </PageContainer>
  );
}
