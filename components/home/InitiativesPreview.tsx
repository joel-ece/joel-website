import React from "react";
import Link from "next/link";
import { Zap, TrendingUp, Users, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const iconMap = {
  Zap: Zap,
  TrendingUp: TrendingUp,
  Users: Users,
};

const initiatives = [
  {
    title: "HackeZee",
    description:
      "Annual flagship hackathon fostering innovation and competitive problem-solving.",
    icon: "Zap" as keyof typeof iconMap,
    color: "bg-purple-500",
  },
  {
    title: "RoadShow",
    description:
      "Interactive demonstration and outreach events showcasing engineering innovations.",
    icon: "TrendingUp" as keyof typeof iconMap,
    color: "bg-blue-500",
  },
  {
    title: "JIMPPS",
    description:
      "Joint Interdisciplinary Mini Projects for PES Students - collaborative learning platform.",
    icon: "Users" as keyof typeof iconMap,
    color: "bg-indigo-500",
  },
];

export default function InitiativesPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Initiatives"
          subtitle="Empowering students through competitions, outreach, and collaborative projects"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initiatives.map((initiative) => {
            const Icon = iconMap[initiative.icon];
            return (
              <div
                key={initiative.title}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
              >
                <div
                  className={`${initiative.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-gray-900 mb-3">
                  {initiative.title}
                </h3>
                <p className="text-gray-600 mb-6">{initiative.description}</p>
                <Link
                  href="/initiatives"
                  className="inline-flex items-center text-joel-purple-600 font-semibold hover:text-joel-purple-700 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/initiatives"
            className="inline-flex items-center px-8 py-4 bg-joel-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            View All Initiatives
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
