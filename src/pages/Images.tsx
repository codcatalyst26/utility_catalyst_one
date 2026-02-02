import { useState } from "react";
import { Maximize2, Minimize2, Eraser, ZoomIn } from "lucide-react";
import ImageCompress from "@/components/images/ImageCompress";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ImageResize from "@/components/images/ImageResize";
import ImageUpscale from "@/components/images/imageupscale";
import BgRemover from "@/components/images/BgRemover";

const tabs = [
  { id: "resize", label: "Resize Image", icon: Maximize2 },
  { id: "compress", label: "Compress Image", icon: Minimize2 },
  { id: "bg-remover", label: "Remove Background", icon: Eraser },
  { id: "upscale", label: "Upscale Image", icon: ZoomIn },
];

const Images = () => {
  const [activeTab, setActiveTab] = useState("resize");

  const renderContent = () => {
    switch (activeTab) {
      case "resize":
        return <ImageResize />;
      case "compress":
        return <ImageCompress />;
      case "bg-remover":
        return <BgRemover />;
      case "upscale":
        return <ImageUpscale />;
      default:
        return <ImageResize />;
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

export default Images;
