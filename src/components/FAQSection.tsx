// src/components/FAQSection.tsx
'use client';

import { useState } from 'react';
import { Plus, Minus, MessageCircle, Phone } from 'lucide-react';

// Data Pertanyaan sesuai desain Anda
const faqs = [
  {
    question: "How do I book a service on SmartHome?",
    answer: "You can simply choose the type of service you need on the homepage or order page, select your preferred schedule, and confirm your order. Our team will immediately assign the best verified technician for you."
  },
  {
    question: "Are all technicians verified?",
    answer: "Yes, absolutely. Every partner undergoes a strict background check, skills assessment, and interview process before joining SmartHome to ensure your safety and quality of service."
  },
  {
    question: "How does the payment system work?",
    answer: "We support various cashless payment methods (E-Wallet, Bank Transfer, Credit Card). Payment is secured in our system and only released to the partner once the job is completed satisfactorily."
  },
  {
    question: "Which areas does SmartHome cover?",
    answer: "Currently, we serve major cities in Indonesia including Jakarta, Bandung, Surabaya, and Bali. We are rapidly expanding to other regions soon."
  }
];

export default function FAQSection() {
  // State untuk melacak pertanyaan mana yang sedang terbuka
  // Default: index 0 (pertanyaan pertama terbuka)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-background text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* --- KOLOM KIRI: Judul & Tombol Kontak --- */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
              Frequently asked questions
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Cant find the answer you are looking for? Chat with our friendly team.
            </p>
            
            <div className="space-y-4">
              {/* Tombol Contact Support */}
              <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#2F2F2F] border border-white/5 hover:border-primary/50 transition-all duration-300 group text-left">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">Contact live chat support</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-300">We reply in seconds</div>
                </div>
              </button>

              {/* Tombol Call Admin */}
              <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#2F2F2F] border border-white/5 hover:border-primary/50 transition-all duration-300 group text-left">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="font-bold text-white">Call Admin</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-300">Mon-Fri, 9am - 5pm</div>
                </div>
              </button>
            </div>
          </div>

          {/* --- KOLOM KANAN: List Pertanyaan (Accordion) --- */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border-b border-white/10 pb-4 transition-all duration-300 ${openIndex === index ? 'pb-6' : ''}`}
                >
                  {/* Header Pertanyaan (Klik untuk toggle) */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-4 text-left focus:outline-none group"
                  >
                    <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {faq.question}
                    </span>
                    <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-gray-500'}`}>
                      {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>

                  {/* Body Jawaban (Animasi Buka/Tutup) */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}