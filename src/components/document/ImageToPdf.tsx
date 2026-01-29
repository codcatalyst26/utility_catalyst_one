import { useState } from "react";
import { Image as ImageIcon, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropZone from "./FileDropZone";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

const ImageToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    try {
      const pdf = new jsPDF();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = await readFileAsDataURL(file);

        if (i > 0) {
          pdf.addPage();
        }

        const img = new window.Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = imageData;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;

        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        let imgWidth = img.width;
        let imgHeight = img.height;

        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        imgWidth *= ratio;
        imgHeight *= ratio;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imageData, "JPEG", x, y, imgWidth, imgHeight);
      }

      const pdfBlob = pdf.output("blob");
      saveAs(pdfBlob, "images.pdf");
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Image to PDF
          </h2>
          <p className="text-sm text-muted-foreground">
            Convert multiple images to a single PDF
          </p>
        </div>
      </div>

      <FileDropZone
        accept="image/*"
        multiple
        onFilesSelected={setFiles}
        title="Drop your images here"
        description="Supports JPG, PNG, WebP and more. Select multiple images."
      />

      {files.length > 0 && (
        <Button
          className="w-full gradient-primary border-0"
          size="lg"
          onClick={handleConvert}
          disabled={isConverting}
        >
          {isConverting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting {files.length} image(s)...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Convert {files.length} Image(s) to PDF
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ImageToPdf;
