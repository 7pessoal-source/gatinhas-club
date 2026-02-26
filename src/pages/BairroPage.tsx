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
    metaDescription: "Encontre acompanhantes independentes no Centro de Macapá, AP. Próximo à Fortaleza de São José e Orla. Fotos 100% reais, elite do Amapá.",
    descricaoCurta: "O coração de Macapá com fácil acesso e discrição total",
    descricaoLonga: "O bairro Centro de Macapá é o ponto de encontro mais estratégico da capital. Localizado próximo à histórica Fortaleza de São José de Macapá e ao Parque do Forte, é a região ideal para quem busca discrição perto dos grandes hotéis e centros comerciais. A Orla de Macapá e o Trapiche Eliezer Levy oferecem um cenário perfeito para quem frequenta a área. Com fácil acesso pela Praça Floriano Peixoto e proximidade ao Teatro das Bacabeiras, o Centro concentra as melhores acompanhantes de luxo e independentes para um atendimento rápido e exclusivo.",
    pontosDReferencia: ["Fortaleza de São José", "Parque do Forte", "Trapiche Eliezer Levy", "Orla de Macapá", "Teatro das Bacabeiras"],
    proximidades: "Próximo à Orla, Praça da Bandeira e principais hotéis",
    filterFn: (p) => p.bairro === "Centro",
    relatedBairros: [
      { slug: "trem-macapa", nome: "Trem" },
      { slug: "santa-rita-macapa", nome: "Santa Rita" },
      { slug: "pacoval-macapa", nome: "Pacoval" },
    ],
  },
  "buritizal-macapa": {
    slug: "buritizal-macapa",
    nome: "Buritizal",
    nomeDisplay: "Buritizal, Macapá",
    title: "Acompanhantes em Buritizal – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Buritizal – Macapá, AP",
    metaDescription: "Acompanhantes independentes no Buritizal, Macapá. Próximo à Avenida 13 de Setembro. Fotos reais, atendimento 24h na Zona Sul.",
    descricaoCurta: "Zona Sul - Alta densidade e movimento",
    descricaoLonga: "O Buritizal é um dos bairros mais populosos e vibrantes da Zona Sul de Macapá. Com eixo principal na Avenida 13 de Setembro, o bairro é conhecido pela sua movimentação intensa e facilidade de acesso. Próximo à Praça do Buritizal, ao Supermercado Fortaleza e ao SESI, é uma localização excelente para encontros rápidos e discretos. Se você busca acompanhantes que atendem na região sul, o Buritizal oferece diversas opções de garotas de programa independentes e massagistas em uma área de fácil localização.",
    pontosDReferencia: ["Avenida 13 de Setembro", "Praça do Buritizal", "Supermercado Fortaleza", "SESI"],
    proximidades: "Zona Sul, próximo ao Trem e Congós",
    filterFn: (p) => p.bairro === "Buritizal",
    relatedBairros: [
      { slug: "trem-macapa", nome: "Trem" },
      { slug: "zerao-macapa", nome: "Zerão" },
      { slug: "santa-rita-macapa", nome: "Santa Rita" },
    ],
  },
  "trem-macapa": {
    slug: "trem-macapa",
    nome: "Trem",
    nomeDisplay: "Trem, Macapá",
    title: "Acompanhantes no Trem – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes no Trem – Macapá, AP",
    metaDescription: "Acompanhantes no bairro Trem, Macapá. Próximo ao Estádio Glicério Marques e FAB. Elite e discrição na área nobre.",
    descricaoCurta: "Tradicional e Nobre - Área central e tranquila",
    descricaoLonga: "O bairro Trem é uma das áreas mais tradicionais e nobres de Macapá. Situado estrategicamente próximo ao Centro, destaca-se por marcos como o Estádio Glicério Marques e a movimentada Avenida Feliciano Coelho. Sua proximidade com a FAB (Força Aérea Brasileira) garante uma sensação de segurança e organização. É um bairro com ruas mais tranquilas e residenciais de alto padrão, ideal para quem busca acompanhantes de elite em Macapá com total privacidade e sem o barulho excessivo das zonas comerciais.",
    pontosDReferencia: ["Estádio Glicério Marques", "Avenida Feliciano Coelho", "FAB"],
    proximidades: "Área central, próximo ao Centro e Buritizal",
    filterFn: (p) => p.bairro === "Trem",
    relatedBairros: [
      { slug: "centro-macapa", nome: "Centro" },
      { slug: "buritizal-macapa", nome: "Buritizal" },
      { slug: "santa-rita-macapa", nome: "Santa Rita" },
    ],
  },
  "zerao-macapa": {
    slug: "zerao-macapa",
    nome: "Zerão",
    nomeDisplay: "Zerão, Macapá",
    title: "Acompanhantes no Zerão – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes no Zerão – Macapá, AP",
    metaDescription: "Encontre acompanhantes no Zerão, Macapá. Próximo ao Marco Zero e Unifap. Onde o Equador divide a diversão.",
    descricaoCurta: "Onde o Equador divide - Zona Sul universitária",
    descricaoLonga: "O bairro Zerão é mundialmente famoso por abrigar o Monumento Marco Zero e o Estádio Milton de Souza Corrêa (Estádio Zerão), onde a linha do Equador divide o campo de jogo. Localizado na Zona Sul, o bairro tem um perfil dinâmico devido à proximidade com a Unifap (Universidade Federal do Amapá). É um local que atrai muitos turistas e o público universitário, tornando-se um ponto estratégico para encontrar acompanhantes independentes que buscam um ambiente moderno e de fácil referência geográfica.",
    pontosDReferencia: ["Monumento Marco Zero", "Estádio Zerão", "Unifap"],
    proximidades: "Zona Sul, próximo ao Buritizal e Jardim Equatorial",
    filterFn: (p) => p.bairro === "Zerão",
    relatedBairros: [
      { slug: "buritizal-macapa", nome: "Buritizal" },
      { slug: "jardim-equatorial-macapa", nome: "Jardim Equatorial" },
    ],
  },
  "pacoval-macapa": {
    slug: "pacoval-macapa",
    nome: "Pacoval",
    nomeDisplay: "Pacoval, Macapá",
    title: "Acompanhantes no Pacoval – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes no Pacoval – Macapá, AP",
    metaDescription: "Garotas de programa no Pacoval, Macapá. Próximo à Ponte Sérgio Arruda e Mercado Central. Entrada da cidade.",
    descricaoCurta: "Entrada da Cidade - Estratégico e Comercial",
    descricaoLonga: "O Pacoval funciona como a porta de entrada para quem chega ou sai do centro de Macapá em direção à Zona Norte. Com a icônica Ponte Sérgio Arruda como principal via de conexão, o bairro possui um forte comércio local e está muito próximo ao Mercado Central. É um bairro de passagem estratégica, ideal para encontros discretos de quem está em trânsito pela cidade. Encontre acompanhantes no Pacoval que oferecem praticidade e localização privilegiada para quem não quer se deslocar para os extremos da capital.",
    pontosDReferencia: ["Ponte Sérgio Arruda", "Mercado Central", "Saída Zona Norte"],
    proximidades: "Próximo ao Centro e Jardim Felicidade",
    filterFn: (p) => p.bairro === "Pacoval",
    relatedBairros: [
      { slug: "centro-macapa", nome: "Centro" },
      { slug: "jardim-felicidade-macapa", nome: "Jardim Felicidade" },
    ],
  },
  "jardim-felicidade-macapa": {
    slug: "jardim-felicidade-macapa",
    nome: "Jardim Felicidade",
    nomeDisplay: "Jardim Felicidade, Macapá",
    title: "Acompanhantes no Jardim Felicidade – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes no Jardim Felicidade – Macapá, AP",
    metaDescription: "Acompanhantes na Zona Norte, Jardim Felicidade I e II. Próximo à BR-156 e Bioparque. A maior força da Zona Norte.",
    descricaoCurta: "Gigante da Zona Norte - Polo comercial e residencial",
    descricaoLonga: "O Jardim Felicidade (I e II) é o coração pulsante da Zona Norte de Macapá. Cortado pela Rodovia BR-156, o bairro é um verdadeiro gigante residencial e comercial. Próximo ao Bioparque da Amazônia e com sua própria praça central movimentada, o Jardim Felicidade é indispensável para quem busca serviços na região norte sem precisar ir ao centro. As acompanhantes no Jardim Felicidade atendem a uma vasta clientela local, oferecendo discrição e a conveniência de estar em um dos bairros mais completos de Macapá.",
    pontosDReferencia: ["Rodovia BR-156", "Praça do Jardim Felicidade", "Bioparque da Amazônia"],
    proximidades: "Zona Norte, principal polo da região",
    filterFn: (p) => p.bairro === "Jardim Felicidade",
    relatedBairros: [
      { slug: "novo-horizonte-macapa", nome: "Novo Horizonte" },
      { slug: "pacoval-macapa", nome: "Pacoval" },
    ],
  },
  "perpetuo-socorro-macapa": {
    slug: "perpetuo-socorro-macapa",
    nome: "Perpétuo Socorro",
    nomeDisplay: "Perpétuo Socorro, Macapá",
    title: "Acompanhantes no Perpétuo Socorro – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes no Perpétuo Socorro – Macapá, AP",
    metaDescription: "Acompanhantes na Orla Norte, Perpétuo Socorro. Próximo ao Rio Amazonas e área portuária de Macapá.",
    descricaoCurta: "Orla Norte - Movimento náutico e brisa do Amazonas",
    descricaoLonga: "O bairro Perpétuo Socorro compõe a charmosa Orla Norte de Macapá. Caracterizado pela proximidade com o Rio Amazonas e a área portuária, é uma região de intenso movimento náutico e feiras tradicionais. Encontrar acompanhantes no Perpétuo Socorro é ideal para quem aprecia a vista do rio e busca um ambiente com a identidade marcante da capital amapaense. A região é bem servida de acessos e oferece opções de garotas de programa independentes que atendem com exclusividade nesta parte da cidade.",
    pontosDReferencia: ["Área Portuária", "Rio Amazonas", "Feiras Locais"],
    proximidades: "Orla Norte, próximo ao Pacoval",
    filterFn: (p) => p.bairro === "Perpétuo Socorro",
    relatedBairros: [
      { slug: "pacoval-macapa", nome: "Pacoval" },
      { slug: "centro-macapa", nome: "Centro" },
    ],
  },
  "santa-rita-macapa": {
    slug: "santa-rita-macapa",
    nome: "Santa Rita",
    nomeDisplay: "Santa Rita, Macapá",
    title: "Acompanhantes em Santa Rita – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Santa Rita – Macapá, AP",
    metaDescription: "Acompanhantes em Santa Rita, Macapá. Próximo à Avenida Mendonça Furtado e HCAL. Misto comercial e residencial.",
    descricaoCurta: "Misto Comercial/Residencial - Tradição e Saúde",
    descricaoLonga: "Santa Rita é um bairro que equilibra perfeitamente o residencial com o comercial. Cortado pela importante Avenida Mendonça Furtado e abrigando o Hospital de Clínicas Alberto Lima (HCAL), é uma área de grande fluxo diário. Sua localização privilegiada, próxima a escolas tradicionais e centros médicos, torna-o um local discreto para encontros. As acompanhantes em Santa Rita são conhecidas pela sofisticação, atendendo em um bairro que é sinônimo de tradição e fácil localização em Macapá.",
    pontosDReferencia: ["Avenida Mendonça Furtado", "HCAL", "Escolas Tradicionais"],
    proximidades: "Próximo ao Centro e Alvorada",
    filterFn: (p) => p.bairro === "Santa Rita",
    relatedBairros: [
      { slug: "centro-macapa", nome: "Centro" },
      { slug: "alvorada-macapa", nome: "Alvorada" },
    ],
  },
  "novo-horizonte-macapa": {
    slug: "novo-horizonte-macapa",
    nome: "Novo Horizonte",
    nomeDisplay: "Novo Horizonte, Macapá",
    title: "Acompanhantes em Novo Horizonte – Macapá AP | Gatinhas Club",
    h1: "Acompanhantes em Novo Horizonte – Macapá, AP",
    metaDescription: "Garotas de programa no Novo Horizonte, Zona Norte. Próximo ao Parque de Exposições da Fazendinha.",
    descricaoCurta: "Zona Norte em Expansão - Modernidade e Novos Ares",
    descricaoLonga: "O Novo Horizonte é um bairro em franca expansão na Zona Norte de Macapá. Caracteriza-se por novos empreendimentos residenciais e uma atmosfera de crescimento. Próximo ao Parque de Exposições da Fazendinha e com acesso facilitado, é uma região que atrai quem busca novidades e um ambiente em desenvolvimento. As acompanhantes no Novo Horizonte oferecem um atendimento moderno e discreto para a crescente população desta parte da capital.",
    pontosDReferencia: ["Parque de Exposições", "Novos Residenciais", "Acesso Zona Norte"],
    proximidades: "Zona Norte, próximo ao Jardim Felicidade",
    filterFn: (p) => p.bairro === "Novo Horizonte",
    relatedBairros: [
      { slug: "jardim-felicidade-macapa", nome: "Jardim Felicidade" },
      { slug: "pacoval-macapa", nome: "Pacoval" },
    ],
  },
  "santana-ap": {
    slug: "santana-ap",
    nome: "Santana",
    nomeDisplay: "Santana, Amapá",
    title: "Acompanhantes em Santana – AP | Gatinhas Club",
    h1: "Acompanhantes em Santana – AP",
    metaDescription: "Acompanhantes em Santana, Amapá. Próximo ao Porto de Santana e Ilha de Santana. A segunda maior força do estado.",
    descricaoCurta: "A Segunda Força - Cidade Satélite Indispensável",
    descricaoLonga: "Santana é a segunda maior cidade do Amapá e um polo industrial e portuário vital. Com referências como o Porto de Santana, a Ilha de Santana e a movimentada Avenida Santana, a cidade possui uma vida própria e independente da capital. O público de Santana é fiel e busca acompanhantes locais para evitar o deslocamento até Macapá. Encontre acompanhantes em Santana que oferecem atendimento de elite perto da Vila Amazonas e das principais áreas comerciais da cidade portuária.",
    pontosDReferencia: ["Porto de Santana", "Ilha de Santana", "Avenida Santana", "Vila Amazonas"],
    proximidades: "Cidade satélite de Macapá",
    filterFn: (p) => p.bairro === "Santana",
    relatedBairros: [
      { slug: "centro-macapa", nome: "Centro" },
      { slug: "buritizal-macapa", nome: "Buritizal" },
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
    "name": `Acompanhantes em ${config.nomeDisplay}`,
    "description": config.descricaoLonga,
    "sameAs": "https://pt.wikipedia.org/wiki/Macap%C3%A1",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Macapá",
      "addressRegion": "AP",
      "addressCountry": "BR"
    },
    "areaServed": {
      "@type": "City",
      "name": config.nomeDisplay
    }
  };

  return (
    <Layout>
      <SEOHead
        title={config.title}
        description={config.metaDescription}
        canonical={`/acompanhantes/${config.slug}`}
        keywords={`acompanhantes ${config.nome}, ${config.nome} macapa, classificados adultos, acompanhantes macapa`}
        schema={bairroSchema}
        ogImageAlt={`Acompanhantes no bairro ${config.nome} em Macapá`}
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

      <div className="container py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar / Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <Navigation size={18} className="text-primary" />
                  Sobre a Região
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {config.descricaoLonga}
                </p>
                
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                    <Landmark size={14} className="text-primary" />
                    Pontos de Referência
                  </h3>
                  <ul className="space-y-2">
                    {config.pontosDReferencia.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-4 font-display text-sm font-bold text-foreground">Outros Bairros Próximos</h2>
                <div className="flex flex-wrap gap-2">
                  {config.relatedBairros.map((b) => (
                    <Link
                      key={b.slug}
                      to={`/acompanhantes/${b.slug}`}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {b.nome}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">
                Acompanhantes Disponíveis
              </h2>
              <span className="text-xs text-muted-foreground">
                {profiles.length} {profiles.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-secondary" />
                ))}
              </div>
            ) : profiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {profiles.map((p, i) => (
                  <ProfileCard key={p.id} profile={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-20 text-center">
                <p className="text-sm text-muted-foreground">Nenhum perfil encontrado neste bairro no momento.</p>
                <Link to="/" className="mt-4 inline-block text-xs text-primary hover:underline">
                  Ver todos os anúncios em Macapá
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BairroPage;
