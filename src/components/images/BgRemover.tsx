import { useState } from "react";
import { Eraser, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FileDropZone from "@/components/document/FileDropZone";
import { toast } from "@/hooks/use-toast";

const BgRemover = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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
  };

  const handleRemoveBackground = async () => {
    if (!file || !preview) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress for demo purposes
      // In production, you would integrate with an API like remove.bg or use a ML model
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // For demo: create a simple transparency effect
      // In production, use a proper background removal API
      const img = new Image();
      img.src = preview;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Simple demo effect - in production use ML-based removal
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple white/near-white background removal
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is close to white
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }

        ctx.putImageData(imageData, 0, 0);

        clearInterval(progressInterval);
        setProgress(100);

        const resultUrl = canvas.toDataURL("image/png");
        setResultPreview(resultUrl);

        toast({
          title: "Background removed!",
          description:
            "Note: This is a basic demo. For better results, integrate with remove.bg API.",
        });
      }
    } catch (error) {
      console.error("Background removal failed:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while removing the background.",
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
    a.download = `no_bg_${file.name.replace(/\.[^/.]+$/, "")}.png`;
    a.click();

    toast({
      title: "Downloaded!",
      description: "Your image with transparent background has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Eraser className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Remove Background
          </h2>
          <p className="text-sm text-muted-foreground">
            Remove the background from your images
          </p>
        </div>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Demo Mode</p>
          <p className="text-xs text-muted-foreground">
            This is a basic demo that removes white backgrounds. For
            professional results, integrate with remove.bg API or similar
            services.
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
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Original</p>
              <div className="aspect-video bg-secondary rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={preview}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Result</p>
              <div
                className="aspect-video rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  background: resultPreview
                    ? "repeating-conic-gradient(#80808022 0% 25%, transparent 0% 50%) 50% / 20px 20px"
                    : "hsl(var(--secondary))",
                }}
              >
                {resultPreview ? (
                  <img
                    src={resultPreview}
                    alt="Result"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click "Remove Background" to process
                  </p>
                )}
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing...</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="flex-1 gradient-primary border-0"
            >
              <Eraser className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Remove Background"}
            </Button>
            {resultPreview && (
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BgRemover;
