import html2canvas from "html2canvas";

export async function downloadElementAsJpeg(
  elementId: string,
  fileName = "download.jpeg"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const dataURL = canvas.toDataURL("image/jpeg", 0.9);
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = fileName;
  link.click();
}
