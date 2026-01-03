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

        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" shape-rendering="crispEdges">`;

        // Background
        svgContent += `<rect x="0" y="0" width="200" height="200" fill="${lightColor}"/>`;

        // Draw modules
        if (style === "dots") {
          for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
              if (qrCode.modules.get(row, col)) {
                const x = col * moduleSize;
                const y = row * moduleSize;
                const radius = moduleSize / 2;
                const cx = x + radius;
                const cy = y + radius;
                svgContent += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${darkColor}"/>`;
              }
            }
          }
        } else {
          // Classic style - optimized with path merging
          let pathD = "";
          for (let row = 0; row < size; row++) {
            let col = 0;
            while (col < size) {
              if (qrCode.modules.get(row, col)) {
                // Found a module, check for horizontal run
                let length = 1;
                while (
                  col + length < size &&
                  qrCode.modules.get(row, col + length)
                ) {
                  length++;
                }

                const x = col * moduleSize;
                const y = row * moduleSize;
                const w = length * moduleSize;
                const h = moduleSize;

                pathD += `M${x},${y}h${w}v${h}h-${w}z`;
                col += length;
              } else {
                col++;
              }
            }
          }
          svgContent += `<path d="${pathD}" fill="${darkColor}"/>`;
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
