"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  IDENTITY_IMAGE_KEYS,
  IDENTITY_IMAGE_LABELS,
} from "@/modules/users/constants/related-routes";
import { downloadIdentityImage } from "@/modules/users/utils/user-api";
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
            {IDENTITY_IMAGE_KEYS.map((key, index) => (
              <div
                key={key}
                className="rounded-lg border border-surface-border p-4"
              >
                <p className="mb-2 text-sm font-medium text-brand-800">
                  {IDENTITY_IMAGE_LABELS[key]}
                </p>
                <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-md bg-surface-muted">
                  {fileData[key]?.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fileData[key].preview!}
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
                    variant="ghost"
                    onClick={() => downloadIdentityImage(userId, key)}
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
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit">Upload Documents</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
