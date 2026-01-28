import React, { useEffect } from "react";
import { Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QRCustomizerProps {
  fgColor: string;
  bgColor: string;
  logoUrl: string;
  onFgColorChange: (color: string) => void;
  onBgColorChange: (color: string) => void;
  onLogoUrlChange: (url: string) => void;
}

const presetColors = [
  "#000000",
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#e94560",
  "#FF9F43",
  "#1dd1a1",
  "#5f27cd",
];

const STORAGE_KEY = "qr_customizer";

export function QRCustomizer({
  fgColor,
  bgColor,
  logoUrl,
  onFgColorChange,
  onBgColorChange,
  onLogoUrlChange,
}: QRCustomizerProps) {
  /** 🔹 Load from localStorage on mount */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed.fgColor) onFgColorChange(parsed.fgColor);
      if (parsed.bgColor) onBgColorChange(parsed.bgColor);
      if (parsed.logoUrl !== undefined) onLogoUrlChange(parsed.logoUrl);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  /** 🔹 Persist to localStorage whenever values change */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fgColor, bgColor, logoUrl }),
    );
  }, [fgColor, bgColor, logoUrl]);

  return (
    <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Palette className="h-4 w-4 text-primary" />
        Customize QR Code
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Foreground</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md cursor-pointer overflow-hidden"
              style={{ backgroundColor: fgColor }}
            >
              <input
                type="color"
                value={fgColor}
                onChange={(e) => onFgColorChange(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Input
              value={fgColor}
              onChange={(e) => onFgColorChange(e.target.value)}
              className="flex-1 h-10 text-xs font-mono"
              maxLength={7}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Background</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md cursor-pointer overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Input
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="flex-1 h-10 text-xs font-mono"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Preset Colors</Label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => onFgColorChange(color)}
              className="w-6 h-6 rounded-md hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Logo URL (optional)</Label>
        <Input
          type="url"
          placeholder="https://example.com/logo.png"
          value={logoUrl}
          onChange={(e) => onLogoUrlChange(e.target.value)}
          className="h-9 text-sm"
        />
        {logoUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLogoUrlChange("")}
            className="text-xs h-7"
          >
            Remove logo
          </Button>
        )}
      </div>
    </div>
  );
}
