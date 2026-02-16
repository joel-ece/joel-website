import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

const sponsors = {
  technical: {
    id: "tech-1",
    name: "",
    image: "/sponsors/technical.png",
    url: "https://in.mathworks.com",
    alt: "MathWorks logo",
    description:
      "",
  },
  financial: [
    {
      id: "fin-1",
      name: "Synaptics",
      image: "/sponsors/financial1.png",
      url: "https://www.synaptics.com",
      alt: "Synaptics logo",
    },
    {
      id: "fin-2",
      name: "CrazyPi",
      image: "/sponsors/financial2.jpg",
      url: "https://www.crazypi.com/",
      alt: "CrazyPi logo",
    },
    {
      id: "fin-3",
      name: "Turner & Townsend",
      image: "/sponsors/financial3.png",
      url: "https://www.turnerandtownsend.com",
      alt: "Turner & Townsend logo",
    },
    {
      id: "fin-4",
      name: "Transaction Analysts",
      image: "/sponsors/financial4.png",
      url: "https://transactionanalysts.com",
      alt: "Transaction Analysts logo",
    },
  ],
};

export default function Sponsors() {
  const tech = sponsors.technical;
  const financial = sponsors.financial;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Sponsors"
          subtitle="We thank our partners for their support"
          centered
        />

        {/* Technical Sponsor */}
        <div className="py-12 bg-gray-50 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Technical Sponsor</h3>

          <div className="mx-auto w-full max-w-2xl">
            <a
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tech.alt || tech.name}
              className="block bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center">
                <Image
                  src={tech.image}
                  alt={tech.alt || tech.name}
                  width={260}
                  height={120}
                  className="max-w-full h-auto object-contain"
                />
              </div>
            </a>

            {tech.name || tech.description ? (
              <div className="py-6 text-center">
                {tech.name && (
                  <h4 className="text-xl font-semibold text-gray-900">{tech.name}</h4>
                )}
                {tech.description && (
                  <p className="py-2 text-gray-600 max-w-2xl mx-auto">{tech.description}</p>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Financial Sponsors */}
        <div className="py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Financial Sponsors</h3>

          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="flex flex-wrap items-center justify-center gap-6">
                {financial.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.alt || s.name}
                    className="inline-flex items-center justify-center bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow"
                    style={{ minWidth: 220 }}
                  >
                    <Image
                      src={s.image}
                      alt={s.alt || s.name}
                      width={260}
                      height={120}
                      className="max-w-full h-auto object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}