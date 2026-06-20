"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  INDIVIDUAL_CRM_CALL_LOG_QUERY,
  UPDATE_CRM_CALL_LOG_MUTATION,
} from "@/graphql/documents/crm";
import { ROUTES } from "@/constants/routes";
import { convertUtcToDateTimeLocal } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { CALL_STATUS_OPTIONS } from "@/modules/crm/constants";
import type { IndividualCrmCallLogResult } from "@/modules/crm/types";
import {
  getMinDateTimeLocalForToday,
  isFollowUpDateNotInPast,
} from "@/modules/crm/utils";

interface EditCallLogFormValues {
  callStatus: string;
  durationInSeconds?: string | number;
  nextFollowUpAt?: string;
  remarks?: string;
}

interface EditCallLogFormProps {
  callLogId: string;
  isEditable: boolean;
  onToggleEdit: () => void;
}

export function EditCallLogForm({
  callLogId,
  isEditable,
  onToggleEdit,
}: EditCallLogFormProps) {
  const router = useRouter();

  const { data, loading, error } = useQuery<IndividualCrmCallLogResult>(
    INDIVIDUAL_CRM_CALL_LOG_QUERY,
    {
      variables: { where: { id: callLogId } },
      skip: !callLogId,
      fetchPolicy: "network-only",
    }
  );

  const [updateCallLog, { loading: updating }] = useMutation(
    UPDATE_CRM_CALL_LOG_MUTATION
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCallLogFormValues>();

  const callLog = data?.potentialClientCallLog;
  const potentialClientId =
    callLog?.potentialClientId ?? callLog?.potentialClient?.id;
  const staffLabel = callLog?.staff?.firstName ?? "—";

  const resetToCallLogValues = () => {
    if (!callLog) return;
    reset({
      callStatus: callLog.callStatus ?? "",
      durationInSeconds: callLog.durationInSeconds ?? "",
      nextFollowUpAt: callLog.nextFollowUpAt
        ? convertUtcToDateTimeLocal(callLog.nextFollowUpAt)
        : "",
      remarks: callLog.remarks ?? "",
    });
  };

  useEffect(() => {
    resetToCallLogValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callLog]);

  const onSubmit = async (formData: EditCallLogFormValues) => {
    if (!isEditable) return;

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

    const updatePotentialClientCallLogInput = {
      callStatus: formData.callStatus || undefined,
      durationInSeconds:
        formData.durationInSeconds === "" || formData.durationInSeconds == null
          ? null
          : Number(formData.durationInSeconds),
      remarks: (formData.remarks ?? "").trim(),
      nextFollowUpAt: formData.nextFollowUpAt
        ? new Date(formData.nextFollowUpAt).toISOString()
        : undefined,
    };

    try {
      await updateCallLog({
        variables: {
          where: { id: callLogId },
          updatePotentialClientCallLogInput,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Call log updated successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      onToggleEdit();
      router.push(
        potentialClientId
          ? ROUTES.crmCallLogs(potentialClientId)
          : ROUTES.crm
      );
    } catch (err: unknown) {
      const { message } = extractGraphqlError(err);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (loading || !callLog) {
    return <LoadingState label="Loading call log…" />;
  }

  if (error) {
    return (
      <p className="text-destructive">{extractGraphqlError(error).message}</p>
    );
  }

  const clientLabel = callLog.potentialClient?.firstName ?? "Client";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title={`Edit Call Log — ${clientLabel}`}
        footer={
          isEditable ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    potentialClientId
                      ? ROUTES.crmCallLogs(potentialClientId)
                      : ROUTES.crm
                  )
                }
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={updating}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  potentialClientId
                    ? ROUTES.crmCallLogs(potentialClientId)
                    : ROUTES.crm
                )
              }
            >
              Back to Call Logs
            </Button>
          )
        }
      >
        <fieldset disabled={!isEditable} className="min-w-0 border-0 p-0">
          <FormGrid>
            <FormField label="Assigned Staff" htmlFor="edit-call-log-staff">
              <Input id="edit-call-log-staff" value={staffLabel} disabled readOnly />
            </FormField>

            <FormField
              label="Call Status"
              htmlFor="edit-call-log-status"
              required
              error={errors.callStatus?.message}
            >
              <Select
                id="edit-call-log-status"
                placeholder="Select status"
                options={[...CALL_STATUS_OPTIONS]}
                {...register("callStatus", { required: "Call status is required" })}
              />
            </FormField>

            <FormField label="Duration (seconds)" htmlFor="edit-call-log-duration">
              <Input
                id="edit-call-log-duration"
                type="number"
                min={0}
                {...register("durationInSeconds")}
              />
            </FormField>

            <FormField label="Next Follow Up" htmlFor="edit-call-log-next-follow-up">
              <Input
                id="edit-call-log-next-follow-up"
                type="datetime-local"
                min={getMinDateTimeLocalForToday()}
                {...register("nextFollowUpAt")}
              />
            </FormField>

            <div className="col-span-full">
              <FormField label="Remarks" htmlFor="edit-call-log-remarks">
                <Textarea id="edit-call-log-remarks" rows={4} {...register("remarks")} />
              </FormField>
            </div>
          </FormGrid>
        </fieldset>
      </FormCard>
    </form>
  );
}
