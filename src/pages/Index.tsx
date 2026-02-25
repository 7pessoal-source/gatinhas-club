import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Shield, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ProfileCard from "@/components/ProfileCard";
import SearchFilters from "@/components/SearchFilters";
import { mockProfiles } from "@/data/mockProfiles";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gatinhas Club – Acompanhantes em Macapá AP",
  url: "https://gatinhasclub.com.br",
  description: "Classificados adultos independentes em Macapá – AP. Acompanhantes, garotas de programa e massagistas.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gatinhasclub.com.br/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const seoCategories = [
  { to: "/acompanhantes-macapa", label: "Acompanhantes Macapá" },
  { to: "/garotas-de-programa-macapa", label: "Garotas de Programa" },
  { to: "/acompanhantes-macapa-ap", label: "Acompanhante Macapá AP" },
  { to: "/acompanhantes-centro-macapa", label: "Centro de Macapá" },
  { to: "/acompanhantes-zona-norte-macapa", label: "Zona Norte" },
  { to: "/acompanhantes-zona-sul-macapa", label: "Zona Sul" },
  { to: "/acompanhantes-luxo-macapa", label: "Acompanhantes Luxo" },
  { to: "/massagem-macapa", label: "Massagem" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBairro, setSelectedBairro] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [idadeRange, setIdadeRange] = useState<[number, number]>([18, 50]);

  const filteredProfiles = useMemo(() => {
    return mockProfiles.filter((p) => {
      if (searchQuery && !p.nome.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedBairro && p.bairro !== selectedBairro) return false;
      if (selectedCategoria && p.categoria !== selectedCategoria) return false;
      if (p.idade < idadeRange[0] || p.idade > idadeRange[1]) return false;
      return true;
    });
  }, [searchQuery, selectedBairro, selectedCategoria, idadeRange]);

  const destaques = filteredProfiles.filter((p) => p.destaque);
  const regulares = filteredProfiles.filter((p) => !p.destaque);

  return (
    <Layout>
      <SEOHead
        title="Acompanhantes em Macapá AP – Classificados Adultos"
        description="Gatinhas Club – Plataforma de acompanhantes, garotas de programa e massagistas independentes em Macapá, AP. Perfis verificados, fotos reais, contato direto. Apenas para maiores de 18 anos."
        canonical="/"
        schema={homeSchema}
      />

      {/* Hero */}
      <section className="gradient-hero py-16 sm:py-24">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl"
          >
            Gatinhas Club
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/70 sm:text-base"
          >
            Acompanhantes e garotas de programa em Macapá – AP.{" "}
            Classificados adultos independentes, seguros e discretos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/anunciar"
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
            <span className="flex items-center gap-1.5 text-xs">
              <Shield size={14} /> Anúncios verificados
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <MapPin size={14} /> Exclusivo Macapá – AP
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <Sparkles size={14} /> +18 apenas
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <Star size={14} /> 100% independentes
            </span>
          </motion.div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2">
            {seoCategories.map((cat) => (
              <Link
                key={cat.to}
                to={cat.to}
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
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nenhum perfil encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </section>

      {/* SEO text block */}
      <section className="bg-secondary/30 border-t border-border">
        <div className="container py-10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Classificados Adultos em Macapá – AP
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              O <strong>Gatinhas Club</strong> é a principal plataforma de{" "}
              <Link to="/acompanhantes-macapa" className="text-primary hover:underline font-medium">
                acompanhantes em Macapá
              </Link>{" "}
              e{" "}
              <Link to="/garotas-de-programa-macapa" className="text-primary hover:underline font-medium">
                garotas de programa em Macapá
              </Link>
              , capital do estado do Amapá (AP). Nossa plataforma reúne anunciantes independentes
              de toda a cidade, dos bairros centrais às zonas norte e sul.
            </p>
            <p>
              Encontre{" "}
              <Link to="/acompanhantes-centro-macapa" className="text-primary hover:underline">
                acompanhantes no Centro de Macapá
              </Link>
              ,{" "}
              <Link to="/acompanhantes-zona-norte-macapa" className="text-primary hover:underline">
                acompanhantes na Zona Norte de Macapá
              </Link>{" "}
              (Novo Horizonte, Jardim Equatorial, Pacoval, Zerão),{" "}
              <Link to="/acompanhantes-zona-sul-macapa" className="text-primary hover:underline">
                acompanhantes na Zona Sul de Macapá
              </Link>{" "}
              (Congós, Laguinho, Trem, Beirol) e{" "}
              <Link to="/massagem-macapa" className="text-primary hover:underline">
                massagem em Macapá
              </Link>
              . Todos os anúncios são de responsabilidade exclusiva das anunciantes,
              maiores de 18 anos.
            </p>
            <p>
              Quer anunciar? Conheça nossos{" "}
              <Link to="/anunciar" className="text-primary hover:underline font-medium">
                planos de anúncio
              </Link>{" "}
              e comece a receber contatos hoje mesmo. Dúvidas sobre privacidade? Consulte nossa{" "}
              <Link to="/privacidade" className="text-primary hover:underline">
                política de privacidade
              </Link>{" "}
              e nossos{" "}
              <Link to="/termos" className="text-primary hover:underline">
                termos de uso
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
