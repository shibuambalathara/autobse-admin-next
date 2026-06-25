"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { Button, FormCard, Input, PageContainer, Select } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import { CREATE_BLOG_MUTATION } from "@/graphql/documents/blogs";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { BlogDescriptionEditor } from "@/modules/blog/components/BlogDescriptionEditor";
import {
  BLOG_CATEGORY_OPTIONS,
  BLOG_IMAGE_MAX_BYTES,
  stripHtml,
} from "@/modules/blog/constants";
import { uploadBlogImage } from "@/modules/blog/utils/blog-api";
import type { BlogCategory } from "@/modules/blog/types";

interface CreateBlogFormValues {
  title: string;
  author: string;
  category: BlogCategory;
  image: FileList;
}

export function AddBlogView() {
  const router = useRouter();
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [createBlog, { loading }] = useMutation(CREATE_BLOG_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlogFormValues>();

  const onSubmit = async (formData: CreateBlogFormValues) => {
    if (!stripHtml(description)) {
      setDescriptionError("Description is required.");
      return;
    }
    setDescriptionError(null);

    try {
      const result = await createBlog({
        variables: {
          createBlogInput: {
            title: formData.title.trim(),
            author: formData.author.trim(),
            description,
            category: formData.category,
          },
        },
      });

      const blogId = result.data?.createBlog?.id;
      if (!blogId) {
        throw new Error("Blog creation failed.");
      }

      const image = formData.image?.[0];
      if (!image) {
        throw new Error("Blog image is required.");
      }

      try {
        await uploadBlogImage(blogId, image);
      } catch (uploadError: unknown) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Image upload failed.";
        await Swal.fire({
          icon: "warning",
          title: "Partial success",
          text: `Blog created, but image upload failed: ${message}`,
        });
        router.push(ROUTES.blog);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Blog and image uploaded successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.blog);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Blog access restricted"
        description="Only administrators can create blogs."
      />
    );
  }

  return (
    <PageContainer title="Add Blog" description="Create a new blog post.">
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
                <Button type="submit" isLoading={loading}>
                  Submit
                </Button>
              </>
            }
          >
            <FormGrid>
              <FormField
                label="Blog Title"
                htmlFor="blog-title"
                required
                error={errors.title?.message}
              >
                <Input
                  id="blog-title"
                  {...register("title", { required: "Title is required" })}
                />
              </FormField>

              <FormField
                label="Author"
                htmlFor="blog-author"
                required
                error={errors.author?.message}
              >
                <Input
                  id="blog-author"
                  {...register("author", { required: "Author is required" })}
                />
              </FormField>

              <FormField
                label="Category"
                htmlFor="blog-category"
                required
                error={errors.category?.message}
              >
                <Select
                  id="blog-category"
                  options={[
                    { label: "Select category", value: "" },
                    ...BLOG_CATEGORY_OPTIONS,
                  ]}
                  {...register("category", { required: "Category is required" })}
                />
              </FormField>

              <FormField
                label="Blog Image"
                htmlFor="blog-image"
                required
                error={errors.image?.message as string | undefined}
              >
                <Input
                  id="blog-image"
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Blog image is required",
                    validate: {
                      fileSize: (value: FileList | undefined) => {
                        const file = value?.[0];
                        if (!file) return "Blog image is required";
                        return (
                          file.size <= BLOG_IMAGE_MAX_BYTES ||
                          "Image must be under 1MB"
                        );
                      },
                    },
                  })}
                />
              </FormField>

              <div className="col-span-full">
                <FormField label="Description" htmlFor="blog-description" required>
                  <BlogDescriptionEditor
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
