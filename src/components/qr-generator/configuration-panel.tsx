"use client";

import { Link as LinkIcon, Settings2, User, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { ContactData, WifiData } from "~/lib/qr-utils";
import { ContactCardForm } from "./contact-card-form";
import { TextInputForm } from "./text-input-form";
import { WifiForm } from "./wifi-form";

export type InputMode = "text" | "contact" | "wifi";

interface ConfigurationPanelProps {
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  data: string;
  onDataChange: (data: string) => void;
  contactData: ContactData;
  onContactDataChange: (contactData: ContactData) => void;
  wifiData: WifiData;
  onWifiDataChange: (wifiData: WifiData) => void;
  foreground: string;
  onForegroundChange: (color: string) => void;
  background: string;
  onBackgroundChange: (color: string) => void;
  robustness: "L" | "M" | "Q" | "H";
  onRobustnessChange: (robustness: "L" | "M" | "Q" | "H") => void;
}

export function ConfigurationPanel({
  inputMode,
  onInputModeChange,
  data,
  onDataChange,
  contactData,
  onContactDataChange,
  wifiData,
  onWifiDataChange,
  foreground,
  onForegroundChange,
  background,
  onBackgroundChange,
  robustness,
  onRobustnessChange,
}: ConfigurationPanelProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Input Type</Label>
          <Select
            value={inputMode}
            onValueChange={(val: InputMode) => onInputModeChange(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select input type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Text / URL
                </div>
              </SelectItem>
              <SelectItem value="contact">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Card
                </div>
              </SelectItem>
              <SelectItem value="wifi">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  WiFi Network
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {inputMode === "text" && (
          <TextInputForm data={data} onDataChange={onDataChange} />
        )}

        {inputMode === "contact" && (
          <ContactCardForm
            contactData={contactData}
            onContactDataChange={onContactDataChange}
          />
        )}

        {inputMode === "wifi" && (
          <WifiForm wifiData={wifiData} onWifiDataChange={onWifiDataChange} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="foreground">Foreground</Label>
            <div className="flex gap-2">
              <Input
                id="foreground"
                type="color"
                value={foreground}
                onChange={(e) => onForegroundChange(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={foreground}
                onChange={(e) => onForegroundChange(e.target.value)}
                className="flex-1 font-mono uppercase"
                maxLength={7}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="background">Background</Label>
            <div className="flex gap-2">
              <Input
                id="background"
                type="color"
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="flex-1 font-mono uppercase"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="robustness">Error Correction</Label>
          <Select
            value={robustness}
            onValueChange={(val: "L" | "M" | "Q" | "H") =>
              onRobustnessChange(val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">High (30%)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Higher levels allow the QR code to be scanned even if partially
            damaged or obscured.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
