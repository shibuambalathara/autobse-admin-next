"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { Button, FormCard, Input, PageContainer, Select } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  SINGLE_BLOG_QUERY,
  UPDATE_BLOG_MUTATION,
} from "@/graphql/documents/blogs";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { BlogDescriptionEditor } from "@/modules/blog/components/BlogDescriptionEditor";
import {
  BLOG_CATEGORY_OPTIONS,
  BLOG_IMAGE_MAX_BYTES,
  stripHtml,
} from "@/modules/blog/constants";
import { useAuthenticatedAdminQuery } from "@/modules/blog/hooks/useAuthenticatedAdminQuery";
import { uploadBlogImage } from "@/modules/blog/utils/blog-api";
import type { BlogCategory, SingleBlogResult } from "@/modules/blog/types";

interface EditBlogFormValues {
  title: string;
  author: string;
  category: BlogCategory;
  image?: FileList;
}

interface EditBlogViewProps {
  blogId: string;
}

export function EditBlogView({ blogId }: EditBlogViewProps) {
  const router = useRouter();
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const { canFetch } = useAuthenticatedAdminQuery();
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const { data, loading, error } = useQuery<SingleBlogResult>(SINGLE_BLOG_QUERY, {
    variables: { where: { id: blogId } },
    skip: !canFetch || !blogId,
    fetchPolicy: "network-only",
  });

  const [updateBlog, { loading: saving }] = useMutation(UPDATE_BLOG_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditBlogFormValues>();

  useEffect(() => {
    if (!data?.blog) return;
    reset({
      title: data.blog.title ?? "",
      author: data.blog.author ?? "",
      category: (data.blog.category as BlogCategory | undefined) ?? undefined,
    });
    setDescription(data.blog.description ?? "");
  }, [data?.blog, reset]);

  const onSubmit = async (formData: EditBlogFormValues) => {
    if (!stripHtml(description)) {
      setDescriptionError("Description is required.");
      return;
    }
    setDescriptionError(null);

    try {
      const result = await updateBlog({
        variables: {
          where: { id: blogId },
          updateBlogInput: {
            title: formData.title.trim(),
            author: formData.author.trim(),
            description,
            category: formData.category,
          },
        },
      });

      const updatedId = result.data?.updateBlog?.id;
      if (!updatedId) {
        throw new Error("Blog update failed.");
      }

      const image = formData.image?.[0];
      if (image) {
        try {
          await uploadBlogImage(updatedId, image);
        } catch (uploadError: unknown) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "Image upload failed.";
          await Swal.fire({
            icon: "warning",
            title: "Partial success",
            text: `Blog updated, but image upload failed: ${message}`,
          });
          router.push(ROUTES.blog);
          return;
        }
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Blog updated successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.blog);
    } catch (submitError: unknown) {
      const { message } = extractGraphqlError(submitError);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Blog access restricted"
        description="Only administrators can edit blogs."
      />
    );
  }

  if (!canFetch || loading) {
    return (
      <PageContainer title="Edit Blog" description="Update blog post details.">
        <LoadingState label="Loading blog…" />
      </PageContainer>
    );
  }

  if (error || !data?.blog) {
    return (
      <PageContainer title="Edit Blog" description="Update blog post details.">
        <p className="text-sm text-red-600">
          {extractGraphqlError(error).message || "Blog not found."}
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Blog" description="Update blog post details.">
      <div className="mx-auto w-full max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Blog Details"
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.blog)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={saving}>
                  Save Changes
                </Button>
              </>
            }
          >
            <FormGrid>
              <FormField
                label="Blog Title"
                htmlFor="edit-blog-title"
                required
                error={errors.title?.message}
              >
                <Input
                  id="edit-blog-title"
                  {...register("title", { required: "Title is required" })}
                />
              </FormField>

              <FormField
                label="Author"
                htmlFor="edit-blog-author"
                required
                error={errors.author?.message}
              >
                <Input
                  id="edit-blog-author"
                  {...register("author", { required: "Author is required" })}
                />
              </FormField>

              <FormField
                label="Category"
                htmlFor="edit-blog-category"
                required
                error={errors.category?.message}
              >
                <Select
                  id="edit-blog-category"
                  options={[
                    { label: "Select category", value: "" },
                    ...BLOG_CATEGORY_OPTIONS,
                  ]}
                  {...register("category", { required: "Category is required" })}
                />
              </FormField>

              <FormField
                label="Blog Image"
                htmlFor="edit-blog-image"
                error={errors.image?.message as string | undefined}
              >
                <Input
                  id="edit-blog-image"
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    validate: {
                      fileSize: (value: FileList | undefined) => {
                        const file = value?.[0];
                        if (!file) return true;
                        return (
                          file.size <= BLOG_IMAGE_MAX_BYTES ||
                          "Image must be under 1MB"
                        );
                      },
                    },
                  })}
                />
              </FormField>

              {data.blog.image ? (
                <div className="col-span-full">
                  <p className="mb-2 text-sm font-medium text-brand-800">Current image</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.blog.image}
                    alt={data.blog.title ?? "Current blog image"}
                    className="h-32 w-32 rounded-md object-cover"
                  />
                </div>
              ) : null}

              <div className="col-span-full">
                <FormField label="Description" htmlFor="edit-blog-description" required>
                  <BlogDescriptionEditor
                    id="edit-blog-description"
                    value={description}
                    onChange={setDescription}
                    error={descriptionError}
                  />
                </FormField>
              </div>
            </FormGrid>
          </FormCard>
        </form>
      </div>
    </PageContainer>
  );
}
