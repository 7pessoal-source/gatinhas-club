import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ProfileCard from "@/components/ProfileCard";
import { useProfiles } from "@/hooks/useProfiles";
import type { Profile } from "@/data/mockProfiles";

interface SEOPageConfig {
  slug: string;
  title: string;
  h1: string;
  h2: string;
  metaDescription: string;
  content: string;
  extraContent?: string;
  filterFn: (p: Profile) => boolean;
  relatedLinks: { to: string; label: string }[];
}

export const seoPages: Record<string, SEOPageConfig> = {
  "acompanhantes-macapa": {
    slug: "acompanhantes-macapa",
    title: "Acompanhantes em Macapá – AP | Classificados Adultos",
    h1: "Acompanhantes em Macapá – AP",
    h2: "Encontre Acompanhantes Independentes em Macapá, Amapá",
    metaDescription: "As melhores acompanhantes independentes em Macapá, AP. Perfis verificados, fotos reais e contato direto via WhatsApp. Classificados adultos seguros e discretos no Gatinhas Club.",
    content: "Bem-vindo ao Gatinhas Club, o principal portal de acompanhantes em Macapá – AP. Aqui você encontra perfis de anunciantes independentes que atuam na capital do Amapá, em bairros como Centro, Santa Rita, Buritizal, Laguinho, Congós, Marco Zero e muito mais.",
    extraContent: "Nossa plataforma reúne acompanhantes no Centro de Macapá, acompanhantes na Zona Norte de Macapá, acompanhantes na Zona Sul de Macapá e garotas de programa em Macapá AP.",
    filterFn: (p) => ["Luxo", "Independente", "Acompanhante"].includes(p.categoria),
    relatedLinks: [
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes no Centro de Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
      { to: "/massagem-macapa", label: "Massagem em Macapá" },
    ],
  },
  "garotas-de-programa-macapa": {
    slug: "garotas-de-programa-macapa",
    title: "Garotas de Programa Macapá – Classificados Adultos | Gatinhas Club",
    h1: "Garotas de Programa em Macapá – AP",
    h2: "Anúncios Independentes – Garotas de Programa Macapá",
    metaDescription: "Garotas de programa em Macapá, AP. Perfis verificados e com fotos reais no Gatinhas Club. Classificados adultos para maiores de 18 anos em Macapá – Amapá.",
    content: "Encontre no Gatinhas Club os perfis de garotas de programa em Macapá, a capital do Amapá. Anúncios independentes, discretos e verificados. Todas as anunciantes são maiores de 18 anos.",
    extraContent: "Confira também acompanhantes em Macapá AP, acompanhantes no Centro de Macapá, acompanhantes na Zona Norte e na Zona Sul.",
    filterFn: (p) => ["Luxo", "Independente", "Acompanhante"].includes(p.categoria),
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-macapa-ap", label: "Acompanhante Macapá AP" },
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
    ],
  },
  "acompanhantes-macapa-ap": {
    slug: "acompanhantes-macapa-ap",
    title: "Acompanhante Macapá AP – Classificados Adultos | Gatinhas Club",
    h1: "Acompanhante em Macapá – AP (Amapá)",
    h2: "Perfis Verificados de Acompanhantes em Macapá – AP",
    metaDescription: "Acompanhante Macapá AP – encontre perfis verificados no Gatinhas Club. Classificados adultos independentes em Macapá, capital do Amapá.",
    content: "Macapá, capital do estado do Amapá (AP), é a única capital brasileira cortada pela linha do Equador. No Gatinhas Club você encontra acompanhantes em Macapá AP com perfis verificados, fotos reais e contato direto.",
    filterFn: () => true,
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
      { to: "/massagem-macapa", label: "Massagem Macapá" },
    ],
  },
  "acompanhantes-centro-macapa": {
    slug: "acompanhantes-centro-macapa",
    title: "Acompanhantes no Centro de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes no Centro de Macapá – AP",
    h2: "Perfis Verificados no Bairro Centro, Macapá",
    metaDescription: "Encontre acompanhantes independentes no Centro de Macapá, AP. Região central com fácil acesso, discrição total.",
    content: "O bairro Centro de Macapá é o coração da capital do Amapá, com fácil acesso por toda a cidade. No Gatinhas Club você encontra acompanhantes no Centro de Macapá com perfis verificados e contato direto.",
    filterFn: (p) => p.bairro === "Centro",
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    ],
  },
  "acompanhantes-zona-norte-macapa": {
    slug: "acompanhantes-zona-norte-macapa",
    title: "Acompanhantes na Zona Norte de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes na Zona Norte de Macapá – AP",
    h2: "Anúncios Independentes na Zona Norte de Macapá",
    metaDescription: "Acompanhantes independentes na Zona Norte de Macapá, AP – bairros Novo Horizonte, Jardim Equatorial, Pacoval e Zerão.",
    content: "A Zona Norte de Macapá compreende bairros como Novo Horizonte, Jardim Equatorial, Pacoval e Zerão. Encontre acompanhantes na Zona Norte de Macapá com perfis verificados e contato direto.",
    filterFn: (p) => ["Novo Horizonte", "Jardim Equatorial", "Pacoval", "Zerão"].includes(p.bairro),
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul" },
      { to: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
    ],
  },
  "acompanhantes-zona-sul-macapa": {
    slug: "acompanhantes-zona-sul-macapa",
    title: "Acompanhantes na Zona Sul de Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes na Zona Sul de Macapá – AP",
    h2: "Anúncios Independentes na Zona Sul de Macapá",
    metaDescription: "Acompanhantes independentes na Zona Sul de Macapá, AP – Congós, Laguinho, Trem, Beirol, Buritizal e Santa Rita.",
    content: "A Zona Sul de Macapá reúne bairros populares como Congós, Laguinho, Trem, Beirol, Buritizal e Santa Rita. Encontre acompanhantes na Zona Sul de Macapá com perfis verificados e contato direto.",
    filterFn: (p) => ["Congós", "Laguinho", "Trem", "Beirol", "Buritizal", "Santa Rita"].includes(p.bairro),
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte" },
      { to: "/massagem-macapa", label: "Massagem Macapá" },
    ],
  },
  "massagem-macapa": {
    slug: "massagem-macapa",
    title: "Massagem Relaxante em Macapá – AP | Gatinhas Club",
    h1: "Massagem Relaxante e Terapêutica em Macapá – AP",
    h2: "Massagistas Independentes em Macapá, Amapá",
    metaDescription: "Encontre massagistas independentes em Macapá, AP. Massagem relaxante, terapêutica e sensorial.",
    content: "Confira os perfis de massagistas independentes em Macapá, capital do Amapá. Serviços de massagem relaxante, terapêutica e sensorial. Contato direto via WhatsApp.",
    filterFn: (p) => p.categoria === "Massagem",
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    ],
  },
  "acompanhantes-luxo-macapa": {
    slug: "acompanhantes-luxo-macapa",
    title: "Acompanhantes de Luxo em Macapá – AP | Gatinhas Club",
    h1: "Acompanhantes de Luxo em Macapá – AP",
    h2: "Perfis Premium e de Luxo em Macapá, Amapá",
    metaDescription: "Acompanhantes de luxo em Macapá, AP. Perfis sofisticados e verificados no Gatinhas Club.",
    content: "Encontre acompanhantes de luxo em Macapá, AP. Perfis sofisticados, com fotos verificadas e disponíveis para eventos, jantares e companhia exclusiva na capital do Amapá.",
    filterFn: (p) => p.categoria === "Luxo",
    relatedLinks: [
      { to: "/acompanhantes-macapa", label: "Acompanhantes em Macapá" },
      { to: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    ],
  },
};

const SEOPage = () => {
  const { slug } = useParams();

  // Descobre o slug pela URL atual quando não vem por parâmetro
  const currentSlug = slug || window.location.pathname.replace("/", "");
  const config = seoPages[currentSlug];

  const { data: allProfiles = [], isLoading } = useProfiles();

  const profiles = useMemo(() => {
    if (!config) return [];
    return allProfiles.filter(config.filterFn);
  }, [allProfiles, config]);

  if (!config) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Página não encontrada</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={config.title}
        description={config.metaDescription}
        canonical={`/${config.slug}`}
      />

      <section className="gradient-hero py-12 sm:py-16">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            {config.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-primary-foreground/70">{config.content}</p>
        </div>
      </section>

      <section className="container py-8 sm:py-12">
        <h2 className="mb-6 font-display text-xl font-semibold text-foreground">{config.h2}</h2>

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
              Nenhum perfil disponível nesta categoria no momento.{" "}
              <Link to="/" className="text-primary hover:underline">Ver todos os anúncios</Link>
            </p>
          </div>
        )}

        {config.extraContent && (
          <div className="mt-10 rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{config.extraContent}</p>
          </div>
        )}

        <div className="mt-10">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Categorias Relacionadas</h3>
          <div className="flex flex-wrap gap-2">
            {config.relatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SEOPage;
