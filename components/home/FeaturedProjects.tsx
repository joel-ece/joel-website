import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const featuredProjects = [
  {
    title: "Smart IoT Energy Grid",
    description:
      "Intelligent energy monitoring system using IoT sensors and machine learning to optimize power consumption.",
    tags: ["IoT", "Machine Learning", "React"],
    status: "Completed",
  },
  {
    title: "5G Signal Propagation Analyzer",
    description:
      "Advanced tool for analyzing 5G mmWave propagation with ray-tracing algorithms.",
    tags: ["Signal Processing", "Python", "MATLAB"],
    status: "In Progress",
  },
  {
    title: "Neural Voice Assistant",
    description:
      "AI-powered voice assistant with support for regional languages including Kannada and Hindi.",
    tags: ["AI/ML", "NLP", "PyTorch"],
    status: "Completed",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Projects"
          subtitle="Showcasing innovative student projects across diverse domains"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:border-joel-purple-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status}
                </span>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-joel-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            View All Projects
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
