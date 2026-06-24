"use client";

import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Button, FormCard, Input, PageContainer } from "@/components/ui";
import { FormField } from "@/components/forms";
import { uploadAndSplitExcel } from "@/modules/split-excel/utils/split-excel-api";

interface SplitExcelFormValues {
  uploadFile: FileList;
}

const fileInputClassName =
  "block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-900";

export function SplitExcelView() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SplitExcelFormValues>();

  const onSubmit = async (formData: SplitExcelFormValues) => {
    const file = formData.uploadFile?.[0];
    if (!file) {
      await Swal.fire({
        icon: "warning",
        title: "No file selected",
        text: "Please select an Excel file.",
      });
      return;
    }

    try {
      await uploadAndSplitExcel(file);
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Excel uploaded and ZIP downloaded.",
        timer: 3000,
        showConfirmButton: false,
      });
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to split excel.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <PageContainer
      title="Split Excel Files"
      description="Upload an Excel file to split it by state and category, then download the resulting ZIP."
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Upload Excel File"
            footer={
              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText="Processing…"
              >
                Excel Partition
              </Button>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-brand-600">
                Select an Excel file (.xlsx or .xls). The file will be split and
                downloaded automatically as a ZIP archive.
              </p>

              <FormField
                label="Upload File"
                htmlFor="split-excel-upload-file"
                required
                hint="Accepted formats: .xlsx, .xls"
                error={errors.uploadFile?.message as string | undefined}
              >
                <Input
                  id="split-excel-upload-file"
                  type="file"
                  accept=".xlsx,.xls"
                  className={fileInputClassName}
                  error={Boolean(errors.uploadFile)}
                  {...register("uploadFile", {
                    required: "Please select an Excel file",
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
