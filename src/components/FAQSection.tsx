"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  pergunta: string;
  resposta: string;
}

interface FAQSectionProps {
  titulo?: string;
  perguntas: FAQItem[];
}

const FAQSection = ({
  titulo = "Perguntas Frequentes",
  perguntas,
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Schema Markup para FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  };

  return (
    <>
      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">
            {titulo}
          </h2>

          <div className="space-y-3">
            {perguntas.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-200"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="font-semibold text-foreground">
                    {item.pergunta}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-primary transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                        {item.resposta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-border/50 bg-primary/5 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda tem dúvidas? Entre em contato conosco via WhatsApp para mais informações.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
