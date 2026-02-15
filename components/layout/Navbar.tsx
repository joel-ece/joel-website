"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use a taller navbar on md+ so the larger PES logo fits */}
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left: JoEL Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.jpg"
              alt="JoEL Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-xl font-bold font-heading text-gray-900">
              JoEL
            </span>
          </Link>

          {/* Center + Right group */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-joel-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* PES logo - desktop (shown on md and up) */}
            <div className="hidden md:flex items-center">
              <a
                href="https://pes.edu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PES University website"
                className="inline-flex items-center"
              >
                {/* width/height set to desktop size; tailwind controls visual size responsively */}
                <Image
                  src="/pes_logo.png"
                  alt="PES University"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </a>
            </div>

            {/* Mobile PES logo (smaller) - shown only on small screens */}
            <div className="md:hidden flex items-center">
              <a
                href="https://pes.edu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PES University website"
                className="inline-flex items-center mr-2"
              >
                <Image
                  src="/pes_logo.png"
                  alt="PES University"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-joel-purple-50 text-joel-purple-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}