"use client";

import { useState } from "react";
import {
  ConfigurationPanel,
  type InputMode,
  type QRStyle,
} from "~/components/qr-generator/configuration-panel";
import { PreviewPanel } from "~/components/qr-generator/preview-panel";
import {
  generateVCard,
  generateWifiQR,
  type ContactData,
  type WifiData,
} from "~/lib/qr-utils";

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [data, setData] = useState("https://cursor.sh");
  const [contactData, setContactData] = useState<ContactData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: "",
    password: "",
    security: "WPA2",
    hidden: false,
  });
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [robustness, setRobustness] = useState<"L" | "M" | "Q" | "H">("M");
  const [style, setStyle] = useState<QRStyle>("classic");
  const [fileFormat, setFileFormat] = useState<"svg" | "png" | "jpeg">("svg");

  const getQRData = (): string => {
    if (inputMode === "contact") {
      return generateVCard(contactData);
    }
    if (inputMode === "wifi") {
      return generateWifiQR(wifiData);
    }
    return data;
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              QR Generator
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Create custom QR codes instantly. Simple, fast, and free.
            </p>
          </div>

          <ConfigurationPanel
            inputMode={inputMode}
            onInputModeChange={setInputMode}
            data={data}
            onDataChange={setData}
            contactData={contactData}
            onContactDataChange={setContactData}
            wifiData={wifiData}
            onWifiDataChange={setWifiData}
            style={style}
            onStyleChange={setStyle}
            foreground={foreground}
            onForegroundChange={setForeground}
            background={background}
            onBackgroundChange={setBackground}
            robustness={robustness}
            onRobustnessChange={setRobustness}
          />
        </div>

        {/* Preview Section */}
        <div className="flex flex-col justify-center space-y-6">
          <PreviewPanel
            data={getQRData() || " "}
            foreground={foreground}
            background={background}
            robustness={robustness}
            style={style}
            fileFormat={fileFormat}
            onFileFormatChange={setFileFormat}
          />
        </div>
      </div>
    </main>
  );
}
