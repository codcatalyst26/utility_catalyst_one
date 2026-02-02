"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, ImageIcon, QrCode } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "../NavLink";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const NAV_LINK_BASE =
    "text-sm font-medium transition-colors flex items-center gap-2 px-3 py-1 rounded-md";

  const NAV_LINK_ACTIVE = "text-primary bg-primary/10 [&_svg]:text-primary";

  const NAV_LINK_HOVER = "hover:text-primary";

  const MOBILE_NAV_LINK_BASE =
    "block py-2 px-3 text-sm font-medium rounded-md transition-colors";

  const MOBILE_ICON_BUTTON =
    "rounded-md hover:bg-muted transition-colors flex items-center justify-center";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">
                QR Generator
              </h1>
              <p className="text-xs text-muted-foreground">
                Create beautiful QR codes instantly
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/qr"
              className={`${NAV_LINK_BASE} ${NAV_LINK_HOVER}`}
              activeClassName={NAV_LINK_ACTIVE}
            >
              <QrCode className="h-4 w-4" />
              QR Codes
            </NavLink>
            <NavLink
              to="/documents"
              className={`${NAV_LINK_BASE} ${NAV_LINK_HOVER}`}
              activeClassName={NAV_LINK_ACTIVE}
            >
              <FileText className="h-4 w-4" />
              Documents
            </NavLink>

            <NavLink
              to="/images"
              className={`${NAV_LINK_BASE} ${NAV_LINK_HOVER}`}
              activeClassName={NAV_LINK_ACTIVE}
            >
              <ImageIcon className="h-4 w-4" />
              Images
            </NavLink>

            <NavLink
              to="/contact"
              className={`${NAV_LINK_BASE} ${NAV_LINK_HOVER}`}
              activeClassName={NAV_LINK_ACTIVE}
            >
              Contact
            </NavLink>
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

          <div className="md:hidden flex items-center gap-2">
            {/* Theme toggle — independent button */}
            <div>
              <ThemeToggle />
            </div>

            {/* Menu toggle button */}
            <button
              className={MOBILE_ICON_BUTTON}
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
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 space-y-4">
          <NavLink
            to="/qr"
            className={MOBILE_NAV_LINK_BASE}
            activeClassName={NAV_LINK_ACTIVE}
            onClick={() => setIsMenuOpen(false)}
          >
            QR Codes
          </NavLink>

          <NavLink
            to="/documents"
            className={MOBILE_NAV_LINK_BASE}
            activeClassName={NAV_LINK_ACTIVE}
            onClick={() => setIsMenuOpen(false)}
          >
            Documents
          </NavLink>

          <NavLink
            to="/images"
            className={MOBILE_NAV_LINK_BASE}
            activeClassName={NAV_LINK_ACTIVE}
            onClick={() => setIsMenuOpen(false)}
          >
            Images
          </NavLink>

          <NavLink
            to="/contact"
            className={MOBILE_NAV_LINK_BASE}
            activeClassName={NAV_LINK_ACTIVE}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>

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
