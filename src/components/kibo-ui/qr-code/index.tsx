"use client";

import { formatHex, oklch } from "culori";
import QR from "qrcode";
import { type HTMLAttributes, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export type QRStyle = "classic" | "dots";

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
  data: string;
  foreground?: string;
  background?: string;
  robustness?: "L" | "M" | "Q" | "H";
  style?: QRStyle;
};

const oklchRegex = /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/;

const getOklch = (color: string, fallback: [number, number, number]) => {
  const oklchMatch = color.match(oklchRegex);

  if (!oklchMatch) {
    return { l: fallback[0], c: fallback[1], h: fallback[2] };
  }

  return {
    l: Number.parseFloat(oklchMatch[1]),
    c: Number.parseFloat(oklchMatch[2]),
    h: Number.parseFloat(oklchMatch[3]),
  };
};

export const QRCode = ({
  data,
  foreground,
  background,
  robustness = "M",
  style = "classic",
  className,
  ...props
}: QRCodeProps) => {
  const [svg, setSVG] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        let darkColor: string;
        let lightColor: string;

        // If hex colors are provided directly, use them
        if (foreground?.startsWith("#")) {
          darkColor = foreground;
        } else {
          // Otherwise, get from CSS variables
          const styles = getComputedStyle(document.documentElement);
          const foregroundColor =
            foreground ?? styles.getPropertyValue("--foreground");
          const foregroundOklch = getOklch(
            foregroundColor,
            [0.21, 0.006, 285.885]
          );
          darkColor = formatHex(oklch({ mode: "oklch", ...foregroundOklch }));
        }

        if (background?.startsWith("#")) {
          lightColor = background;
        } else {
          // Otherwise, get from CSS variables
          const styles = getComputedStyle(document.documentElement);
          const backgroundColor =
            background ?? styles.getPropertyValue("--background");
          const backgroundOklch = getOklch(backgroundColor, [0.985, 0, 0]);
          lightColor = formatHex(oklch({ mode: "oklch", ...backgroundOklch }));
        }

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
        svgContent += `<rect width="100%" height="100%" fill="${lightColor}"/>`;

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
                svgContent += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${darkColor}"/>`;
              } else {
                // Draw square for classic style
                svgContent += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${darkColor}"/>`;
              }
            }
          }
        }

        svgContent += "</svg>";
        setSVG(svgContent);
      } catch (err) {
        console.error(err);
      }
    };

    generateQR();
  }, [data, foreground, background, robustness, style]);

  if (!svg) {
    return null;
  }

  return (
    <div
      className={cn("size-full", "[&_svg]:size-full", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SVG"
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  );
};
