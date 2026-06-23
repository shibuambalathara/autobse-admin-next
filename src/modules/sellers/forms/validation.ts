import type { CreateSellerFormValues } from "@/modules/sellers/types";

export function buildCreateSellerInput(
  formData: CreateSellerFormValues
): {
  name: string;
  GSTNumber: string;
  billingContactPerson: string;
  contactPerson: string;
  mobile: string;
  nationalHead: string;
  logo: string;
} {
  const mobile = formData.mobile?.trim() ?? "";

  return {
    name: formData.sellerCompanyName.trim(),
    GSTNumber: formData.gst?.trim() ?? "",
    billingContactPerson: formData.billingContactPerson?.trim() ?? "",
    contactPerson: formData.contactPerson?.trim() ?? "",
    mobile: mobile ? `+91 ${mobile}` : "",
    nationalHead: formData.nationalHead?.trim() ?? "",
    logo: "",
  };
}

export function buildUpdateSellerInput(formData: {
  sellerCompanyName: string;
  billingContactPerson?: string;
  contactPerson?: string;
  GSTNumber?: string;
  mobile?: string;
  nationalHead?: string;
  logo?: string;
}) {
  return {
    name: formData.sellerCompanyName.trim(),
    billingContactPerson: formData.billingContactPerson?.trim() ?? "",
    contactPerson: formData.contactPerson?.trim() ?? "",
    GSTNumber: formData.GSTNumber?.trim() ?? "",
    mobile: formData.mobile?.trim() ?? "",
    nationalHead: formData.nationalHead?.trim() ?? "",
    logo: formData.logo?.trim() ?? "",
  };
}
