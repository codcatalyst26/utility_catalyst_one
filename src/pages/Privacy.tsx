import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, Server } from "lucide-react";

const Privacy = () => {
  const highlights = [
    {
      icon: Shield,
      title: "No Data Collection",
      description: "We don't collect or store your personal information.",
    },
    {
      icon: Eye,
      title: "No Tracking",
      description: "We don't use cookies or tracking technologies.",
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "Files are processed locally in your browser.",
    },
    {
      icon: Server,
      title: "No Storage",
      description: "Your files are never uploaded to our servers.",
    },
  ];

  const sections = [
    {
      title: "1. Information We Collect",
      content: `QR Generator is designed with privacy in mind. We collect minimal information:

• No personal information is required to use our Service
• We do not require account creation or login
• Files uploaded for processing are handled locally in your browser and are not transmitted to our servers
• We may collect anonymous usage statistics to improve our Service`,
    },
    {
      title: "2. How We Process Your Files",
      content: `Your privacy is our top priority:

• QR codes are generated entirely in your browser
• Document conversions are processed locally when possible
• Image processing occurs within your browser using HTML5 Canvas
• Files never leave your device unless absolutely necessary for processing`,
    },
    {
      title: "3. Cookies and Tracking",
      content: `We use minimal cookies and tracking:

• We do not use advertising cookies
• We do not track your browsing activity across other websites
• Essential cookies may be used for basic site functionality
• You can disable cookies in your browser settings`,
    },
    {
      title: "4. Third-Party Services",
      content: `We may use third-party services that have their own privacy policies:

• Content delivery networks (CDNs) for faster loading
• Analytics services for anonymous usage statistics

These services may collect anonymous data in accordance with their own privacy policies.`,
    },
    {
      title: "5. Data Security",
      content: `We take security seriously:

• All data transmission uses HTTPS encryption
• We do not store your files on our servers
• No account system means no passwords to protect
• Regular security audits and updates`,
    },
    {
      title: "6. Children's Privacy",
      content: `Our Service is available to users of all ages. We do not knowingly collect any personal information from anyone, including children under 13.`,
    },
    {
      title: "7. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify users of any changes by updating the "Last Updated" date at the top of this page.`,
    },
    {
      title: "8. Contact Us",
      content: `If you have any questions about this Privacy Policy, please contact us at privacy@qrgenerator.com.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 2, 2026
          </p>
        </div>
        {/* Privacy Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {highlights.map((item) => (
            <Card key={item.title} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Privacy Content */}
        {/* max-w-4xl */}
        <Card className="mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-8">
                At QR Generator, we respect your privacy and are committed to
                protecting it. This Privacy Policy explains how we handle your
                information when you use our Service.
              </p>

              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.title}>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
