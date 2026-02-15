import React from "react";
import { Zap, TrendingUp, Users, LucideIcon } from "lucide-react";

interface InitiativeCardProps {
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  status: string;
}

const iconMap: Record<string, LucideIcon> = {
  Zap: Zap,
  TrendingUp: TrendingUp,
  Users: Users,
};

export default function InitiativeCard({
  title,
  description,
  longDescription,
  icon,
  category,
  status,
}: InitiativeCardProps) {
  const Icon = iconMap[icon] || Zap;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
      <div className="bg-joel-gradient p-8">
        <div className="flex items-start justify-between">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <span className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
            {status}
          </span>
        </div>
        <h3 className="text-3xl font-bold font-heading text-white mt-6 mb-2">
          {title}
        </h3>
        <p className="text-white/90 text-lg">{description}</p>
      </div>
      <div className="p-8">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-joel-purple-100 text-joel-purple-700 text-sm font-semibold rounded-full">
            {category}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed">{longDescription}</p>
      </div>
    </div>
  );
}
