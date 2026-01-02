"use client";

import { Download, Link as LinkIcon, Settings2 } from "lucide-react";
import { useRef, useState } from "react";
import { QRCode } from "~/components/kibo-ui/qr-code";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function Home() {
  const [data, setData] = useState("https://cursor.sh");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [robustness, setRobustness] = useState<"L" | "M" | "Q" | "H">("M");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Customize your QR code content and style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="content"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Enter URL or text"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground">Foreground</Label>
                  <div className="flex gap-2">
                    <Input
                      id="foreground"
                      type="color"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
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
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
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
                    setRobustness(val)
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
                  Higher levels allow the QR code to be scanned even if
                  partially damaged or obscured.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col justify-center space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col p-0 gap-0">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
              <CardTitle className="text-center">Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950 min-h-[300px]">
              <div
                ref={qrRef}
                className="w-full max-w-[250px] aspect-square relative"
              >
                <QRCode
                  data={data || " "}
                  foreground={foreground}
                  background={background}
                  robustness={robustness}
                  className="rounded-lg"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-4 gap-2">
              <Button className="flex-1" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
