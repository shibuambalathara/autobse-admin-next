"use client";

import Link from "next/link";
import { PageContainer, buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import {
  APPROVED_VEHICLE_TEMPLATE,
  DEALER_PROMOTION_TEMPLATE,
} from "@/modules/whatsapp/constants";
import { WhatsappUploadForm } from "@/modules/whatsapp/components/WhatsappUploadForm";
import {
  ApprovedVehicleNotificationPreview,
  DealerInvitationPromotionPreview,
  OnlineAuctionWithoutExcelsPreview,
  OpenAuctionWithExcelPreview,
  OpenAuctionWithoutExcelPreview,
} from "@/modules/whatsapp/components/WhatsappTemplatePreviews";
import { useWhatsappUpload } from "@/modules/whatsapp/hooks/useWhatsappUpload";

export function WhatsappUploadView() {
  const upload = useWhatsappUpload();
  const { selectedTemplate } = upload;

  return (
    <PageContainer
      title="WhatsApp Message"
      description="Upload dealer Excel lists and send WhatsApp template messages."
      actions={
        <Link
          href={ROUTES.whatsappResponses}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Recipients
        </Link>
      }
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-center">
        <WhatsappUploadForm upload={upload} />

        {selectedTemplate === "open_auction_with_excel" && (
          <OpenAuctionWithExcelPreview
            selectedEvent={upload.selectedEvent}
            contactMobile={upload.contactMobile}
          />
        )}
        {selectedTemplate === "open_auction_without_excels" && (
          <OpenAuctionWithoutExcelPreview
            selectedEvent={upload.selectedEvent}
            contactMobile={upload.contactMobile}
          />
        )}
        {selectedTemplate === "online_auction_without_excels" && (
          <OnlineAuctionWithoutExcelsPreview
            selectedEvent={upload.selectedEvent}
            contactMobile={upload.contactMobile}
          />
        )}
        {selectedTemplate === DEALER_PROMOTION_TEMPLATE && (
          <DealerInvitationPromotionPreview
            contactName={upload.promotionContact}
            mobile={upload.promotionMobile}
          />
        )}
        {selectedTemplate === APPROVED_VEHICLE_TEMPLATE && (
          <ApprovedVehicleNotificationPreview {...upload.approvedVehicleDetails} />
        )}
      </div>
    </PageContainer>
  );
}
