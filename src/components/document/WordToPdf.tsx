import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropZone from "./FileDropZone";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import mammoth from "mammoth";

const WordToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;

      const lines = pdf.splitTextToSize(result.value, maxWidth);
      let y = margin;

      lines.forEach((line: string) => {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += 7;
      });

      const pdfBlob = pdf.output("blob");
      const fileName = file.name.replace(/\.(docx?|doc)$/i, ".pdf");
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Word to PDF</h2>
          <p className="text-sm text-muted-foreground">
            Convert Word documents to PDF format
          </p>
        </div>
      </div>

      <FileDropZone
        accept=".doc,.docx"
        onFilesSelected={setFiles}
        title="Drop your Word document here"
        description="Supports .doc and .docx files"
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
              Converting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Convert to PDF
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WordToPdf;
