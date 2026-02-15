import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { projects } from "@/data/projects";

// Function to get random projects
function getRandomProjects(count: number) {
  const shuffled = [...projects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function FeaturedProjects() {
  const featuredProjects = getRandomProjects(3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Projects"
          subtitle="Showcasing innovative student projects across diverse domains"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-joel-purple-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {project.status}
                </span>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-joel-purple-100 text-joel-purple-700 rounded-full">
                  {project.category}
                </span>
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