"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { WifiData } from "~/lib/qr-utils";

interface WifiFormProps {
  wifiData: WifiData;
  onWifiDataChange: (wifiData: WifiData) => void;
}

export function WifiForm({ wifiData, onWifiDataChange }: WifiFormProps) {
  const updateWifiData = (field: keyof WifiData, value: string | boolean) => {
    onWifiDataChange({
      ...wifiData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ssid">Network Name (SSID)</Label>
        <Input
          id="ssid"
          value={wifiData.ssid}
          onChange={(e) => updateWifiData("ssid", e.target.value)}
          placeholder="MyWiFiNetwork"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="security">Security Type</Label>
        <Select
          value={wifiData.security}
          onValueChange={(val: "WPA" | "WPA2" | "WEP" | "nopass") =>
            updateWifiData("security", val)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select security type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA</SelectItem>
            <SelectItem value="WPA2">WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">No Password</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {wifiData.security !== "nopass" && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={wifiData.password}
            onChange={(e) => updateWifiData("password", e.target.value)}
            placeholder="Enter WiFi password"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hidden"
          checked={wifiData.hidden}
          onChange={(e) => updateWifiData("hidden", e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="hidden">Hidden Network</Label>
      </div>
    </div>
  );
}
