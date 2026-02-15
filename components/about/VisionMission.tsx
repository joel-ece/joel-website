import React from "react";
import { Target, Eye, Heart } from "lucide-react";

export default function VisionMission() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Vision */}
      <div className="bg-gradient-to-br from-joel-purple-50 to-white rounded-xl p-8 border border-joel-purple-100">
        <div className="w-14 h-14 bg-joel-gradient rounded-lg flex items-center justify-center mb-6">
          <Eye className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
          Vision
        </h3>
        <p className="text-gray-600 leading-relaxed">
          To be a premier innovation hub that nurtures creative thinking,
          technical excellence, and interdisciplinary collaboration, producing
          engineers who drive technological advancement and societal impact.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-joel-blue-50 to-white rounded-xl p-8 border border-joel-blue-100">
        <div className="w-14 h-14 bg-joel-gradient rounded-lg flex items-center justify-center mb-6">
          <Target className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
          Mission
        </h3>
        <p className="text-gray-600 leading-relaxed">
          To provide a dynamic learning environment where students engage in
          hands-on projects, competitive initiatives, and outreach activities that
          bridge academic knowledge with real-world applications.
        </p>
      </div>

      {/* Values */}
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 border border-indigo-100">
        <div className="w-14 h-14 bg-joel-gradient rounded-lg flex items-center justify-center mb-6">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
          Values
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Innovation, collaboration, excellence, integrity, and a commitment to
          continuous learning. We believe in fostering an inclusive environment
          where every idea has the potential to make a difference.
        </p>
      </div>
    </div>
  );
}
