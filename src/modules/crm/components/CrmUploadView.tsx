"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Button, FormCard, Input, PageContainer, buttonVariants } from "@/components/ui";
import { FormField } from "@/components/forms";
import { ROUTES } from "@/constants/routes";
import { uploadPotentialClientExcel } from "@/modules/crm/utils/crm-upload-api";

interface CrmUploadFormValues {
  uploadFileName: string;
  uploadFile: FileList;
}

const fileInputClassName =
  "block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-900";

export function CrmUploadView() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CrmUploadFormValues>({
    defaultValues: { uploadFileName: "file" },
  });

  const onSubmit = async (formData: CrmUploadFormValues) => {
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
      await uploadPotentialClientExcel(file);
      await Swal.fire({
        icon: "success",
        title: "Upload successful",
        text: `${formData.uploadFileName || file.name} uploaded successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.crm);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Upload failed.";
      await Swal.fire({ icon: "error", title: "Upload failed", text: message });
    }
  };

  return (
    <PageContainer
      title="Upload Buyer Leads"
      description="Import buyer leads from an Excel file."
      actions={
        <Link
          href={ROUTES.crm}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Back to CRM
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Upload Buyer Leads Excel"
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.crm)}
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
              <p className="text-sm text-brand-600">
                The Excel file must contain mobile and firstName columns. Header
                names must exactly match: mobile, firstName, lastName, state,
                email, remarks.
              </p>

              <FormField
                label="File Name"
                htmlFor="crm-upload-file-name"
                required
                error={errors.uploadFileName?.message}
              >
                <Input
                  id="crm-upload-file-name"
                  {...register("uploadFileName", {
                    required: "File name is required",
                  })}
                />
              </FormField>

              <FormField
                label="Upload File"
                htmlFor="crm-upload-file"
                required
                hint="Accepted formats: .xlsx, .xls"
                error={errors.uploadFile?.message as string | undefined}
              >
                <Input
                  id="crm-upload-file"
                  type="file"
                  accept=".xlsx,.xls"
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
