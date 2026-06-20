"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_USER_MUTATION } from "@/graphql/documents/users";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import { INDIAN_STATES } from "@/modules/users/constants";
import { addUserValidation } from "@/modules/users/forms/validation";
import { uploadUserDocuments } from "@/modules/users/utils/user-api";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import Swal from "sweetalert2";

interface AddUserFormValues {
  first_Name: string;
  last_Name?: string;
  email?: string;
  mobile: string;
  pancardNumber: string;
  state: string;
  IdNumber?: string;
  pancardImage: FileList;
  idProof?: FileList;
  idBack?: FileList;
}

export function AddUserForm() {
  const router = useRouter();
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUserFormValues>();

  const onSubmit = async (formData: AddUserFormValues) => {
    const userPayload = {
      firstName: formData.first_Name,
      lastName: formData.last_Name || "",
      email: formData.email || "",
      mobile: formData.mobile,
      pancardNo: formData.pancardNumber,
      state: formData.state,
    };

    try {
      const result = await createUser({ variables: { data: userPayload } });
      const newUserId = result.data?.createUser?.id;
      if (!newUserId) {
        throw new Error("User creation failed. No ID returned.");
      }

      await uploadUserDocuments(newUserId, {
        pancardImage: formData.pancardImage?.[0],
        idProof: formData.idProof?.[0],
        idBack: formData.idBack?.[0],
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `${formData.first_Name} added successfully!`,
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.users);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Add User"
        description="Create a new dealer or admin user account."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.users)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Create User
            </Button>
          </>
        }
      >
        <FormGrid columns={2}>
          <FormField
            label="First Name"
            htmlFor="first_Name"
            required
            error={errors.first_Name?.message}
          >
            <Input
              id="first_Name"
              {...register("first_Name", addUserValidation.firstName)}
            />
          </FormField>
          <FormField
            label="Last Name"
            htmlFor="last_Name"
            error={errors.last_Name?.message}
          >
            <Input
              id="last_Name"
              {...register("last_Name", addUserValidation.lastName)}
            />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </FormField>
          <FormField
            label="Mobile Number"
            htmlFor="mobile"
            required
            error={errors.mobile?.message}
          >
            <Input
              id="mobile"
              {...register("mobile", addUserValidation.mobile)}
            />
          </FormField>
          <FormField
            label="Pancard Number"
            htmlFor="pancardNumber"
            required
            error={errors.pancardNumber?.message}
          >
            <Input
              id="pancardNumber"
              {...register("pancardNumber", addUserValidation.pancardNo)}
            />
          </FormField>
          <FormField
            label="State"
            htmlFor="state"
            required
            error={errors.state?.message}
          >
            <Select
              id="state"
              placeholder="Select state"
              options={INDIAN_STATES}
              {...register("state", addUserValidation.state)}
            />
          </FormField>
          <FormField
            label="ID Proof Number"
            htmlFor="IdNumber"
            error={errors.IdNumber?.message}
          >
            <Input
              id="IdNumber"
              {...register("IdNumber", addUserValidation.idNumber)}
            />
          </FormField>
          <FormField
            label="Pancard Image"
            htmlFor="pancardImage"
            required
            error={errors.pancardImage?.message as string | undefined}
          >
            <Input
              id="pancardImage"
              type="file"
              accept="image/*"
              {...register("pancardImage", addUserValidation.pancardImage)}
            />
          </FormField>
          <FormField
            label="ID Proof (Front)"
            htmlFor="idProof"
            error={errors.idProof?.message as string | undefined}
          >
            <Input
              id="idProof"
              type="file"
              accept="image/*"
              {...register("idProof", addUserValidation.optionalImage)}
            />
          </FormField>
          <FormField
            label="ID Proof (Back)"
            htmlFor="idBack"
            error={errors.idBack?.message as string | undefined}
          >
            <Input
              id="idBack"
              type="file"
              accept="image/*"
              {...register("idBack", addUserValidation.optionalImage)}
            />
          </FormField>
        </FormGrid>
      </FormCard>
    </form>
  );
}
