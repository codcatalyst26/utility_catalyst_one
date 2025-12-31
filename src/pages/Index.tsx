import React, { useState } from 'react';
import { Link, FileText, Mail, Phone, User, History, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QRPreview } from '@/components/qr/QRPreview';
import { QRCustomizer } from '@/components/qr/QRCustomizer';
import { UrlForm } from '@/components/qr/forms/UrlForm';
import { TextForm } from '@/components/qr/forms/TextForm';
import { EmailForm } from '@/components/qr/forms/EmailForm';
import { PhoneForm } from '@/components/qr/forms/PhoneForm';
import { VCardForm } from '@/components/qr/forms/VCardForm';
import { HistoryPanel } from '@/components/qr/HistoryPanel';
import { useHistory, type QRHistoryItem } from '@/contexts/HistoryContext';
import { generateDefaultName } from '@/lib/qr-utils';
import { toast } from '@/hooks/use-toast';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'vcard';

const tabs = [
  { id: 'url', label: 'URL', icon: Link },
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'vcard', label: 'Contact', icon: User },
  { id: 'history', label: 'History', icon: History },
] as const;

export default function Index() {
  const [activeTab, setActiveTab] = useState<string>('url');
  const [qrData, setQrData] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [logoUrl, setLogoUrl] = useState('');
  const { addToHistory } = useHistory();

  const handleSaveToHistory = () => {
    if (!qrData) {
      toast({ title: 'Nothing to save', description: 'Generate a QR code first', variant: 'destructive' });
      return;
    }
    addToHistory({
      name: generateDefaultName(activeTab as QRType, qrData),
      type: activeTab as QRType,
      data: qrData,
      fgColor,
      bgColor,
      logoUrl: logoUrl || undefined,
    });
    toast({ title: 'Saved!', description: 'QR code added to history' });
  };

  const handleSelectHistoryItem = (item: QRHistoryItem) => {
    setActiveTab(item.type);
    setQrData(item.data);
    setFgColor(item.fgColor);
    setBgColor(item.bgColor);
    setLogoUrl(item.logoUrl || '');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'history') {
      setQrData('');
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
                <rect x="18" y="14" width="3" height="3" rx="0.5" />
                <rect x="14" y="18" width="3" height="3" rx="0.5" />
                <rect x="18" y="18" width="3" height="3" rx="0.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">QR Generator</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Create beautiful QR codes instantly</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
              <TabsContent value="url" className="m-0"><UrlForm onDataChange={setQrData} /></TabsContent>
              <TabsContent value="text" className="m-0"><TextForm onDataChange={setQrData} /></TabsContent>
              <TabsContent value="email" className="m-0"><EmailForm onDataChange={setQrData} /></TabsContent>
              <TabsContent value="phone" className="m-0"><PhoneForm onDataChange={setQrData} /></TabsContent>
              <TabsContent value="vcard" className="m-0"><VCardForm onDataChange={setQrData} /></TabsContent>
              <TabsContent value="history" className="m-0">
                <HistoryPanel onSelectItem={handleSelectHistoryItem} />
              </TabsContent>

              {activeTab !== 'history' && (
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
            {activeTab !== 'history' && (
              <Card className="p-6 flex flex-col items-center justify-center animate-fade-in">
                <QRPreview data={qrData} fgColor={fgColor} bgColor={bgColor} logoUrl={logoUrl} />
                {qrData && (
                  <Button onClick={handleSaveToHistory} className="mt-6 gap-2">
                    <Save className="h-4 w-4" />
                    Save to History
                  </Button>
                )}
              </Card>
            )}
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Generate QR codes for URLs, text, emails, phone numbers, and contacts.</p>
        </div>
      </footer>
    </div>
  );
}
