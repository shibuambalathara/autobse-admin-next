"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Button, FormCard, Input, PageContainer, buttonVariants } from "@/components/ui";
import { FormField } from "@/components/forms";
import { ROUTES } from "@/constants/routes";
import {
  getEventUploadConfig,
  uploadEventFile,
  type EventUploadType,
} from "@/modules/events/utils/event-upload-api";

interface EventUploadViewProps {
  eventId: string;
  uploadType: EventUploadType;
}

interface EventUploadFormValues {
  uploadFileName: string;
  uploadFile: FileList;
}

const fileInputClassName =
  "block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-900";

export function EventUploadView({ eventId, uploadType }: EventUploadViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventCategory = searchParams.get("category") ?? undefined;
  const config = getEventUploadConfig(uploadType);
  const isEventBotUpload = uploadType === "eventbot";

  const backHref = isEventBotUpload
    ? ROUTES.eventBots
    : ROUTES.eventVehicles(eventId, eventCategory);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventUploadFormValues>({
    defaultValues: { uploadFileName: "file" },
  });

  const onSubmit = async (formData: EventUploadFormValues) => {
    const file = formData.uploadFile?.[0];
    if (!file) {
      await Swal.fire({
        icon: "warning",
        title: "No file selected",
        text: "Please choose a file to upload.",
      });
      return;
    }

    try {
      await uploadEventFile(uploadType, eventId, file);
      await Swal.fire({
        icon: "success",
        title: "Upload successful",
        text: `${formData.uploadFileName || file.name} uploaded successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(isEventBotUpload ? ROUTES.events : ROUTES.eventVehicles(eventId, eventCategory));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Upload failed.";
      await Swal.fire({ icon: "error", title: "Upload failed", text: message });
    }
  };

  return (
    <PageContainer
      title={`Upload ${config.title}`}
      description={config.description}
      actions={
        <Link
          href={backHref}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          {isEventBotUpload ? "Back to EventBots" : "Back to Vehicles"}
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title={`Upload ${config.title} File`}
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(backHref)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Upload
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <FormField
                label="File Name"
                htmlFor="upload-file-name"
                required
                error={errors.uploadFileName?.message}
              >
                <Input
                  id="upload-file-name"
                  {...register("uploadFileName", {
                    required: "File name is required",
                  })}
                />
              </FormField>

              <FormField
                label="Upload File"
                htmlFor="upload-file"
                required
                hint={`Accepted formats: ${config.accept}`}
                error={errors.uploadFile?.message as string | undefined}
              >
                <Input
                  id="upload-file"
                  type="file"
                  accept={config.accept}
                  className={fileInputClassName}
                  error={Boolean(errors.uploadFile)}
                  {...register("uploadFile", {
                    required: "Please select a file",
                  })}
                />
              </FormField>
            </div>
          </FormCard>
        </form>
      </div>
    </PageContainer>
  );
}
