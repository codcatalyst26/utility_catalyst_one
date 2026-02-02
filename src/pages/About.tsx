import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, FileText, Image, Users, Target, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To provide free, accessible, and easy-to-use online tools that help individuals and businesses be more productive.",
    },
    {
      icon: Users,
      title: "For Everyone",
      description:
        "Whether you're a student, professional, or business owner, our tools are designed to meet your needs without complexity.",
    },
    {
      icon: Heart,
      title: "User First",
      description:
        "We believe in putting users first. No hidden fees, no data collection, no strings attached. Just simple, effective tools.",
    },
  ];

  const features = [
    {
      icon: QrCode,
      link: "/qr",
      title: "QR Code Generator",
      description:
        "Create custom QR codes for URLs, text, emails, phone numbers, WiFi networks, and more.",
    },
    {
      icon: FileText,
      link: "/documents",
      title: "Document Tools",
      description:
        "Convert, merge, split, compress, and edit PDF documents with our comprehensive suite.",
    },
    {
      icon: Image,
      link: "/images",
      title: "Image Processing",
      description:
        "Resize, compress, remove backgrounds, and upscale images directly in your browser.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make powerful productivity tools accessible to
            everyone. Our suite of free online tools helps you work smarter, not
            harder.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  QR Generator started with a simple idea: everyone should have
                  access to professional-quality tools without the professional
                  price tag. What began as a simple QR code generator has
                  evolved into a comprehensive productivity platform.
                </p>
                <p>
                  We noticed that many online tools were either too complicated,
                  too expensive, or required unnecessary account creation. We
                  set out to change that by building tools that are free, fast,
                  and respect your privacy.
                </p>
                <p>
                  Today, thousands of users trust our platform for their daily
                  productivity needs. From generating QR codes to converting
                  documents and processing images, we've got you covered.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Our Tools
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-shadow"
              >
                <Link to={feature.link}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="text-sm text-muted-foreground">Files Processed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Free Forever</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default About;
