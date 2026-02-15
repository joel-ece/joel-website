import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import InitiativeCard from "@/components/initiatives/InitiativeCard";
import { initiatives } from "@/data/initiatives";

export const metadata: Metadata = {
  title: "Initiatives",
  description:
    "Explore JoEL's key initiatives: HackeZee hackathon, RoadShow outreach program, and JIMPPS interdisciplinary projects.",
};

export default function InitiativesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Initiatives"
            subtitle="Empowering students through competitions, outreach, and collaborative projects that drive innovation and learning"
            centered
          />
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {initiatives.map((initiative) => (
              <InitiativeCard
                key={initiative.id}
                title={initiative.title}
                description={initiative.description}
                longDescription={initiative.longDescription}
                icon={initiative.icon}
                category={initiative.category}
                status={initiative.status}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-joel-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            Want to Participate?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join us in our upcoming initiatives and be part of the innovation journey.
            Whether you're interested in competing, learning, or showcasing your
            projects, there's something for everyone.
          </p>
          <a
            href="mailto:joel_ece@pes.edu"
            className="inline-flex items-center px-8 py-4 bg-white text-joel-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
