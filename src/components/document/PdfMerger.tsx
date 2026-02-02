import { useState } from "react";
import { Layers, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropZone from "./FileDropZone";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const PdfMerger = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      saveAs(blob, "merged.pdf");
    } catch (error) {
      console.error("Merge failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Merge PDFs</h2>
          <p className="text-sm text-muted-foreground">
            Combine multiple PDFs into one document
          </p>
        </div>
      </div>

      <FileDropZone
        accept=".pdf"
        multiple
        onFilesSelected={setFiles}
        title="Drop your PDFs here"
        description="Select multiple PDF files to merge"
      />

      {files.length > 0 && files.length < 2 && (
        <p className="text-sm text-primary text-center">
          Please select at least 2 PDF files to merge
        </p>
      )}

      {files.length >= 2 && (
        <Button
          className="w-full gradient-primary border-0"
          size="lg"
          onClick={handleMerge}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Merging {files.length} PDFs...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Merge {files.length} PDFs
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PdfMerger;
