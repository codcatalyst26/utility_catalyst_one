import { useState } from "react";
import { Edit3, Download, Loader2, Type, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileDropZone from "./FileDropZone";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

const PdfEditor = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textToAdd, setTextToAdd] = useState("");
  const [textX, setTextX] = useState("50");
  const [textY, setTextY] = useState("50");
  const [pageNumber, setPageNumber] = useState("1");
  const [totalPages, setTotalPages] = useState(0);
  const [pagesToDelete, setPagesToDelete] = useState("");

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (error) {
        console.error("Failed to read PDF:", error);
      }
    }
  };

  const handleAddText = async () => {
    if (files.length === 0 || !textToAdd) return;

    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pageIndex = Math.max(0, parseInt(pageNumber) - 1);
      const page = pdfDoc.getPage(
        Math.min(pageIndex, pdfDoc.getPageCount() - 1),
      );

      page.drawText(textToAdd, {
        x: parseInt(textX) || 50,
        y: page.getHeight() - (parseInt(textY) || 50),
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const fileName = file.name.replace(".pdf", "_edited.pdf");
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Edit failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePages = async () => {
    if (files.length === 0 || !pagesToDelete) return;

    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pagesToRemove = pagesToDelete
        .split(",")
        .map((p) => parseInt(p.trim()) - 1)
        .filter((p) => p >= 0 && p < pdfDoc.getPageCount())
        .sort((a, b) => b - a);

      pagesToRemove.forEach((pageIndex) => {
        pdfDoc.removePage(pageIndex);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const fileName = file.name.replace(".pdf", "_edited.pdf");
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Edit3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">PDF Editor</h2>
          <p className="text-sm text-muted-foreground">
            Add text or remove pages from PDFs
          </p>
        </div>
      </div>

      <FileDropZone
        accept=".pdf"
        onFilesSelected={handleFilesSelected}
        title="Drop your PDF here"
        description="Select the PDF you want to edit"
      />

      {files.length > 0 && totalPages > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Add Text Section */}
          <div className="p-4 bg-secondary rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-foreground">Add Text</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="text-to-add">Text</Label>
                <Input
                  id="text-to-add"
                  placeholder="Enter text to add..."
                  value={textToAdd}
                  onChange={(e) => setTextToAdd(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="page-num">Page</Label>
                  <Input
                    id="page-num"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-x">X Position</Label>
                  <Input
                    id="text-x"
                    type="number"
                    value={textX}
                    onChange={(e) => setTextX(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-y">Y Position</Label>
                  <Input
                    id="text-y"
                    type="number"
                    value={textY}
                    onChange={(e) => setTextY(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full gradient-primary border-0"
                onClick={handleAddText}
                disabled={isProcessing || !textToAdd}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Type className="w-4 h-4 mr-2" />
                )}
                Add Text & Download
              </Button>
            </div>
          </div>

          {/* Delete Pages Section */}
          <div className="p-4 bg-secondary rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-destructive" />
              <h3 className="font-medium text-foreground">Delete Pages</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Total pages: {totalPages}
            </p>

            <div className="space-y-2">
              <Label htmlFor="pages-to-delete">
                Pages to delete (comma-separated)
              </Label>
              <Input
                id="pages-to-delete"
                placeholder="e.g., 1, 3, 5"
                value={pagesToDelete}
                onChange={(e) => setPagesToDelete(e.target.value)}
              />
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeletePages}
              disabled={isProcessing || !pagesToDelete}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Pages & Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
