"use client";

import { Download } from "lucide-react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QRCode } from "~/components/kibo-ui/qr-code";
import { downloadQRCode } from "~/lib/qr-utils";

interface PreviewPanelProps {
  data: string;
  foreground: string;
  background: string;
  robustness: "L" | "M" | "Q" | "H";
  fileFormat: "svg" | "png" | "jpeg";
  onFileFormatChange: (format: "svg" | "png" | "jpeg") => void;
}

export function PreviewPanel({
  data,
  foreground,
  background,
  robustness,
  fileFormat,
  onFileFormatChange,
}: PreviewPanelProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    downloadQRCode(qrRef, fileFormat, background);
  };

  return (
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
      </CardFooter>
    </Card>
  );
}
