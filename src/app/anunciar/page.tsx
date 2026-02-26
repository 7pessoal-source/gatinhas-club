import { Link } from "next/link";
import { Check, Sparkles, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const plans = [
  {
    name: "Básico",
    price: "Grátis",
    icon: Star,
    features: ["1 foto no perfil", "Anúncio por 7 dias", "Contato via WhatsApp", "Listagem padrão"],
    highlight: false,
  },
  {
    name: "Destaque",
    price: "R$ 49/mês",
    icon: Sparkles,
    features: [
      "Até 5 fotos",
      "Badge 'Destaque'",
      "Prioridade no grid",
      "Contato via WhatsApp",
      "Anúncio por 30 dias",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$ 99/mês",
    icon: Crown,
    features: [
      "Até 10 fotos",
      "Badge 'Premium'",
      "Topo do grid sempre",
      "Verificação prioritária",
      "Contato via WhatsApp",
      "Anúncio por 30 dias",
      "Destaque em SEO",
    ],
    highlight: false,
  },
];

const AnunciarPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Anunciar – Publique seu Anúncio"
        description="Anuncie no Gatinhas Club, a plataforma de classificados adultos em Macapá – AP. Planos a partir de grátis. Anúncios independentes e seguros."
        canonical="/anunciar"
      />

      <section className="gradient-hero py-12 sm:py-16">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Anuncie no Gatinhas Club
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/70">
            Escolha seu plano e comece a receber contatos em Macapá – AP. 
            Plataforma segura e discreta para anunciantes maiores de 18 anos.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                plan.highlight
                  ? "border-primary shadow-glow bg-card"
                  : "border-border bg-card shadow-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute right-0 top-0 rounded-bl-xl gradient-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                  Popular
                </div>
              )}
              <plan.icon size={28} className="text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold text-foreground">{plan.price}</p>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "gradient-primary text-primary-foreground hover:shadow-glow"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                Escolher {plan.name}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          O Gatinhas Club é uma plataforma de classificados. Não intermediamos serviços. 
          Todos os anunciantes devem ter 18 anos ou mais.
        </p>
      </section>
    </Layout>
  );
};

export default AnunciarPage;

