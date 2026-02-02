import { useState, useRef } from "react";
import { ZoomIn, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileDropZone from "@/components/document/FileDropZone";
import { toast } from "@/hooks/use-toast";

const ImageUpscale = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [scale, setScale] = useState("2");
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
    setResultPreview(null);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
    };
    img.src = url;
  };

  const handleUpscale = async () => {
    if (!file || !preview) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const scaleValue = parseInt(scale);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 150);

      const img = new Image();
      img.src = preview;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const newWidth = img.width * scaleValue;
      const newHeight = img.height * scaleValue;

      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Use better image smoothing for upscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        clearInterval(progressInterval);
        setProgress(100);

        const resultUrl = canvas.toDataURL("image/png");
        setResultPreview(resultUrl);

        toast({
          title: "Image upscaled!",
          description: `Image upscaled to ${newWidth}×${newHeight} pixels (${scaleValue}x).`,
        });
      }
    } catch (error) {
      console.error("Upscale failed:", error);
      toast({
        title: "Upscale failed",
        description: "An error occurred while upscaling the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultPreview || !file) return;

    const a = document.createElement("a");
    a.href = resultPreview;
    a.download = `upscaled_${scale}x_${file.name.replace(/\.[^/.]+$/, "")}.png`;
    a.click();

    toast({
      title: "Downloaded!",
      description: "Your upscaled image has been saved.",
    });
  };

  const newWidth = originalDimensions.width * parseInt(scale);
  const newHeight = originalDimensions.height * parseInt(scale);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <ZoomIn className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Upscale Image
          </h2>
          <p className="text-sm text-muted-foreground">
            Increase the resolution of your images
          </p>
        </div>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Basic Upscaling</p>
          <p className="text-xs text-muted-foreground">
            This uses browser-based scaling. For AI-enhanced upscaling with
            better detail preservation, integrate with services like Topaz or
            Real-ESRGAN.
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
                  src={resultPreview || preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {resultPreview ? "Upscaled:" : "Original:"}
                </span>
                <span className="font-medium text-foreground">
                  {resultPreview
                    ? `${newWidth} × ${newHeight} px`
                    : `${originalDimensions.width} × ${originalDimensions.height} px`}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Scale Factor</Label>
                <Select value={scale} onValueChange={setScale}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2x (Double)</SelectItem>
                    <SelectItem value="3">3x (Triple)</SelectItem>
                    <SelectItem value="4">4x (Quadruple)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-secondary rounded-xl space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Output Size
                </p>
                <p className="text-2xl font-bold text-primary">
                  {newWidth} × {newHeight}
                </p>
                <p className="text-xs text-muted-foreground">
                  pixels ({scale}x the original size)
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Upscaling...</span>
                    <span className="font-medium text-foreground">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleUpscale}
                  disabled={isProcessing}
                  className="flex-1 gradient-primary border-0"
                >
                  <ZoomIn className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Upscale"}
                </Button>
                {resultPreview && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageUpscale;
