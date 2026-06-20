"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADMIN_RESET_USER_PASSWORD_MUTATION,
  SELLERS_QUERY,
  STATES_QUERY,
  UPDATE_USER_MUTATION,
  VIEW_USER_QUERY,
} from "@/graphql/documents/users";
import {
  ALLOWED_USER_ROLES,
  INDIAN_STATES,
} from "@/modules/users/constants";
import {
  buildOpenToken,
  getUpdatedFields,
} from "@/modules/users/utils";
import {
  uploadUserProfileFiles,
} from "@/modules/users/utils/user-api";
import type {
  EditUserFormValues,
  SelectOption,
  UserDetail,
  ViewUserQueryResult,
} from "@/modules/users/types";
import { extractGraphqlError } from "@/lib/graphql-errors";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";

export type UserFileData = Record<
  string,
  { file: File | null; preview: string | null }
>;

const EMPTY_FILE_DATA: UserFileData = {
  pancard_image: { file: null, preview: null },
  aadharcard_front_image: { file: null, preview: null },
  aadharcard_back_image: { file: null, preview: null },
  driving_license_front_image: { file: null, preview: null },
  driving_license_back_image: { file: null, preview: null },
};

export function useUserDetail(userId: string) {
  const [isEditable, setIsEditable] = useState(false);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [fileData, setFileData] = useState<UserFileData>(EMPTY_FILE_DATA);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data, loading, error, refetch } = useQuery<ViewUserQueryResult>(
    VIEW_USER_QUERY,
    { variables: { where: { id: userId } }, fetchPolicy: "network-only" }
  );

  const { data: allStatesData } = useQuery(STATES_QUERY);
  const { data: allSellersData } = useQuery(SELLERS_QUERY);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);
  const [resetPassword, { loading: resettingPassword }] = useMutation(
    ADMIN_RESET_USER_PASSWORD_MUTATION
  );

  const user = data?.user;

  useEffect(() => {
    if (!user) return;
    setFileData({
      pancard_image: { file: null, preview: user.pancard_image || null },
      aadharcard_front_image: {
        file: null,
        preview: user.aadharcard_front_image || null,
      },
      aadharcard_back_image: {
        file: null,
        preview: user.aadharcard_back_image || null,
      },
      driving_license_front_image: {
        file: null,
        preview: user.driving_license_front_image || null,
      },
      driving_license_back_image: {
        file: null,
        preview: user.driving_license_back_image || null,
      },
    });
  }, [user]);

  const stateOptions: SelectOption[] =
    allStatesData?.States?.map((state: { id: string; name: string }) => ({
      label: state.name.replace(/_/g, " "),
      labelValue: state.name,
      value: state.id,
    })) ?? [];

  const sellerOptions: SelectOption[] =
    allSellersData?.sellers?.map((seller: { id: string; name: string }) => ({
      label: seller.name,
      labelValue: seller.name,
      value: seller.id,
    })) ?? [];

  const defaultFormValues = (): EditUserFormValues | undefined => {
    if (!user) return undefined;
    return {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? undefined,
      email: user.email ?? undefined,
      mobile: user.mobile ?? undefined,
      role: user.role ?? undefined,
      idProofNo: user.idProofNo ?? undefined,
      state: user.state ?? undefined,
      pancardNo: user.pancardNo ?? undefined,
      status: user.status ?? undefined,
      states: user.states?.map((state) => ({
        label: state.name.replace(/_/g, " "),
        labelValue: state.name,
        value: state.id,
      })),
      seller: user.seller?.map((s) => ({
        label: s.name,
        labelValue: s.name,
        value: s.id,
      })),
      openTokenNumber: user.openToken?.slice(2) ?? "",
    };
  };

  const handleStateChange = (stateValue?: string) => {
    if (!stateValue) return;
    const stateObj = INDIAN_STATES.find((s) => s.value === stateValue);
    if (stateObj) setSelectedStateCode(stateObj.code);
  };

  const submitProfile = async (formValues: EditUserFormValues) => {
    if (!user) return;

    const openToken = buildOpenToken(
      selectedStateCode,
      formValues.openTokenNumber,
      user.openToken
    );

    const transformedStates = Array.isArray(formValues.states)
      ? formValues.states.map((s) => s.labelValue ?? s.label)
      : [];

    const transformedSellers = Array.isArray(formValues.seller)
      ? formValues.seller.map((s) => s.value)
      : [];

    const cleanFormValues = { ...formValues };
    delete cleanFormValues.openTokenNumber;

    const formData = {
      ...cleanFormValues,
      ...(transformedStates.length > 0
        ? { states: transformedStates }
        : { states: undefined }),
      ...(transformedSellers.length > 0
        ? { seller: transformedSellers }
        : { seller: undefined }),
      ...(openToken ? { openToken } : {}),
    };

    const originalData = {
      ...user,
      states: user.states?.map((s) => s.name) ?? [],
      seller: user.seller?.map((s) => s.id) ?? [],
    };

    const payload = getUpdatedFields(originalData, formData);

    if (
      "role" in payload &&
      payload.role &&
      !ALLOWED_USER_ROLES.has(String(payload.role))
    ) {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Invalid role selected.",
      });
      return;
    }

    if (Object.keys(payload).length === 0) {
      await Swal.fire({
        icon: "info",
        title: "No changes detected",
      });
      return;
    }

    try {
      await updateUser({
        variables: { where: { id: userId }, data: payload },
      });
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `The profile of ${formValues.firstName} has been successfully updated!`,
        timer: 2500,
        showConfirmButton: false,
      });
      setIsEditable(false);
      await refetch();
    } catch (err: unknown) {
      const { message } = extractGraphqlError(err);
      await Swal.fire({ icon: "error", title: "Update Failed", text: message });
    }
  };

  const submitDocuments = async () => {
    const fileMap: Record<string, File | null> = {};
    Object.entries(fileData).forEach(([key, val]) => {
      fileMap[key] = val.file;
    });

    try {
      const uploaded = await uploadUserProfileFiles(userId, fileMap);
      if (!uploaded) {
        await Swal.fire({
          icon: "info",
          title: "No file changes detected",
        });
        return;
      }
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your file(s) have been successfully uploaded!",
        timer: 2500,
        showConfirmButton: false,
      });
      await refetch();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "File upload failed";
      await Swal.fire({
        icon: "error",
        title: "File Upload Failed",
        text: message,
      });
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = e.target;
    const file = files?.length ? files[0] : null;
    if (!file) return;

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const previewUrl = URL.createObjectURL(compressed);
      setFileData((prev) => ({
        ...prev,
        [name]: { file: compressed, preview: previewUrl },
      }));
    } catch (err) {
      console.error("Error compressing image:", err);
    }
  };

  const confirmPasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter and confirm the password.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Mismatch",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      const response = await resetPassword({
        variables: {
          data: { password: newPassword },
          where: { userId },
        },
      });
      if (response?.data?.AdminResetUserPassword?.id) {
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
        await Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } catch (err: unknown) {
      const { message } = extractGraphqlError(err);
      await Swal.fire({ icon: "error", title: "Reset Failed", text: message });
    }
  };

  return {
    user: user as UserDetail | undefined,
    loading,
    error,
    isEditable,
    setIsEditable,
    selectedStateCode,
    handleStateChange,
    fileData,
    handleFileChange,
    defaultFormValues,
    stateOptions,
    sellerOptions,
    submitProfile,
    submitDocuments,
    updating,
    showPasswordModal,
    setShowPasswordModal,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordReset,
    resettingPassword,
  };
}
