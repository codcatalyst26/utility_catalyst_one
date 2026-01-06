import React, { useState } from "react";
import { QRPreview } from "@/components/qr/QRPreview";
import { QRCustomizer } from "@/components/qr/QRCustomizer";
import { UrlForm } from "@/components/qr/forms/UrlForm";
import { TextForm } from "@/components/qr/forms/TextForm";
import { EmailForm } from "@/components/qr/forms/EmailForm";
import { PhoneForm } from "@/components/qr/forms/PhoneForm";
import { VCardForm } from "@/components/qr/forms/VCardForm";
import { HistoryPanel } from "@/components/qr/HistoryPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Link, FileText, Mail, Phone, User, History } from "lucide-react";
import { useHistory, type QRHistoryItem } from "@/contexts/HistoryContext";
import { SocialItem } from "@/config/socials";

const tabs = [
  { id: "text", label: "Text", icon: FileText },
  { id: "url", label: "URL", icon: Link },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "vcard", label: "Contact", icon: User },
  { id: "history", label: "History", icon: History },
] as const;

const QrPage = () => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [qrData, setQrData] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoUrl, setLogoUrl] = useState("");
  const { addToHistory } = useHistory();

  const handleSelectHistoryItem = (item: QRHistoryItem) => {
    setActiveTab(item.type);
    setQrData(item.data);
    setFgColor(item.fgColor);
    setBgColor(item.bgColor);
    setLogoUrl(item.logoUrl || "");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== "history") {
      setQrData("");
    }
  };
  const handleSocialSelect = (social: SocialItem) => {
    // setActiveTab("url");
    setQrData(social.url);
    setLogoUrl(social.logo);
  };

  return (
    <div>
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 h-auto p-1 bg-secondary">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="p-6 animate-fade-in">
              <TabsContent value="text" className="m-0">
                <TextForm onDataChange={setQrData} />
              </TabsContent>
              <TabsContent value="url" className="m-0">
                <UrlForm onDataChange={setQrData} />
              </TabsContent>
              <TabsContent value="email" className="m-0">
                <EmailForm onDataChange={setQrData} />
              </TabsContent>
              <TabsContent value="phone" className="m-0">
                <PhoneForm onDataChange={setQrData} />
              </TabsContent>
              <TabsContent value="vcard" className="m-0">
                <VCardForm onDataChange={setQrData} />
              </TabsContent>
              <TabsContent value="history" className="m-0">
                <HistoryPanel onSelectItem={handleSelectHistoryItem} />
              </TabsContent>

              {activeTab !== "history" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <QRCustomizer
                    fgColor={fgColor}
                    bgColor={bgColor}
                    logoUrl={logoUrl}
                    onFgColorChange={setFgColor}
                    onBgColorChange={setBgColor}
                    onLogoUrlChange={setLogoUrl}
                  />
                </div>
              )}
            </Card>

            {/* Preview Section */}
            {activeTab !== "history" && (
              <Card className="p-6 flex flex-col items-center justify-center animate-fade-in">
                <QRPreview
                  data={qrData}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  logoUrl={logoUrl}
                  onSocialSelect={handleSocialSelect}
                  qrData={qrData}
                  activeTab={activeTab}
                />
              </Card>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default QrPage;
