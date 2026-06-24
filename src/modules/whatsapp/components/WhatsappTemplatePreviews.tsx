"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatDate } from "@/lib/date-format";
import type { WhatsappEventBrief } from "@/modules/whatsapp/types";

interface AuctionPreviewProps {
  selectedEvent?: WhatsappEventBrief | null;
  contactMobile?: string;
  showDownloadButton?: boolean;
}

export function OpenAuctionWithExcelPreview({
  selectedEvent,
  contactMobile,
}: AuctionPreviewProps) {
  return (
    <MessagePreviewCard title="AutoBse Auction Reminder">
      <p>
        Dear Shibu Sir,
        <br />
        <br />
        This is a reminder that the scheduled open auction will take place as
        per the details below:
      </p>
      <p>
        Seller: {selectedEvent?.seller?.name ?? "—"}
        <br />
        Date:{" "}
        {selectedEvent?.startDate
          ? formatDate(selectedEvent.startDate)
          : "—"}
        <br />
        Location: {selectedEvent?.location?.name ?? "—"}
      </p>
      <p>
        For the vehicle list or further information, visit:{" "}
        <a
          href="https://www.autobse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:underline"
        >
          www.autobse.com
        </a>
        <br />
        Contact: <strong>{contactMobile || "—"}</strong>
      </p>
      <p>Regards,
        <br />
        Automax Solutions India Pvt Ltd
      </p>
      <button
        type="button"
        className="mt-4 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white"
        disabled
      >
        Download Vehicle List
      </button>
    </MessagePreviewCard>
  );
}

export function OpenAuctionWithoutExcelPreview({
  selectedEvent,
  contactMobile,
}: AuctionPreviewProps) {
  return (
    <MessagePreviewCard title="AutoBse Auction Reminder">
      <p>
        Dear Shibu Sir,
        <br />
        <br />
        This is a reminder that the scheduled open auction will take place as
        per the details below:
      </p>
      <p>
        Seller: {selectedEvent?.seller?.name ?? "—"}
        <br />
        Date:{" "}
        {selectedEvent?.startDate
          ? formatDate(selectedEvent.startDate)
          : "—"}
        <br />
        Location: {selectedEvent?.location?.name ?? "—"}
      </p>
      <p>
        For the vehicle list or further information, visit:{" "}
        <a
          href="https://www.autobse.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:underline"
        >
          www.autobse.com
        </a>
        <br />
        Contact: <strong>{contactMobile || "—"}</strong>
      </p>
      <p>
        Regards,
        <br />
        Automax Solutions India Pvt Ltd
      </p>
    </MessagePreviewCard>
  );
}

export function OnlineAuctionWithoutExcelsPreview({
  selectedEvent,
  contactMobile,
}: AuctionPreviewProps) {
  return (
    <MessagePreviewCard title="AutoBSe Online Auction Reminder">
      <p>
        Dear Shibu Sir,
        <br />
        <br />
        You are receiving this reminder because you registered for the scheduled
        online auction. Please find the details below:
      </p>
      <p>
        Seller: {selectedEvent?.seller?.name ?? "—"}
        <br />
        Visit: www.autobse.com
      </p>
      <p>
        Contact: <strong>{contactMobile || "—"}</strong>
        <br />
        Regards,
        <br />
        Automax Solutions India Pvt Ltd
      </p>
    </MessagePreviewCard>
  );
}

interface DealerPromotionPreviewProps {
  contactName?: string;
  mobile?: string;
}

export function DealerInvitationPromotionPreview({
  contactName,
  mobile,
}: DealerPromotionPreviewProps) {
  return (
    <MessagePreviewCard title="Dealer invitation">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
        {`Dear Dealer,

Why use multiple auction portals for similar inventory and features when everything is available in one place?

Get everything you need — and more — with AutoBse at one of the lowest registration fees in the market.

Why dealers are choosing AutoBse:

✔️ Real-Time Live Bid View across auction portals
✔️ Access to the same vehicle with advanced features
✔️ 100% transparent auction process
✔️ Dedicated buyer support

Get access to live auctions, transparent bidding, and dedicated dealer support in one platform.

Save more. Bid smarter. Win more.

Reply “Hi” to start bidding with AUTOBSE or call ${contactName?.trim() || "—"} now at ${mobile?.trim() || "—"} for registration.`}
      </pre>
    </MessagePreviewCard>
  );
}

interface ApprovedVehicleNotificationPreviewProps {
  headerImageUrl?: string;
  registrationNumber?: string;
  YOM?: string;
  model?: string;
  location?: string;
  approvedPrice?: string;
  contact?: string;
}

function displayOrPlaceholder(value: string | undefined, placeholder: string) {
  return value?.trim() ? value.trim() : placeholder;
}

export function ApprovedVehicleNotificationPreview({
  headerImageUrl,
  registrationNumber,
  YOM,
  model,
  location,
  approvedPrice,
  contact,
}: ApprovedVehicleNotificationPreviewProps) {
  const headerUrl = headerImageUrl?.trim();
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [headerUrl]);

  return (
    <MessagePreviewCard title="Approved vehicle notification">
      {headerUrl && !imageLoadFailed ? (
        <img
          src={headerUrl}
          alt="Vehicle header"
          className="mb-4 max-h-48 w-full rounded-md border border-gray-200 bg-white object-contain"
          onError={() => setImageLoadFailed(true)}
        />
      ) : (
        <div className="mb-4 flex min-h-[120px] max-h-48 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-100 text-sm text-gray-500">
          {headerUrl && imageLoadFailed
            ? "Unable to load header image"
            : "{{headerImageUrl}}"}
        </div>
      )}
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
        {`Hi {{customer_name}} Sir,
We have one approved vehicle available for immediate delivery.
Vehicle Details:
Reg Number: ${displayOrPlaceholder(registrationNumber, "{{registrationNumber}}")}
YOM: ${displayOrPlaceholder(YOM, "{{YOM}}")}
Model: ${displayOrPlaceholder(model, "{{model}}")}
Location: ${displayOrPlaceholder(location, "{{location}}")}
Approved Price: ₹${displayOrPlaceholder(approvedPrice, "{{approvedPrice}}")}/-

If you are interested or for more details, please contact:
${displayOrPlaceholder(contact, "{{contact}}")}
Thank you.`}
      </pre>
    </MessagePreviewCard>
  );
}

function MessagePreviewCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="h-fit max-w-xl rounded-md border border-blue-500 bg-blue-50 p-6 font-sans shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-blue-700">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-gray-800">
        {children}
      </div>
    </div>
  );
}
