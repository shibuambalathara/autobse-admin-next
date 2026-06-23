"use client";

import { useCallback, useState } from "react";
import { Pencil, Plus, RotateCcw, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { FormField } from "@/components/forms";
import type { AdditionalDataFormState } from "@/modules/vehicles/types";

interface AdditionalDataSectionProps {
  additionalData: Record<string, unknown> | null;
  isEditable: boolean;
  state: AdditionalDataFormState;
  onStateChange: (state: AdditionalDataFormState) => void;
}

export function AdditionalDataSection({
  additionalData,
  isEditable,
  state,
  onStateChange,
}: AdditionalDataSectionProps) {
  const { register } = useFormContext();
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const getDisplayKey = useCallback(
    (key: string) => state.keyRenames[key] || key,
    [state.keyRenames]
  );

  const handleRename = (originalKey: string, newKey: string) => {
    const trimmed = newKey.trim();
    const keyRenames = { ...state.keyRenames };
    if (trimmed && trimmed !== originalKey) {
      keyRenames[originalKey] = trimmed;
    } else {
      delete keyRenames[originalKey];
    }
    onStateChange({ ...state, keyRenames });
    setEditingKey(null);
  };

  const hasExisting = additionalData && Object.keys(additionalData).length > 0;
  const hasContent = hasExisting || state.newFields.length > 0 || isEditable;
  if (!hasContent) return null;

  return (
    <div className="col-span-full mt-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-lg font-semibold">Additional Data</h3>
        {isEditable && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onStateChange({
                ...state,
                newFields: [
                  ...state.newFields,
                  { id: `new_${Date.now()}`, key: "", value: "" },
                ],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.newFields.map((field) => (
          <div key={field.id} className="space-y-2 rounded-lg border border-dashed border-primary/40 p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-primary">New Field</span>
              {isEditable && (
                <button
                  type="button"
                  onClick={() =>
                    onStateChange({
                      ...state,
                      newFields: state.newFields.filter((f) => f.id !== field.id),
                    })
                  }
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <FormField label="Label" htmlFor={`${field.id}-key`}>
              <Input
                id={`${field.id}-key`}
                value={field.key}
                disabled={!isEditable}
                onChange={(e) =>
                  onStateChange({
                    ...state,
                    newFields: state.newFields.map((f) =>
                      f.id === field.id ? { ...f, key: e.target.value } : f
                    ),
                  })
                }
              />
            </FormField>
            <FormField label="Value" htmlFor={`${field.id}-value`}>
              <Input
                id={`${field.id}-value`}
                value={field.value}
                disabled={!isEditable}
                onChange={(e) =>
                  onStateChange({
                    ...state,
                    newFields: state.newFields.map((f) =>
                      f.id === field.id ? { ...f, value: e.target.value } : f
                    ),
                  })
                }
              />
            </FormField>
          </div>
        ))}

        {hasExisting &&
          Object.entries(additionalData!).map(([key, value]) => {
            if (state.removedFields.has(key)) {
              return (
                <div key={`removed_${key}`} className="rounded-lg border border-dashed border-destructive/40 p-4 opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-sm line-through">{getDisplayKey(key)}</span>
                    {isEditable && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const removedFields = new Set(state.removedFields);
                          removedFields.delete(key);
                          onStateChange({ ...state, removedFields });
                        }}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            }

            const fieldName = `additionalData.${key}`;
            return (
              <div key={fieldName} className="space-y-1">
                <div className="flex items-center gap-2">
                  {editingKey === key ? (
                    <Input
                      defaultValue={getDisplayKey(key)}
                      autoFocus
                      onBlur={(e) => handleRename(key, e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium">{getDisplayKey(key)}</span>
                      {isEditable && (
                        <>
                          <button type="button" onClick={() => setEditingKey(key)}>
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const removedFields = new Set(state.removedFields);
                              removedFields.add(key);
                              onStateChange({ ...state, removedFields });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
                <Input
                  type={typeof value === "number" ? "number" : "text"}
                  disabled={!isEditable}
                  defaultValue={value == null ? "" : String(value)}
                  {...register(fieldName)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
