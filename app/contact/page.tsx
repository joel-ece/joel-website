import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import { Mail, MapPin, Phone, Github, Linkedin, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with JoEL at PES University. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Get in Touch"
            subtitle="Have questions, ideas, or want to collaborate? We'd love to hear from you"
            centered
          />
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Google Form Embed */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 overflow-hidden">
              <iframe
                src="https://forms.gle/3RXiKGWQDkTKnAr4A?embedded=true"
                width="100%"
                height="700"
                className="border-0 rounded-lg"
                title="Contact Form"
              >
                Loading…
              </iframe>
            </div>

            {/* Right Side: Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-joel-purple-50 to-joel-blue-50 rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h4>
                      <a
                        href="mailto:joel_ece@pes.edu"
                        className="text-joel-purple-600 hover:text-joel-purple-700 transition-colors"
                      >
                        joel_ece@pes.edu
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Location
                      </h4>
                      <p className="text-gray-600">
                        Department of ECE
                        <br />
                        PES University
                        <br />
                        Bangalore, Karnataka
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Phone
                      </h4>
                      <p className="text-gray-600">82964 65473</p>
		      <p className="text-gray-600">78929 71280</p>
		      <p className="text-gray-600">88845 21419</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                  Connect with Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/joe_lab.pesu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:opacity-90 rounded-lg flex items-center justify-center transition-opacity"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/joy-of-engineering-lab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="mailto:joel_ece@pes.edu"
                    className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                    aria-label="Email"
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Follow us on social media for updates on events, projects, and
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}