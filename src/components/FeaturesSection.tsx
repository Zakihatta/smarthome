// src/components/FeaturesSection.tsx
import { Wrench, Sparkles, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Wrench size={32} />,
    title: "Repair Technicians",
    description: "AC, plumbing, electrical issues, and more — leave it to our verified and experienced experts.",
    color: "text-blue-400",
    bgGlow: "bg-blue-500/20"
  },
  {
    icon: <Sparkles size={32} />,
    title: "Home Cleaning",
    description: "Enjoy a spotless, sparkling home without the hassle. Offering daily, weekly, and deep-cleaning services.",
    color: "text-primary", // Kuning brand kita
    bgGlow: "bg-primary/20"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Guaranteed Security",
    description: "All our partners have undergone a strict verification process for your comfort and safety.",
    color: "text-green-400",
    bgGlow: "bg-green-500/20"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Modern Living, Supported by <span className="text-primary">Smart</span> Solutions
          </h2>
          <p className="text-gray-400 text-lg">
            Hundreds of professional technicians are ready to assist you.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-[#2F2F2F]/50 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Efek Glow saat Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl ${feature.bgGlow}`} />
              
              {/* Konten Kartu */}
              <div className="relative z-10 flex flex-col items-start text-left h-full">
                {/* Icon Wrapper */}
                <div className={`p-4 rounded-2xl bg-white/5 mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}