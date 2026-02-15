import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-joel-purple-50 to-joel-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
          Ready to Innovate with Us?
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join JoEL and be part of a community that transforms ideas into reality.
          Whether you're a student, faculty member, or enthusiast, there's a place
          for you here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="group inline-flex items-center px-8 py-4 bg-joel-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Get in Touch
            <Mail className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/team"
            className="inline-flex items-center px-8 py-4 bg-white text-joel-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md"
          >
            Meet Our Team
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
