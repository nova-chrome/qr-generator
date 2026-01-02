"use client";

import { Link as LinkIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface TextInputFormProps {
  data: string;
  onDataChange: (data: string) => void;
}

export function TextInputForm({ data, onDataChange }: TextInputFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <div className="relative">
        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          id="content"
          value={data}
          onChange={(e) => onDataChange(e.target.value)}
          placeholder="Enter URL or text"
          className="pl-9"
        />
      </div>
    </div>
  );
}
