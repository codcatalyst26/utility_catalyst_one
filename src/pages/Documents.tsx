import { useState } from "react";
import {
  FileText,
  ArrowLeftRight,
  Table,
  Edit3,
  Image,
  Scissors,
  Layers,
  Minimize2,
} from "lucide-react";

import Header from "@/components/Header";
import WordToPdf from "@/components/document/WordToPdf";
import PdfToWord from "@/components/document/PdfToWord";
import ExcelToPdf from "@/components/document/ExcelToPdf";
import PdfEditor from "@/components/document/PdfEditor";
import ImageToPdf from "@/components/document/ImageToPdf";
import PdfSplitter from "@/components/document/PdfSplitter";
import PdfMerger from "@/components/document/PdfMerger";
import PdfResizer from "@/components/document/PdfResizer";
import Footer from "@/components/Footer";

const tabs = [
  { id: "word-to-pdf", label: "Word to PDF", icon: FileText },
  { id: "pdf-to-word", label: "PDF to Word", icon: ArrowLeftRight },
  { id: "excel-to-pdf", label: "Excel to PDF", icon: Table },
  { id: "pdf-editor", label: "PDF Editor", icon: Edit3 },
  { id: "image-to-pdf", label: "Image to PDF", icon: Image },
  { id: "pdf-splitter", label: "PDF Splitter", icon: Scissors },
  { id: "pdf-merger", label: "Merge PDFs", icon: Layers },
  { id: "pdf-resizer", label: "PDF Resizer", icon: Minimize2 },
];

const Documents = () => {
  const [activeTab, setActiveTab] = useState("word-to-pdf");

  const renderContent = () => {
    switch (activeTab) {
      case "word-to-pdf":
        return <WordToPdf />;
      case "pdf-to-word":
        return <PdfToWord />;
      case "excel-to-pdf":
        return <ExcelToPdf />;
      case "pdf-editor":
        return <PdfEditor />;
      case "image-to-pdf":
        return <ImageToPdf />;
      case "pdf-splitter":
        return <PdfSplitter />;
      case "pdf-merger":
        return <PdfMerger />;
      case "pdf-resizer":
        return <PdfResizer />;
      default:
        return <WordToPdf />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-2 bg-card rounded-2xl shadow-card">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`converter-tab ${
                  activeTab === tab.id ? "converter-tab-active" : ""
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="tool-card animate-fade-in" key={activeTab}>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documents;
