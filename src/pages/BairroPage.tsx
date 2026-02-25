import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Navigation, Landmark } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ProfileCard from "@/components/ProfileCard";
import { useProfiles } from "@/hooks/useProfiles";
import type { Profile } from "@/data/mockProfiles";

interface BairroConfig {
  slug: string;
  nome: string;
  nomeDisplay: string;
  title: string;
  h1: string;
  metaDescription: string;
  descricaoCurta: string;
  descricaoLonga: string;
  pontosDReferencia: string[];
  proximidades: string;
  filterFn: (p: Profile) => boolean;
  relatedBairros: { slug: string; nome: string }[];
}

export const bairrosConfig: Record<string, BairroConfig> = {
  "centro-macapa": {
    slug: "centro-macapa",
    nome: "Centro",
    nomeDisplay: "Centro de Macapá",
    title: "Acompanhantes no Centro de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes no Centro de Macapá – AP",
    metaDescription: "Encontre acompanhantes independentes no Centro de Macapá, AP. Fotos 100% reais, atendimento 24h, elite do Amapá. Contato direto via WhatsApp.",
    descricaoCurta: "O coração de Macapá com fácil acesso e discrição total",
    descricaoLonga: "O bairro Centro de Macapá é o coração da capital do Amapá, com fácil acesso por toda a cidade. Localizado próximo à Orla de Macapá, Praça da Bandeira e principais pontos comerciais, é a região mais procurada para encontros discretos e seguros.",
    pontosDReferencia: [
      "Orla de Macapá",
      "Praça da Bandeira",
      "Mercado Central",
      "Teatro da Paz",
      "Forte de São José",
    ],
    proximidades: "Próximo à Orla, Praça da Bandeira, Mercado Central e principais avenidas",
    filterFn: (p) => p.bairro === "Centro",
    relatedBairros: [
      { slug: "santa-rita-macapa", nome: "Santa Rita" },
      { slug: "marco-zero-macapa", nome: "Marco Zero" },
      { slug: "buritizal-macapa", nome: "Buritizal" },
    ],
  },
  "santa-rita-macapa": {
    slug: "santa-rita-macapa",
    nome: "Santa Rita",
    nomeDisplay: "Santa Rita, Macapá",
    title: "Acompanhantes em Santa Rita – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Santa Rita – Macapá, AP",
    metaDescription: "Acompanhantes independentes em Santa Rita, Macapá. Fotos reais, atendimento 24h, discrição garantida. Elite do Amapá no Gatinhas Club.",
    descricaoCurta: "Bairro residencial com fácil acesso e ambiente acolhedor",
    descricaoLonga: "Santa Rita é um bairro residencial tradicional de Macapá, localizado na Zona Sul, com fácil acesso ao Centro e pontos comerciais. Oferece um ambiente acolhedor e discreto para encontros privados.",
    pontosDReferencia: [
      "Avenida Getúlio Vargas",
      "Avenida Padre Júlio Maria",
      "Shopping Center",
      "Zona Sul",
    ],
    proximidades: "Zona Sul de Macapá, próximo ao Centro",
    filterFn: (p) => p.bairro === "Santa Rita",
    relatedBairros: [
      { slug: "centro-macapa", nome: "Centro" },
      { slug: "trem-macapa", nome: "Trem" },
      { slug: "buritizal-macapa", nome: "Buritizal" },
    ],
  },
  "buritizal-macapa": {
    slug: "buritizal-macapa",
    nome: "Buritizal",
    nomeDisplay: "Buritizal, Macapá",
    title: "Acompanhantes em Buritizal – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Buritizal – Macapá, AP",
    metaDescription: "Encontre acompanhantes em Buritizal, Macapá. Fotos 100% reais, atendimento 24h, massagem e acompanhantes de luxo. Discrição total.",
    descricaoCurta: "Bairro tranquilo e seguro para encontros privados",
    descricaoLonga: "Buritizal é um bairro tranquilo localizado na Zona Sul de Macapá, oferecendo um ambiente seguro e discreto para encontros privados. Próximo a comércios e com fácil acesso às principais avenidas.",
    pontosDReferencia: [
      "Avenida Equatorial",
      "Avenida Castelo Branco",
      "Zona Sul",
      "Bairros vizinhos",
    ],
    proximidades: "Zona Sul de Macapá, próximo a Santa Rita e Trem",
    filterFn: (p) => p.bairro === "Buritizal",
    relatedBairros: [
      { slug: "santa-rita-macapa", nome: "Santa Rita" },
      { slug: "trem-macapa", nome: "Trem" },
      { slug: "congos-macapa", nome: "Congós" },
    ],
  },
  "trem-macapa": {
    slug: "trem-macapa",
    nome: "Trem",
    nomeDisplay: "Trem, Macapá",
    title: "Acompanhantes no Trem – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes no Trem – Macapá, AP",
    metaDescription: "Acompanhantes independentes no bairro Trem, Macapá. Fotos reais, elite do Amapá, atendimento 24h. Contato direto via WhatsApp.",
    descricaoCurta: "Bairro popular com excelente localização",
    descricaoLonga: "O bairro Trem é uma região popular de Macapá localizada na Zona Sul, com excelente localização e fácil acesso. Oferece um ambiente acessível para encontros discretos.",
    pontosDReferencia: [
      "Avenida Padre Júlio Maria",
      "Avenida Equatorial",
      "Zona Sul",
    ],
    proximidades: "Zona Sul, próximo a Santa Rita e Buritizal",
    filterFn: (p) => p.bairro === "Trem",
    relatedBairros: [
      { slug: "buritizal-macapa", nome: "Buritizal" },
      { slug: "santa-rita-macapa", nome: "Santa Rita" },
      { slug: "congos-macapa", nome: "Congós" },
    ],
  },
  "marco-zero-macapa": {
    slug: "marco-zero-macapa",
    nome: "Marco Zero",
    nomeDisplay: "Marco Zero, Macapá",
    title: "Acompanhantes em Marco Zero – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Marco Zero – Macapá, AP",
    metaDescription: "Encontre acompanhantes em Marco Zero, Macapá. Fotos 100% reais, atendimento 24h, acompanhantes de luxo. Elite do Amapá.",
    descricaoCurta: "Região turística e sofisticada de Macapá",
    descricaoLonga: "Marco Zero é uma região turística e sofisticada de Macapá, localizada próximo à Orla. Oferece um ambiente elegante e exclusivo para encontros de alto padrão.",
    pontosDReferencia: [
      "Orla de Macapá",
      "Monumento Marco Zero",
      "Praça Cívica",
      "Zona Centro",
    ],
    proximidades: "Orla de Macapá, Centro, pontos turísticos",
    filterFn: (p) => p.bairro === "Marco Zero",
    relatedBairros: [
      { slug: "centro-macapa", nome: "Centro" },
      { slug: "jardim-equatorial-macapa", nome: "Jardim Equatorial" },
    ],
  },
  "jardim-equatorial-macapa": {
    slug: "jardim-equatorial-macapa",
    nome: "Jardim Equatorial",
    nomeDisplay: "Jardim Equatorial, Macapá",
    title: "Acompanhantes em Jardim Equatorial – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Jardim Equatorial – Macapá, AP",
    metaDescription: "Acompanhantes de luxo em Jardim Equatorial, Macapá. Fotos reais, elite do Amapá, atendimento 24h. Discrição e segurança.",
    descricaoCurta: "Bairro nobre com ambiente exclusivo e sofisticado",
    descricaoLonga: "Jardim Equatorial é um bairro nobre de Macapá localizado na Zona Norte, com ambiente exclusivo e sofisticado. Ideal para encontros de alto padrão e acompanhantes de luxo.",
    pontosDReferencia: [
      "Avenida Equatorial",
      "Zona Norte",
      "Comércios selecionados",
    ],
    proximidades: "Zona Norte de Macapá, próximo a Novo Horizonte",
    filterFn: (p) => p.bairro === "Jardim Equatorial",
    relatedBairros: [
      { slug: "novo-horizonte-macapa", nome: "Novo Horizonte" },
      { slug: "marco-zero-macapa", nome: "Marco Zero" },
    ],
  },
  "congos-macapa": {
    slug: "congos-macapa",
    nome: "Congós",
    nomeDisplay: "Congós, Macapá",
    title: "Acompanhantes em Congós – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Congós – Macapá, AP",
    metaDescription: "Encontre acompanhantes em Congós, Macapá. Fotos 100% reais, atendimento 24h, independentes verificadas. Elite do Amapá.",
    descricaoCurta: "Bairro residencial com ótima localização",
    descricaoLonga: "Congós é um bairro residencial de Macapá localizado na Zona Sul, com ótima localização e fácil acesso. Oferece um ambiente seguro e discreto.",
    pontosDReferencia: [
      "Avenida Equatorial",
      "Zona Sul",
      "Comércios locais",
    ],
    proximidades: "Zona Sul, próximo a Trem e Buritizal",
    filterFn: (p) => p.bairro === "Congós",
    relatedBairros: [
      { slug: "trem-macapa", nome: "Trem" },
      { slug: "buritizal-macapa", nome: "Buritizal" },
      { slug: "laguinho-macapa", nome: "Laguinho" },
    ],
  },
  "novo-horizonte-macapa": {
    slug: "novo-horizonte-macapa",
    nome: "Novo Horizonte",
    nomeDisplay: "Novo Horizonte, Macapá",
    title: "Acompanhantes em Novo Horizonte – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Novo Horizonte – Macapá, AP",
    metaDescription: "Acompanhantes em Novo Horizonte, Macapá. Fotos reais, atendimento 24h, elite do Amapá. Discrição total.",
    descricaoCurta: "Bairro moderno da Zona Norte de Macapá",
    descricaoLonga: "Novo Horizonte é um bairro moderno localizado na Zona Norte de Macapá, com infraestrutura completa e ambiente seguro para encontros privados.",
    pontosDReferencia: [
      "Avenida Equatorial",
      "Zona Norte",
      "Infraestrutura moderna",
    ],
    proximidades: "Zona Norte, próximo a Jardim Equatorial",
    filterFn: (p) => p.bairro === "Novo Horizonte",
    relatedBairros: [
      { slug: "jardim-equatorial-macapa", nome: "Jardim Equatorial" },
      { slug: "pacoval-macapa", nome: "Pacoval" },
    ],
  },
};

const BairroPage = () => {
  const { bairro } = useParams();
  const config = bairro ? bairrosConfig[bairro] : null;

  const { data: allProfiles = [], isLoading } = useProfiles();

  const profiles = useMemo(() => {
    if (!config) return [];
    return allProfiles.filter(config.filterFn);
  }, [allProfiles, config]);

  if (!config) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Bairro não encontrado</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  const bairroSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Acompanhantes em ${config.nomeDisplay}`,
    description: config.descricaoLonga,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Macapá",
      addressRegion: "AP",
      addressCountry: "BR",
    },
    areaServed: {
      "@type": "City",
      name: config.nomeDisplay,
    },
  };

  return (
    <Layout>
      <SEOHead
        title={config.title}
        description={config.metaDescription}
        canonical={`/acompanhantes/${config.slug}`}
        keywords={`acompanhantes ${config.nome}, ${config.nome} macapa, classificados adultos, acompanhantes macapa`}
        schema={bairroSchema}
        ogImageAlt={config.h1}
      />

      {/* Hero */}
      <section className="gradient-hero py-12 sm:py-16">
        <div className="container">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 flex-shrink-0 text-primary-foreground" size={24} />
            <div>
              <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
                {config.h1}
              </h1>
              <p className="mt-2 text-sm text-primary-foreground/80">
                {config.descricaoCurta}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="border-b border-border bg-secondary/30 py-8">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pontos de Referência */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Landmark size={18} className="text-primary" />
                Pontos de Referência
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {config.pontosDReferencia.map((ponto, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {ponto}
                  </li>
                ))}
              </ul>
            </div>

            {/* Proximidades */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Navigation size={18} className="text-primary" />
                Localização
              </h3>
              <p className="text-sm text-muted-foreground">{config.proximidades}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Descrição */}
      <section className="container py-8">
        <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
          <p>{config.descricaoLonga}</p>
          <p>
            No <strong>Gatinhas Club</strong>, você encontra as melhores acompanhantes independentes em{" "}
            <strong>{config.nomeDisplay}</strong>. Todos os anúncios são verificados, com fotos 100% reais,
            atendimento 24h e discrição total. Contato direto via WhatsApp.
          </p>
        </div>
      </section>

      {/* Perfis */}
      <section className="container py-8 sm:py-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-foreground">
          Acompanhantes em {config.nomeDisplay}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {profiles.map((p, i) => (
              <ProfileCard key={p.id} profile={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum perfil disponível em {config.nomeDisplay} no momento.{" "}
              <Link to="/" className="text-primary hover:underline">
                Ver todos os anúncios
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Bairros Relacionados */}
      <section className="border-t border-border bg-secondary/30 py-8">
        <div className="container">
          <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
            Explore Outros Bairros de Macapá
          </h3>
          <div className="flex flex-wrap gap-2">
            {config.relatedBairros.map((b) => (
              <Link
                key={b.slug}
                to={`/acompanhantes/${b.slug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                {b.nome}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BairroPage;
