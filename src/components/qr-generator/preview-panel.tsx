"use client";

import { Download, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { QRCode } from "~/components/kibo-ui/qr-code";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
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
import { downloadQRCode } from "~/lib/qr-utils";

export type QRStyle = "classic" | "dots";
export type InputMode = "text" | "contact" | "wifi";

interface PreviewPanelProps {
  data: string;
  rawText?: string;
  inputMode?: InputMode;
  foreground: string;
  background: string;
  robustness: "L" | "M" | "Q" | "H";
  style: QRStyle;
  fileFormat: "svg" | "png" | "jpeg";
  onFileFormatChange: (format: "svg" | "png" | "jpeg") => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
}

export function PreviewPanel({
  data,
  rawText,
  inputMode,
  foreground,
  background,
  robustness,
  style,
  fileFormat,
  onFileFormatChange,
  fileName,
  onFileNameChange,
}: PreviewPanelProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [showTextPreview, setShowTextPreview] = useState(false);

  const handleDownload = () => {
    downloadQRCode(qrRef, fileFormat, background, fileName);
  };

  const shouldShowTextPreview = inputMode === "contact" || inputMode === "wifi";

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col p-0 gap-0">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
        <CardTitle className="text-center">Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950 min-h-[300px] space-y-4">
        <div
          ref={qrRef}
          className="w-full max-w-[250px] aspect-square relative"
        >
          <QRCode
            data={data || " "}
            foreground={foreground}
            background={background}
            robustness={robustness}
            style={style}
            className="rounded-lg"
          />
        </div>

        {shouldShowTextPreview && (
          <div className="w-full max-w-[250px]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTextPreview(!showTextPreview)}
              className="w-full mb-2"
            >
              <FileText className="w-4 h-4 mr-2" />
              {showTextPreview ? "Hide" : "Show"} Text Preview
            </Button>

            {showTextPreview && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-xs font-mono text-slate-700 dark:text-slate-300 border max-h-32 overflow-auto">
                <pre className="whitespace-pre-wrap break-all">
                  {rawText || "No data available"}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-4 gap-2 flex-col">
        <div className="w-full space-y-2">
          <Label htmlFor="fileName">File Name</Label>
          <Input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="qrcode"
            className="font-mono"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Defaults to "qrcode" if left empty
          </p>
        </div>
        <div className="w-full flex gap-2">
          <Select
            value={fileFormat}
            onValueChange={(val: "svg" | "png" | "jpeg") =>
              onFileFormatChange(val)
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download {fileFormat.toUpperCase()}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
