import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using QR Generator ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service.`,
    },
    {
      title: "2. Description of Service",
      content: `QR Generator provides free online tools for generating QR codes, processing documents, and editing images. The Service is provided "as is" and "as available" without any warranties of any kind.`,
    },
    {
      title: "3. User Responsibilities",
      content: `You agree to use the Service only for lawful purposes. You are responsible for all content you upload or process through the Service. You agree not to use the Service to:
      
• Upload or transmit any content that is unlawful, harmful, or objectionable
• Infringe upon any intellectual property rights
• Attempt to gain unauthorized access to any portion of the Service
• Use the Service for any illegal or unauthorized purpose`,
    },
    {
      title: "4. Privacy and Data",
      content: `We take your privacy seriously. Files uploaded to our Service are processed locally in your browser whenever possible. We do not store, share, or analyze your files. For more details, please refer to our Privacy Policy.`,
    },
    {
      title: "5. Intellectual Property",
      content: `The Service and its original content, features, and functionality are owned by QR Generator and are protected by international copyright, trademark, and other intellectual property laws.`,
    },
    {
      title: "6. Limitation of Liability",
      content: `In no event shall QR Generator be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
      
• Your access to or use of or inability to access or use the Service
• Any conduct or content of any third party on the Service
• Any content obtained from the Service
• Unauthorized access, use, or alteration of your transmissions or content`,
    },
    {
      title: "7. Disclaimer of Warranties",
      content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis. QR Generator makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.`,
    },
    {
      title: "8. Modifications to Service",
      content: `We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.`,
    },
    {
      title: "9. Changes to Terms",
      content: `We reserve the right to update or change these Terms at any time. We will notify users of any changes by updating the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes acceptance of those changes.`,
    },
    {
      title: "10. Contact Information",
      content: `If you have any questions about these Terms, please contact us at legal@qrgenerator.com.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 2, 2026
          </p>
        </div>
        {/* Terms Content */}
        {/* max-w-4xl */}
        <Card className="mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-8">
                Please read these terms and conditions carefully before using
                our Service.
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

export default Terms;
