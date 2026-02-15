import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import { Mail, MapPin, Phone, Github, Linkedin, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with JoEL. Contact information, location details, and inquiry form for PES University's Joy of Engineering Lab.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Get in Touch"
            subtitle="Have questions or want to collaborate? We'd love to hear from you"
            centered
          />
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joel-purple-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joel-purple-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joel-purple-500 focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joel-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-joel-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-joel-purple-50 to-joel-blue-50 rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <a
                        href="mailto:joel.ece@pes.edu"
                        className="text-joel-purple-600 hover:text-joel-purple-700 transition-colors"
                      >
                        joel.ece@pes.edu
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Location
                      </h4>
                      <p className="text-gray-600">
                        Department of Electronics & Communication Engineering
                        <br />
                        PES University
                        <br />
                        100 Feet Ring Road, BSK III Stage
                        <br />
                        Bangalore, Karnataka 560085
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-joel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">
                        Available through university contact
                      </p>
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
                    href="https://github.com/joel-ece"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="https://linkedin.com/company/joel-pes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="https://instagram.com/joel.pes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:opacity-90 rounded-lg flex items-center justify-center transition-opacity"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Follow us on social media for updates on events, projects, and
                  opportunities.
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-semibold">PES University</p>
                    <p className="text-sm text-gray-500">Bangalore, Karnataka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
