export interface LiveEvent {
  id: string;
  name: string;
  description: string;
  registrationDeadline: string; // Format: "YYYY-MM-DD"
  registrationLink: string;
  isActive: boolean;
}

export const liveEvents: LiveEvent[] = [
 {
    id: "hackezee",
    name: "HackeZee 2025",
    description: "Annual Flagship Hardware Hackathon to show and build your talent",
    registrationDeadline: "2025-08-24",
    registrationLink: "x",
    isActive: true,
  },
{
    id: "roadshow",
    name: "Roadshow 2026",
    description: "If you are excited to build something real and innovative, this is your moment to step in and start creating.",
    registrationDeadline: "2026-01-15",
    registrationLink: "https://forms.gle/QBpPjRGfJ1VcNT88A",
    isActive: true,
  },

{
    id: "jimpps",
    name: "JIMPPS 2026",
    description: "JIMPPS (JoEL Interdisciplinary MathWorks Projects  for PES Students) is an initiative by JoELin collaboration with MathWorks, aimed at promoting interdisciplinary, industry-oriented, hardware–software integrated projects.",
    registrationDeadline: "2026-02-16",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSfZc5CxBayrji1l5EVYrO01hLb7ERwjr_Z9taeow9MRgZXqxw/viewform",
    isActive: true,
  },

  // Add more events here - just copy the block above and change the values
];
