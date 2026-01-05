"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, ImageIcon, QrCode } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo box */}
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
                <rect x="18" y="14" width="3" height="3" rx="0.5" />
                <rect x="14" y="18" width="3" height="3" rx="0.5" />
                <rect x="18" y="18" width="3" height="3" rx="0.5" />
              </svg>
            </div>

            {/* Text */}
            <div className="leading-tight">
              <h1 className="text-xl font-bold">QR Generator</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Create beautiful QR codes instantly
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/#qr-codes"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Codes
            </a>
            <a
              href="/#documents"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Documents
            </a>
            <a
              href="/#images"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Images
            </a>

            <a
              href="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
            <ThemeToggle />
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t py-4 space-y-4">
          <a
            href="/#documents"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Documents
          </a>
          <a
            href="/#images"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Images
          </a>
          <a
            href="/#qr-codes"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            QR Codes
          </a>
          <a
            href="/contact"
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </a>
          <div className="flex flex-col gap-2 pt-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
