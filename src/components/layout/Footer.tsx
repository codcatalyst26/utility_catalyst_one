import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";

/* ======================
   Reusable class names
====================== */

const FOOTER_LINK =
  "text-sm text-muted-foreground transition-colors hover:text-primary";

const FOOTER_LINK_ACTIVE = "text-primary font-medium";

const FOOTER_TITLE = "font-semibold text-foreground mb-4";

const FOOTER_SECTION = "space-y-2";

/* ======================
   Component
====================== */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    tools: [
      { label: "QR Codes", href: "/qr" },
      { label: "Documents", href: "/documents" },
      { label: "Images", href: "/images" },
    ],
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">
                QR Generator
              </span>
            </Link>

            <p className="text-sm text-muted-foreground">
              Free online tools to create QR codes, convert documents, and
              process images.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className={FOOTER_TITLE}>Tools</h4>
            <ul className={FOOTER_SECTION}>
              {links.tools.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={FOOTER_LINK}
                    activeClassName={FOOTER_LINK_ACTIVE}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={FOOTER_TITLE}>Company</h4>
            <ul className={FOOTER_SECTION}>
              {links.company.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={FOOTER_LINK}
                    activeClassName={FOOTER_LINK_ACTIVE}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={FOOTER_TITLE}>Legal</h4>
            <ul className={FOOTER_SECTION}>
              {links.legal.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={FOOTER_LINK}
                    activeClassName={FOOTER_LINK_ACTIVE}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} QR Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
