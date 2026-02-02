import { useState } from "react";
import { Minimize2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FileDropZone from "./FileDropZone";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const PdfResizer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState([100]);

  const handleResize = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const scaleFactor = scale[0] / 100;
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.setSize(width * scaleFactor, height * scaleFactor);
        page.scaleContent(scaleFactor, scaleFactor);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const fileName = file.name.replace(".pdf", `_${scale[0]}percent.pdf`);
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Resize failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Minimize2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">PDF Resizer</h2>
          <p className="text-sm text-muted-foreground">
            Resize PDF page dimensions
          </p>
        </div>
      </div>

      <FileDropZone
        accept=".pdf"
        onFilesSelected={setFiles}
        title="Drop your PDF here"
        description="Select the PDF you want to resize"
      />

      {files.length > 0 && (
        <div className="p-4 bg-secondary rounded-xl space-y-4 animate-fade-in">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Scale</Label>
              <span className="text-sm font-medium text-primary">
                {scale[0]}%
              </span>
            </div>
            <Slider
              value={scale}
              onValueChange={setScale}
              min={25}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>25%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <Button
          className="w-full gradient-primary border-0"
          size="lg"
          onClick={handleResize}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resizing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Resize to {scale[0]}%
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PdfResizer;
