import React from "react";
import { Users, Briefcase, Calendar, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "150+",
    label: "Active Members",
  },
  {
    icon: Briefcase,
    value: "50+",
    label: "Projects Completed",
  },
  {
    icon: Calendar,
    value: "25+",
    label: "Events Organized",
  },
  {
    icon: Award,
    value: "15+",
    label: "Awards Won",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-joel-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-white/80">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
