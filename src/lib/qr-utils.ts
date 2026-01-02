import type { RefObject } from "react";

export interface WifiData {
  ssid: string;
  password: string;
  security: "WPA" | "WPA2" | "WEP" | "nopass";
  hidden: boolean;
}

export interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function generateVCard(contact: ContactData): string {
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n";

  if (contact.firstName || contact.lastName) {
    vcard += `FN:${contact.firstName} ${contact.lastName}\n`;
    vcard += `N:${contact.lastName};${contact.firstName};;;\n`;
  }

  if (contact.phone) {
    vcard += `TEL;TYPE=CELL:${contact.phone}\n`;
  }

  if (contact.email) {
    vcard += `EMAIL;TYPE=INTERNET:${contact.email}\n`;
  }

  if (contact.company) {
    vcard += `ORG:${contact.company}\n`;
  }

  if (contact.title) {
    vcard += `TITLE:${contact.title}\n`;
  }

  if (
    contact.address ||
    contact.city ||
    contact.state ||
    contact.zipCode ||
    contact.country
  ) {
    const addressParts = [
      contact.address,
      contact.city,
      contact.state,
      contact.zipCode,
      contact.country,
    ].filter(Boolean);
    vcard += `ADR;TYPE=HOME:;;${addressParts.join(";")}\n`;
  }

  vcard += "END:VCARD";
  return vcard;
}

export function downloadQRCode(
  qrRef: RefObject<HTMLDivElement | null>,
  fileFormat: "svg" | "png" | "jpeg",
  background: string
) {
  if (!qrRef.current) return;

  const svg = qrRef.current.querySelector("svg");
  if (!svg) return;

  if (fileFormat === "svg") {
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        // Fill background for JPEG as it doesn't support transparency
        if (fileFormat === "jpeg") {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const imgUrl = canvas.toDataURL(`image/${fileFormat}`);
        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = `qrcode.${fileFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    };
    img.src = url;
  }
}

export function generateWifiQR(wifi: WifiData): string {
  let wifiString = "WIFI:";

  if (wifi.security !== "nopass") {
    wifiString += `T:${wifi.security};`;
  }

  wifiString += `S:${wifi.ssid};`;

  if (wifi.password && wifi.security !== "nopass") {
    wifiString += `P:${wifi.password};`;
  }

  if (wifi.hidden) {
    wifiString += "H:true;";
  }

  wifiString += ";";

  return wifiString;
}
