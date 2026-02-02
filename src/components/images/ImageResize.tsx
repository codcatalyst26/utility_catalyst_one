import { useState, useRef } from "react";
import { Maximize2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import FileDropZone from "@/components/document/FileDropZone";
import { toast } from "@/hooks/use-toast";

const ImageResize = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || !preview) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = preview;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `resized_${width}x${height}_${file.name}`;
          a.click();
          URL.revokeObjectURL(url);

          toast({
            title: "Image resized!",
            description: `Image resized to ${width}x${height} pixels.`,
          });
        }
      }, file.type);
    } catch (error) {
      console.error("Resize failed:", error);
      toast({
        title: "Resize failed",
        description: "An error occurred while resizing the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setWidth(originalWidth);
    setHeight(originalHeight);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Maximize2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Resize Image
          </h2>
          <p className="text-sm text-muted-foreground">
            Change the dimensions of your image
          </p>
        </div>
      </div>

      <FileDropZone
        accept="image/*"
        onFilesSelected={handleFilesSelected}
        title="Drop your image here"
        description="Supports JPG, PNG, WebP, GIF"
      />

      {preview && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-video bg-secondary rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Original: {originalWidth} × {originalHeight} px
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <Label htmlFor="aspect-ratio" className="cursor-pointer">
                  Maintain aspect ratio
                </Label>
                <Switch
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleResize}
                  disabled={isProcessing}
                  className="flex-1 gradient-primary border-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Download"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResize;
