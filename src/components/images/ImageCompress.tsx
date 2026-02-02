import { useState, useRef } from "react";
import { Minimize2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FileDropZone from "@/components/document/FileDropZone";
import { toast } from "@/hooks/use-toast";

const ImageCompress = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

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
    setOriginalSize(selectedFile.size);
    setCompressedSize(null);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleCompress = async () => {
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

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const ext = mimeType === "image/png" ? "png" : "jpg";
            a.download = `compressed_${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
            a.click();
            URL.revokeObjectURL(url);

            const savings = (
              ((originalSize - blob.size) / originalSize) *
              100
            ).toFixed(1);
            toast({
              title: "Image compressed!",
              description: `Reduced by ${savings}% (${formatFileSize(originalSize)} → ${formatFileSize(blob.size)})`,
            });
          }
        },
        mimeType,
        quality / 100,
      );
    } catch (error) {
      console.error("Compression failed:", error);
      toast({
        title: "Compression failed",
        description: "An error occurred while compressing the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Minimize2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Compress Image
          </h2>
          <p className="text-sm text-muted-foreground">
            Reduce file size while maintaining quality
          </p>
        </div>
      </div>

      <FileDropZone
        accept="image/*"
        onFilesSelected={handleFilesSelected}
        title="Drop your image here"
        description="Supports JPG, PNG, WebP"
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original size:</span>
                <span className="font-medium text-foreground">
                  {formatFileSize(originalSize)}
                </span>
              </div>
              {compressedSize && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Compressed size:
                  </span>
                  <span className="font-medium text-primary">
                    {formatFileSize(compressedSize)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm font-medium text-foreground">
                    {quality}%
                  </span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={([value]) => setQuality(value)}
                  min={10}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-xl space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Compression Tips
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 80-90%: Best balance of quality and size</li>
                  <li>• 60-80%: Good for web images</li>
                  <li>• Below 60%: Noticeable quality loss</li>
                </ul>
              </div>

              <Button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full gradient-primary border-0"
              >
                <Download className="w-4 h-4 mr-2" />
                {isProcessing ? "Compressing..." : "Compress & Download"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCompress;
