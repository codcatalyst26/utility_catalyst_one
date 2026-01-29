import { useState } from "react";
import { Table, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileDropZone from "./FileDropZone";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

const ExcelToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    try {
      const file = files[0];

      // Read CSV/Excel as text for basic conversion
      const text = await file.text();
      const rows = text.split("\n").filter((row) => row.trim());

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let y = margin;

      pdf.setFontSize(16);
      pdf.text(file.name.replace(/\.(xlsx?|csv)$/i, ""), margin, y);
      y += 15;

      pdf.setFontSize(10);

      rows.forEach((row) => {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }

        const cells = row
          .split(",")
          .map((cell) => cell.trim().replace(/"/g, ""));
        const cellWidth = (pageWidth - margin * 2) / Math.max(cells.length, 1);

        cells.forEach((cell, index) => {
          const truncatedCell = cell.substring(0, 20);
          pdf.text(truncatedCell, margin + index * cellWidth, y);
        });

        y += 8;
      });

      const pdfBlob = pdf.output("blob");
      const fileName = file.name.replace(/\.(xlsx?|csv)$/i, ".pdf");
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
          <Table className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Excel to PDF
          </h2>
          <p className="text-sm text-muted-foreground">
            Convert spreadsheets to PDF format
          </p>
        </div>
      </div>

      <FileDropZone
        accept=".xlsx,.xls,.csv"
        onFilesSelected={setFiles}
        title="Drop your spreadsheet here"
        description="Supports .xlsx, .xls, and .csv files"
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

export default ExcelToPdf;
