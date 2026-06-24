"use client";

import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Button, FormCard, Input, PageContainer } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  downloadExtractedZip,
  downloadFromExtractUrl,
  pollExtractPdfImagesStatus,
  startExtractPdfImages,
} from "@/modules/pdf-image-extract/utils/extract-pdf-images-api";

interface PdfImageExtractFormValues {
  url: string;
  uploadFile: FileList;
}

const fileInputClassName =
  "block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-900";

export function PdfImageExtractView() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PdfImageExtractFormValues>({
    defaultValues: { url: "" },
  });

  const onSubmit = async (formData: PdfImageExtractFormValues) => {
    const file = formData.uploadFile?.[0];
    const url = formData.url.trim();

    if (!file && !url) {
      await Swal.fire({
        icon: "warning",
        title: "Missing input",
        text: "For image extraction, provide a URL or upload a PDF/Excel file.",
      });
      return;
    }

    try {
      const started = await startExtractPdfImages(
        file ? { file, url: url || undefined } : { url }
      );

      if (started.kind === "blob") {
        downloadExtractedZip(
          started.blob,
          started.filename || "pdf-extracted-images.zip"
        );
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Images extracted and ZIP downloaded.",
          timer: 3000,
          showConfirmButton: false,
        });
        reset();
        return;
      }

      const { jobId } = started.data;
      await Swal.fire({
        icon: "info",
        title: "Started",
        text: `Extraction started. Job ID: ${jobId}`,
        timer: 3000,
        showConfirmButton: false,
      });

      const finalStatus = await pollExtractPdfImagesStatus(jobId, {
        intervalMs: 2500,
        timeoutMs: 10 * 60 * 1000,
      });

      if (finalStatus.blob) {
        downloadExtractedZip(
          finalStatus.blob,
          finalStatus.filename || "pdf-extracted-images.zip"
        );
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "ZIP downloaded.",
          timer: 3000,
          showConfirmButton: false,
        });
        reset();
        return;
      }

      if (finalStatus.downloadUrl) {
        try {
          await downloadFromExtractUrl(finalStatus.downloadUrl);
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "ZIP downloaded.",
            timer: 3000,
            showConfirmButton: false,
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Download link opened.";
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            timer: 4000,
            showConfirmButton: false,
          });
        }
        reset();
        return;
      }

      await Swal.fire({
        icon: "warning",
        title: "Completed",
        text: "Extraction completed, but download link was not returned.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <PageContainer
      title="PDF Image Extract"
      description="Extract images from a PDF, Excel file, or remote URL."
    >
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="PDF / Paste URL / Excel"
            footer={
              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText="Processing…"
              >
                Extract images
              </Button>
            }
          >
            <div className="space-y-4">
              <FormField label="File URL" htmlFor="pdf-extract-url">
                <Input
                  id="pdf-extract-url"
                  type="text"
                  placeholder="Paste file URL (optional if uploading)"
                  {...register("url")}
                />
              </FormField>

              <FormField
                label="Upload File"
                htmlFor="pdf-extract-upload-file"
                hint="Accepted formats: .pdf, .xlsx, .xls"
              >
                <Input
                  id="pdf-extract-upload-file"
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  className={fileInputClassName}
                  {...register("uploadFile")}
                />
              </FormField>

              <div className="flex items-start gap-2 rounded-md border border-brand-100 bg-brand-50 p-3 text-sm text-brand-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <p>
                  For image extraction, provide a URL or upload a PDF/Excel file.
                  If the file is an Excel, it must contain the headers{" "}
                  <span className="font-medium">Loan_Agreement_No</span> and{" "}
                  <span className="font-medium">Inspection_Link</span>.
                </p>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </PageContainer>
  );
}
