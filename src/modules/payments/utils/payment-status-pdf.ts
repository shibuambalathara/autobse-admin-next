import jsPDF from "jspdf";
import type { PaymentListItem } from "@/modules/payments/types";

function formatPdfDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Generates a payment status letter PDF (legacy `convertToPDF` in paymentForAll.jsx).
 */
export function downloadPaymentStatusPdf(payment: PaymentListItem): void {
  const pdf = new jsPDF();
  const datePrinted = `Printed Date : ${new Date().toLocaleDateString()}`;
  const createdPayment = formatPdfDateTime(payment.createdAt);
  const updatedPayment = formatPdfDateTime(payment.updatedAt);
  const createdBy = payment.createdBy?.firstName ?? "";

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("AUTOBSE", 10, 20);

  pdf.setFontSize(12);
  pdf.text(datePrinted, 150, 50);
  pdf.text("Sub : Payment status active letter", 10, 60);
  pdf.setFont("helvetica", "normal");

  pdf.text(`Amount              : ${payment.amount ?? ""}`, 10, 80);
  pdf.text(`Created At          : ${createdPayment}`, 10, 90);
  pdf.text(`Updated At          : ${updatedPayment}`, 10, 100);
  pdf.text(`payment For         : ${payment.paymentFor ?? ""}`, 10, 110);
  pdf.text(`Payment Created By  : ${createdBy}`, 10, 120);

  pdf.setFontSize(10);
  pdf.text("User registration details on AUTOBSe are as follows:", 10, 138);
  pdf.setFontSize(12);

  pdf.text(`First Name  : ${payment.user?.firstName ?? ""}`, 10, 148);
  pdf.text(`Last Name   : ${payment.user?.lastName ?? ""}`, 10, 158);
  pdf.text(`Mobile      : ${payment.user?.mobile ?? ""}`, 10, 168);

  const fileName = `payment of ${payment.user?.firstName ?? "user"}.pdf`;
  pdf.save(fileName);
}
