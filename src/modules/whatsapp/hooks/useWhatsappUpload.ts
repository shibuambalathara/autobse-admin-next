"use client";

import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { EVENTS_BRIEF_QUERY } from "@/graphql/documents/whatsapp";
import {
  APPROVED_VEHICLE_TEMPLATE,
  DEALER_PROMOTION_TEMPLATE,
  WHATSAPP_TEMPLATE_OPTIONS,
} from "@/modules/whatsapp/constants";
import type {
  ApprovedVehiclePreview,
  EventsBriefResult,
  WhatsappEventBrief,
  WhatsappUploadFormValues,
} from "@/modules/whatsapp/types";
import { uploadWhatsappExcel } from "@/modules/whatsapp/utils/whatsapp-api";
import type { EventCategory } from "@/modules/events/types";

const defaultApprovedPreview: ApprovedVehiclePreview = {
  headerImageUrl: "",
  registrationNumber: "",
  YOM: "",
  model: "",
  location: "",
  approvedPrice: "",
  contact: "",
};

export function useWhatsappUpload() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [eventId, setEventId] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [promotionContact, setPromotionContact] = useState("");
  const [promotionMobile, setPromotionMobile] = useState("");
  const [approvedVehicleDetails, setApprovedVehicleDetails] =
    useState<ApprovedVehiclePreview>(defaultApprovedPreview);
  const [uploading, setUploading] = useState(false);

  const [loadEvents, { data: eventsData, loading: eventsLoading }] =
    useLazyQuery<EventsBriefResult>(EVENTS_BRIEF_QUERY, {
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    if (
      !selectedTemplate ||
      selectedTemplate === DEALER_PROMOTION_TEMPLATE ||
      selectedTemplate === APPROVED_VEHICLE_TEMPLATE
    ) {
      return;
    }

    const isOnlineAuction = selectedTemplate.includes("online");
    loadEvents({
      variables: {
        orderBy: [{ eventNo: "DESC" }],
        take: 50,
        where: {
          eventCategory: (isOnlineAuction ? "online" : "open") as EventCategory,
        },
      },
    });
  }, [loadEvents, selectedTemplate]);

  const events = eventsData?.events?.events ?? [];

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === eventId) ?? null,
    [eventId, events]
  );

  const submitUpload = async (formData: WhatsappUploadFormValues) => {
    setUploading(true);

    try {
      const file = formData.uploadFile?.[0];
      if (!file) {
        throw new Error("Please choose an Excel file.");
      }

      const payload = new FormData();
      payload.append("file", file);

      const isDealer = formData.template === DEALER_PROMOTION_TEMPLATE;
      const isApprovedVehicle = formData.template === APPROVED_VEHICLE_TEMPLATE;

      if (isDealer) {
        if (!formData.dealerContact?.trim()) {
          throw new Error("Autobse contact person is required.");
        }
        if (!formData.mobile?.trim()) {
          throw new Error("Mobile number is required.");
        }
        payload.append("templateName", formData.template);
        payload.append("contact", formData.dealerContact.trim());
        payload.append("mobile", formData.mobile.trim());
      } else if (isApprovedVehicle) {
        const requiredFields: {
          key: keyof WhatsappUploadFormValues;
          label: string;
        }[] = [
          { key: "headerImageUrl", label: "Header image URL" },
          { key: "registrationNumber", label: "Reg Number" },
          { key: "YOM", label: "YOM" },
          { key: "model", label: "Model" },
          { key: "location", label: "Location" },
          { key: "approvedPrice", label: "Approved Price" },
          { key: "contact", label: "Contact name and number" },
        ];

        for (const { key, label } of requiredFields) {
          const value = formData[key];
          if (!value || (typeof value === "string" && !value.trim())) {
            throw new Error(`${label} is required.`);
          }
        }

        payload.append("templateName", formData.template);
        payload.append("headerImageUrl", formData.headerImageUrl!.trim());
        payload.append("registrationNumber", formData.registrationNumber!.trim());
        payload.append("YOM", formData.YOM!.trim());
        payload.append("model", formData.model!.trim());
        payload.append("location", formData.location!.trim());
        payload.append("approvedPrice", formData.approvedPrice!.trim());
        payload.append("contact", formData.contact!.trim());
      } else {
        if (!formData.eventId) {
          throw new Error("Event is required.");
        }
        if (!formData.contactPerson?.trim()) {
          throw new Error("Contact person is required.");
        }
        payload.append("event", formData.eventId);
        payload.append("contact", formData.contactPerson.trim());
        payload.append("templateName", formData.template);
      }

      await uploadWhatsappExcel(payload, formData.template);

      await Swal.fire({
        icon: "success",
        title: "Messages sent successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    } finally {
      setUploading(false);
    }
  };

  return {
    templateOptions: WHATSAPP_TEMPLATE_OPTIONS,
    selectedTemplate,
    setSelectedTemplate,
    eventId,
    setEventId,
    contactMobile,
    setContactMobile,
    promotionContact,
    setPromotionContact,
    promotionMobile,
    setPromotionMobile,
    approvedVehicleDetails,
    setApprovedVehicleDetails,
    events,
    eventsLoading,
    selectedEvent: selectedEvent as WhatsappEventBrief | null,
    uploading,
    submitUpload,
  };
}
