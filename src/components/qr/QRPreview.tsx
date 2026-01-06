import React, { useRef, useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { SocialItem } from "@/config/socials";
import { SocialCarousel } from "@/components/qr/SocialCarousel";
import { useHistory, type QRHistoryItem } from "@/contexts/HistoryContext";
import { generateDefaultName } from "@/lib/qr-utils";

type QRType = "text" | "url" | "email" | "phone" | "vcard";

interface QRPreviewProps {
  data: string;
  fgColor: string;
  bgColor: string;
  logoUrl?: string;
  size?: number;
  onSocialSelect?: (social: SocialItem) => void;
  qrData: string;
  activeTab: string;
}

export function QRPreview({
  data,
  fgColor,
  bgColor,
  logoUrl,
  size = 256,
  onSocialSelect,
  qrData,
  activeTab,
}: QRPreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { addToHistory } = useHistory();
  const hasData = data.trim().length > 0;

  const imageSettings = logoUrl
    ? {
        src: logoUrl,
        height: size * 0.2,
        width: size * 0.2,
        excavate: true,
      }
    : undefined;

  const downloadPNG = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast({ title: "Downloaded!", description: "QR code saved as PNG" });
  };

  const downloadSVG = () => {
    const svg = document.getElementById("qr-svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "Downloaded!", description: "QR code saved as SVG" });
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setCopied(true);
      toast({ title: "Copied!", description: "QR code copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSaveToHistory = () => {
    if (!qrData) {
      toast({
        title: "Nothing to save",
        description: "Generate a QR code first",
        variant: "destructive",
      });
      return;
    }
    addToHistory({
      name: generateDefaultName(activeTab as QRType, qrData),
      type: activeTab as QRType,
      data: qrData,
      fgColor,
      bgColor,
      logoUrl: logoUrl || undefined,
    });
    toast({ title: "Saved!", description: "QR code added to history" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* QR + Socials */}
      <div className="flex items-center justify-center gap-6">
        {/* QR */}
        <div className="relative">
          {/* Hidden SVG (for SVG download) */}
          <div className="hidden">
            <QRCodeSVG
              id="qr-svg"
              value={hasData ? data : "https://example.com"}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              imageSettings={imageSettings}
            />
          </div>

          {/* Canvas (display + PNG) */}
          <div
            ref={canvasRef}
            className={`rounded-xl p-6 qr-shadow transition ${
              hasData ? "opacity-100" : "opacity-50"
            }`}
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeCanvas
              value={hasData ? data : "https://example.com"}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              imageSettings={imageSettings}
            />
          </div>

          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-sm bg-background/80 px-3 py-1 rounded-md">
                Enter data to generate
              </p>
            </div>
          )}
        </div>
        {hasData && (
          <>
            {/* Social Carousel */}
            {onSocialSelect && <SocialCarousel onSelect={onSocialSelect} />}
          </>
        )}
      </div>

      {/* Actions */}
      {hasData && (
        <div className="flex flex-wrap gap-2 items-center justify-center animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPNG}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            PNG
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={downloadSVG}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            SVG
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copy
          </Button>
          {qrData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToHistory}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save to History
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
