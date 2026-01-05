import Header from "@/components/Header";
import QrPage from "./QrPage";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <QrPage />

      {/* Footer */}
      <Footer />
    </div>
  );
}
