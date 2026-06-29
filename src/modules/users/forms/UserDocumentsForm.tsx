"use client";

import Swal from "sweetalert2";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  IDENTITY_IMAGE_KEYS,
  IDENTITY_IMAGE_LABELS,
} from "@/modules/users/constants/related-routes";
import {
  downloadIdentityImage,
  previewIdentityImage,
} from "@/modules/users/utils/user-api";
import type { UserFileData } from "@/modules/users/hooks/useUserDetail";

interface UserDocumentsFormProps {
  userId: string;
  fileData: UserFileData;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
}

export function UserDocumentsForm({
  userId,
  fileData,
  onFileChange,
  onSubmit,
}: UserDocumentsFormProps) {
  const showError = async (title: string, error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    await Swal.fire({
      icon: "error",
      title,
      text: message,
    });
  };

  const handlePreview = async (key: string) => {
    try {
      previewIdentityImage(fileData[key]?.preview);
    } catch (error: unknown) {
      await showError("Preview Failed", error);
    }
  };

  const handleDownload = async (key: string) => {
    try {
      await downloadIdentityImage(userId, key, fileData[key]?.preview);
    } catch (error: unknown) {
      await showError("Download Failed", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IDENTITY_IMAGE_KEYS.map((key, index) => {
              const preview = fileData[key]?.preview;

              return (
                <div
                  key={key}
                  className="rounded-lg border border-surface-border p-4"
                >
                  <p className="mb-2 text-sm font-medium text-brand-800">
                    {IDENTITY_IMAGE_LABELS[key]}
                  </p>
                  <div className="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-md bg-surface-muted">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt={IDENTITY_IMAGE_LABELS[key]}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-brand-400">No image</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        document.getElementById(`file-input-${index}`)?.click()
                      }
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!preview}
                      onClick={() => void handlePreview(key)}
                    >
                      Preview
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => void handleDownload(key)}
                    >
                      Download
                    </Button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id={`file-input-${index}`}
                    name={key}
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit">Upload Documents</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
