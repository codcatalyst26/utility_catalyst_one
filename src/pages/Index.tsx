// import Header from "@/components/layout/Header";
import { QrCode, FileText, Image, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Index = () => {
  const features = [
    {
      icon: QrCode,
      title: "QR Codes",
      description:
        "Generate beautiful QR codes for text, URLs, emails, phone numbers, and more.",
      href: "/",
      active: true,
    },
    {
      icon: FileText,
      title: "Documents",
      description:
        "Convert, edit, merge, split, and resize PDF documents with ease.",
      href: "/documents",
    },
    {
      icon: Image,
      title: "Images",
      description:
        "Compress, resize, and convert images between different formats.",
      href: "/images",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <QrCode className="w-4 h-4" />
            All-in-one productivity tools
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Create, Convert, and Edit
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              with Ease
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Free online tools to generate QR codes, convert documents, and
            process images. No installation required — everything works in your
            browser.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gradient-primary border-0">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="tool-card group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <span className="inline-flex items-center text-sm font-medium text-primary">
                Explore
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 p-8 bg-card rounded-2xl shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Free to Use</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">No Signup</p>
              <p className="text-sm text-muted-foreground">Required</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">Instant</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">Secure</p>
              <p className="text-sm text-muted-foreground">Browser-based</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
