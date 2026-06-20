"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  ADD_CRM_CALL_LOG_MUTATION,
  INDIVIDUAL_CRM_QUERY,
} from "@/graphql/documents/crm";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { CALL_STATUS_OPTIONS } from "@/modules/crm/constants";
import { useCrmFilterOptions } from "@/modules/crm/hooks/useCrmFilterOptions";
import type { IndividualCrmResult } from "@/modules/crm/types";
import {
  getMinDateTimeLocalForToday,
  isFollowUpDateNotInPast,
} from "@/modules/crm/utils";

interface CreateCallLogFormValues {
  staffId?: string;
  callStatus: string;
  durationInSeconds?: string;
  nextFollowUpAt?: string;
  remarks: string;
}

interface CreateCallLogFormProps {
  clientId: string;
}

export function CreateCallLogForm({ clientId }: CreateCallLogFormProps) {
  const router = useRouter();
  const filterOptions = useCrmFilterOptions("");

  const { data: clientData, loading: clientLoading } = useQuery<IndividualCrmResult>(
    INDIVIDUAL_CRM_QUERY,
    {
      variables: { where: { id: clientId } },
      skip: !clientId,
    }
  );

  const [createCallLog, { loading }] = useMutation(ADD_CRM_CALL_LOG_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCallLogFormValues>({
    defaultValues: { staffId: "", callStatus: "" },
  });

  const client = clientData?.potentialClient;
  const clientLabel = client
    ? [client.firstName, client.lastName].filter(Boolean).join(" ") ||
      client.mobile
    : "Client";

  const onSubmit = async (formData: CreateCallLogFormValues) => {
    if (
      formData.nextFollowUpAt &&
      !isFollowUpDateNotInPast(formData.nextFollowUpAt)
    ) {
      await Swal.fire({
        icon: "error",
        title: "Invalid date",
        text: "Next follow up cannot be in the past.",
      });
      return;
    }

    const createPotentialClientCallLogInput = {
      callStatus: formData.callStatus,
      durationInSeconds: formData.durationInSeconds
        ? Number(formData.durationInSeconds)
        : undefined,
      remarks: formData.remarks.trim(),
      nextFollowUpAt: formData.nextFollowUpAt
        ? new Date(formData.nextFollowUpAt).toISOString()
        : undefined,
    };

    try {
      await createCallLog({
        variables: {
          createPotentialClientCallLogInput,
          potentialClientId: clientId,
          staffId: formData.staffId || undefined,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Call log created successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.crmCallLogs(clientId));
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (clientLoading) {
    return <LoadingState label="Loading client…" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title={`Add Call Log — ${clientLabel}`}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.crmCallLogs(clientId))}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save
            </Button>
          </>
        }
      >
        <FormGrid>
          <FormField label="Assigned Staff" htmlFor="call-log-staff">
            <Select
              id="call-log-staff"
              placeholder="Select staff"
              options={filterOptions.staffOptions}
              {...register("staffId")}
            />
          </FormField>

          <FormField
            label="Call Status"
            htmlFor="call-log-status"
            required
            error={errors.callStatus?.message}
          >
            <Select
              id="call-log-status"
              placeholder="Select status"
              options={[...CALL_STATUS_OPTIONS]}
              {...register("callStatus", { required: "Call status is required" })}
            />
          </FormField>

          <FormField label="Duration (seconds)" htmlFor="call-log-duration">
            <Input
              id="call-log-duration"
              type="number"
              min={0}
              {...register("durationInSeconds")}
            />
          </FormField>

          <FormField label="Next Follow Up" htmlFor="call-log-next-follow-up">
            <Input
              id="call-log-next-follow-up"
              type="datetime-local"
              min={getMinDateTimeLocalForToday()}
              {...register("nextFollowUpAt")}
            />
          </FormField>

          <div className="col-span-full">
            <FormField
              label="Remarks"
              htmlFor="call-log-remarks"
              required
              error={errors.remarks?.message}
            >
              <Textarea
                id="call-log-remarks"
                rows={4}
                {...register("remarks", { required: "Remarks is required" })}
              />
            </FormField>
          </div>
        </FormGrid>
      </FormCard>
    </form>
  );
}
