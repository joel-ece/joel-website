import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="logo.jpg"
                alt="JoEL Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold font-heading text-white">
                JoEL
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Joy of Engineering Lab - Department of Electronics & Communication
              Engineering, PES University. Fostering innovation, collaboration,
              and excellence in engineering education.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/joel-ece"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/joy-of-engineering-lab/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/joe_lab.pesu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:joel_ece@pes.edu"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/initiatives"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Initiatives
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>610, BE Block</li>
              <li>PES University</li>
              <li>Bangalore, Karnataka</li>
              <li>India - 560085</li>
              <li className="pt-2">
                <a
                  href="mailto:joel_ece@pes.edu"
                  className="hover:text-white transition-colors"
                >
                  joel_ece@pes.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {currentYear} JoEL - Joy of Engineering Lab, PES University. All
              rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              Department of Electronics & Communication Engineering
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}