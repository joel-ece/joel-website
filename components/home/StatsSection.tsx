import React from "react";
import { FileText, Clock, Globe, Users } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "13",
    label: "Research Papers Published",
  },
  {
    icon: Clock,
    value: "5 Years",
    label: "Active Research Contributions",
  },
  {
    icon: Globe,
    value: "10+",
    label: "International Conferences Presented",
  },
  {
    icon: Users,
    value: "100+",
    label: "Student Authors Mentored",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-joel-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white/80" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-heading">
                {stat.value}
              </div>
              <div className="text-white/70 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}