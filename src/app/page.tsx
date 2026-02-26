"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Shield, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ProfileCard from "@/components/ProfileCard";
import SearchFilters from "@/components/SearchFilters";
import FAQSection from "@/components/FAQSection";
import { useProfiles } from "@/hooks/useProfiles";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gatinhas Club – Acompanhantes em Macapá AP",
  url: "https://www.gatinhasclub.site",
  description: "Classificados adultos independentes em Macapá – AP. Acompanhantes, garotas de programa e massagistas.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.gatinhasclub.site/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const seoCategories = [
  { href: "/acompanhantes-macapa", label: "Acompanhantes Macapá" },
  { href: "/garotas-de-programa-macapa", label: "Garotas de Programa" },
  { href: "/acompanhantes-macapa-ap", label: "Acompanhante Macapá AP" },
  { href: "/acompanhantes-centro-macapa", label: "Centro de Macapá" },
  { href: "/acompanhantes-zona-norte-macapa", label: "Zona Norte" },
  { href: "/acompanhantes-zona-sul-macapa", label: "Zona Sul" },
  { href: "/acompanhantes-luxo-macapa", label: "Acompanhantes Luxo" },
  { href: "/massagem-macapa", label: "Massagem" },
];

const faqItems = [
  {
    pergunta: "Como encontro acompanhantes em Macapá no Gatinhas Club?",
    resposta: "Use os filtros de busca para encontrar acompanhantes por bairro, categoria ou idade. Todos os perfis no Gatinhas Club são verificados com fotos 100% reais. Você pode entrar em contato direto via WhatsApp com a acompanhante de sua escolha.",
  },
  {
    pergunta: "As fotos das acompanhantes são reais?",
    resposta: "Sim! No Gatinhas Club, todas as fotos são 100% reais. Verificamos cada anúncio para garantir autenticidade e segurança. Discrição e confiança são nossas prioridades.",
  },
  {
    pergunta: "Qual é o horário de atendimento?",
    resposta: "As acompanhantes no Gatinhas Club oferecem atendimento 24h em Macapá. Você pode entrar em contato via WhatsApp a qualquer hora para agendar seu encontro.",
  },
  {
    pergunta: "Como faço para anunciar meus serviços?",
    resposta: "Clique em 'Anunciar' no menu principal e preencha o formulário de cadastro. Nosso processo é simples, rápido e seguro. Você terá seu perfil ativo em poucos minutos.",
  },
  {
    pergunta: "O Gatinhas Club é seguro?",
    resposta: "Sim! O Gatinhas Club é uma plataforma segura e discreta. Todos os anúncios são verificados, e não intermediamos serviços. Você entra em contato direto com a acompanhante via WhatsApp.",
  },
  {
    pergunta: "Há acompanhantes de luxo disponíveis?",
    resposta: "Sim! Temos uma seleção de acompanhantes de luxo em Macapá. Use o filtro de categoria para encontrar perfis premium com serviços exclusivos.",
  },
  {
    pergunta: "Como funciona o contato com as acompanhantes?",
    resposta: "Cada perfil possui um número de WhatsApp direto. Clique no perfil da acompanhante e entre em contato via WhatsApp para negociar valores e agendar seu encontro.",
  },
  {
    pergunta: "Posso filtrar por bairro?",
    resposta: "Sim! O Gatinhas Club oferece filtros por bairro, categoria, idade e muito mais. Encontre acompanhantes no Centro, Santa Rita, Buritizal, Trem, Jardim Equatorial e outros bairros de Macapá.",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBairro, setSelectedBairro] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [idadeRange, setIdadeRange] = useState<[number, number]>([18, 50]);

  const { data: profiles = [], isLoading } = useProfiles();

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (searchQuery && !p.nome.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedBairro && p.bairro !== selectedBairro) return false;
      if (selectedCategoria && p.categoria !== selectedCategoria) return false;
      if (p.idade < idadeRange[0] || p.idade > idadeRange[1]) return false;
      return true;
    });
  }, [profiles, searchQuery, selectedBairro, selectedCategoria, idadeRange]);

  const destaques = filteredProfiles.filter((p) => p.destaque);
  const regulares = filteredProfiles.filter((p) => !p.destaque);

  return (
    <Layout>
      <SEOHead
        title="Acompanhantes em Macapá - Gatinhas Club"
        description="Gatinhas Club – Acompanhantes em Macapá com fotos 100% reais, atendimento 24h. Elite do Amapá. Perfis verificados, contato direto via WhatsApp. Apenas +18."
        canonical="/"
        keywords="acompanhantes macapá, garotas de programa macapá, massagem macapá, acompanhantes ap, classificados adultos"
        schema={homeSchema}
        ogImageAlt="Gatinhas Club - Acompanhantes independentes em Macapá, AP"
      />

      {/* Hero */}
      <section className="gradient-hero py-16 sm:py-24">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl"
          >
            Acompanhantes em Macapá - Gatinhas Club
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/70 sm:text-base"
          >
            Fotos 100% Reais • Atendimento 24h em Macapá • Elite do Amapá • Discrição Total
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/cadastro-gp"
              className="rounded-xl gradient-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow"
            >
              Anunciar Agora
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-primary-foreground/50"
          >
            <span className="flex items-center gap-1.5 text-xs"><Shield size={14} /> Anúncios verificados</span>
            <span className="flex items-center gap-1.5 text-xs"><MapPin size={14} /> Exclusivo Macapá – AP</span>
            <span className="flex items-center gap-1.5 text-xs"><Sparkles size={14} /> +18 apenas</span>
            <span className="flex items-center gap-1.5 text-xs"><Star size={14} /> 100% independentes</span>
          </motion.div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2">
            {seoCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Profiles */}
      <section className="container py-8 sm:py-12">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBairro={selectedBairro}
          onBairroChange={setSelectedBairro}
          selectedCategoria={selectedCategoria}
          onCategoriaChange={setSelectedCategoria}
          idadeRange={idadeRange}
          onIdadeChange={setIdadeRange}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Destaques */}
            {destaques.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
                  <Sparkles size={18} className="text-primary" />
                  Perfis em Destaque em Macapá
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {destaques.map((p, i) => (
                    <ProfileCard key={p.id} profile={p} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Todos */}
            <div className="mt-8">
              <h2 className="mb-4 font-display text-xl font-bold text-foreground">
                {selectedBairro || selectedCategoria
                  ? "Resultados da Busca"
                  : "Todos os Anúncios em Macapá – AP"}
              </h2>
              {regulares.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {regulares.map((p, i) => (
                    <ProfileCard key={p.id} profile={p} index={i + destaques.length} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    {profiles.length === 0
                      ? "Nenhum anúncio publicado ainda."
                      : "Nenhum perfil encontrado com os filtros selecionados."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* FAQ Section */}
      <FAQSection
        titulo="Perguntas Frequentes sobre Acompanhantes em Macapá"
        perguntas={faqItems}
      />

      {/* SEO text block */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-10">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
            Classificados Adultos em Macapá – AP
          </h2>
          <div className="prose prose-sm max-w-none space-y-3 text-muted-foreground">
            <p>
              O <strong>Gatinhas Club</strong> é a principal plataforma de{" "}
              <Link href="/acompanhantes-macapa" className="font-medium text-primary hover:underline">acompanhantes em Macapá</Link>{" "}
              e{" "}
              <Link href="/garotas-de-programa-macapa" className="font-medium text-primary hover:underline">garotas de programa em Macapá</Link>,
              capital do estado do Amapá (AP).
            </p>
            <p>
              Encontre{" "}
              <Link href="/acompanhantes-centro-macapa" className="text-primary hover:underline">acompanhantes no Centro de Macapá</Link>,{" "}
              <Link href="/acompanhantes-zona-norte-macapa" className="text-primary hover:underline">acompanhantes na Zona Norte</Link>,{" "}
              <Link href="/acompanhantes-zona-sul-macapa" className="text-primary hover:underline">acompanhantes na Zona Sul</Link>{" "}
              e <Link href="/massagem-macapa" className="text-primary hover:underline">massagem em Macapá</Link>.
              Todos os anúncios são de responsabilidade exclusiva das anunciantes, maiores de 18 anos.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
