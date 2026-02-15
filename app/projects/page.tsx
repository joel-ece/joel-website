import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore innovative student projects from JoEL spanning IoT, AI/ML, robotics, signal processing, and embedded systems.",
};

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Student Projects"
            subtitle="Innovative solutions and cutting-edge research from our talented student community"
            centered
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                techStack={project.techStack}
                team={project.team}
                status={project.status}
                category={project.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
            Have a Project Idea?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're working on an innovative idea or want to collaborate with
            peers, JoEL provides the resources, mentorship, and platform to bring
            your vision to life.
          </p>
          <a
            href="mailto:joel.ece@pes.edu"
            className="inline-flex items-center px-8 py-4 bg-joel-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Submit Your Project
          </a>
        </div>
      </section>
    </div>
  );
}
