"use client";

import { useRef, useState } from "react";
import { Camera, X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export function ImageCaptureField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Ảnh đính kèm</label>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-border aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors active:scale-98"
        >
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
            <Camera className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Chụp ảnh hoặc chọn từ thư viện</span>
          <span className="text-xs">Hóa đơn, món đã mua...</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
