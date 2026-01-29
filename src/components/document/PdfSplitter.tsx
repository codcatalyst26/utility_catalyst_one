import { useState } from "react";
import { Scissors, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileDropZone from "./FileDropZone";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const PdfSplitter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fromPage, setFromPage] = useState("1");
  const [toPage, setToPage] = useState("1");
  const [totalPages, setTotalPages] = useState(0);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();
        setTotalPages(pages);
        setToPage(pages.toString());
      } catch (error) {
        console.error("Failed to read PDF:", error);
      }
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      const from = Math.max(1, parseInt(fromPage) || 1);
      const to = Math.min(totalPages, parseInt(toPage) || totalPages);

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(
        sourcePdf,
        Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i),
      );

      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const fileName = file.name.replace(".pdf", `_pages_${from}-${to}.pdf`);
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Split failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Scissors className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            PDF Splitter
          </h2>
          <p className="text-sm text-muted-foreground">
            Extract specific pages from a PDF
          </p>
        </div>
      </div>

      <FileDropZone
        accept=".pdf"
        onFilesSelected={handleFilesSelected}
        title="Drop your PDF here"
        description="Select the PDF you want to split"
      />

      {files.length > 0 && totalPages > 0 && (
        <div className="p-4 bg-secondary rounded-xl space-y-4 animate-fade-in">
          <p className="text-sm font-medium text-foreground">
            Total Pages: {totalPages}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-page">From Page</Label>
              <Input
                id="from-page"
                type="number"
                min="1"
                max={totalPages}
                value={fromPage}
                onChange={(e) => setFromPage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-page">To Page</Label>
              <Input
                id="to-page"
                type="number"
                min="1"
                max={totalPages}
                value={toPage}
                onChange={(e) => setToPage(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <Button
          className="w-full gradient-primary border-0"
          size="lg"
          onClick={handleSplit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Splitting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Split PDF
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PdfSplitter;
