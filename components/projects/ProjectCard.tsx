import React from "react";
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  team: string[];
  status: "Completed" | "In Progress" | "Planning";
  category: string;
}

const statusConfig = {
  Completed: {
    icon: CheckCircle,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    iconColor: "text-green-600",
  },
  "In Progress": {
    icon: Clock,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    iconColor: "text-yellow-600",
  },
  Planning: {
    icon: AlertCircle,
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    iconColor: "text-blue-600",
  },
};

export default function ProjectCard({
  title,
  description,
  techStack,
  team,
  status,
  category,
}: ProjectCardProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 bg-joel-purple-100 text-joel-purple-700 text-xs font-semibold rounded-full">
            {category}
          </span>
          <div
            className={`flex items-center px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-semibold rounded-full`}
          >
            <StatusIcon className={`w-3 h-3 mr-1 ${statusInfo.iconColor}`} />
            {status}
          </div>
        </div>

        <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">
          {title}
        </h3>

        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Tech Stack:
          </h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Users className="w-4 h-4 mr-2" />
            <span className="font-semibold">Team Members:</span>
          </div>
          <p className="text-sm text-gray-600">{team.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
