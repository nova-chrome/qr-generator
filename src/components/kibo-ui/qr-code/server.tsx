import QR from "qrcode";
import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export type QRStyle = "classic" | "dots";

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
  data: string;
  foreground: string;
  background: string;
  robustness?: "L" | "M" | "Q" | "H";
  style?: QRStyle;
};

export const QRCode = async ({
  data,
  foreground,
  background,
  robustness = "M",
  style = "classic",
  className,
  ...props
}: QRCodeProps) => {
  // Get QR code matrix data
  const qrCode = QR.create(data, {
    errorCorrectionLevel: robustness,
  });

  // Generate custom SVG based on style
  const size = qrCode.modules.size;
  const moduleSize = 200 / size;
  const margin = 0;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${200 + margin * 2} ${200 + margin * 2}" width="${200 + margin * 2}" height="${200 + margin * 2}">`;

  // Background
  svgContent += `<rect width="100%" height="100%" fill="${background}"/>`;

  // Draw modules
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (qrCode.modules.get(row, col)) {
        const x = col * moduleSize + margin;
        const y = row * moduleSize + margin;

        if (style === "dots") {
          // Draw circle for dots style
          const radius = moduleSize / 2;
          const cx = x + radius;
          const cy = y + radius;
          svgContent += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${foreground}"/>`;
        } else {
          // Draw square for classic style
          svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${foreground}"/>`;
        }
      }
    }
  }

  svgContent += "</svg>";

  return (
    <div
      className={cn("size-full", "[&_svg]:size-full", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SVG"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  );
};
