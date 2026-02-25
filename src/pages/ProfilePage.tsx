import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, BadgeCheck, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import ProfileCard from "@/components/ProfileCard";
import { mockProfiles } from "@/data/mockProfiles";
import { trackWhatsappClick, trackProfileView } from "@/hooks/useProfiles";

const ProfilePage = () => {
  const { id } = useParams();
  const profile = mockProfiles.find((p) => p.id === id);

  useEffect(() => {
    if (id) trackProfileView(id);
  }, [id]);

  if (!profile) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Perfil não encontrado</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProfiles = mockProfiles
    .filter((p) => p.id !== profile.id && (p.bairro === profile.bairro || p.categoria === profile.categoria))
    .slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.nome,
    description: profile.descricao,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Macapá",
      addressRegion: "AP",
      addressCountry: "BR",
      streetAddress: profile.bairro,
    },
  };

  const categorySlug = {
    Luxo: "acompanhantes-luxo-macapa",
    Independente: "acompanhantes-macapa",
    Massagem: "massagem-macapa",
    Acompanhante: "acompanhantes-macapa",
  }[profile.categoria] || "acompanhantes-macapa";

  return (
    <Layout>
      <SEOHead
        title={`${profile.nome} – Acompanhante em ${profile.bairro}, Macapá AP`}
        description={`${profile.nome}, ${profile.idade} anos – ${profile.categoria} em ${profile.bairro}, Macapá AP. ${profile.descricao.slice(0, 120)}. Contato via WhatsApp no Gatinhas Club.`}
        canonical={`/perfil/${profile.id}`}
        schema={schema}
      />

      <div className="container py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Início</Link>
          <span>/</span>
          <Link to={`/${categorySlug}`} className="hover:text-primary transition-colors">
            {profile.categoria} em Macapá
          </Link>
          <span>/</span>
          <span className="text-foreground">{profile.nome}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-secondary gradient-hero">
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-8xl font-bold text-primary-foreground/20">
                  {profile.nome[0]}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {profile.nome}
              </h1>
              {profile.verificada && (
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <BadgeCheck size={14} /> Verificada
                </span>
              )}
              {profile.destaque && (
                <span className="flex items-center gap-1 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles size={14} /> Destaque
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{profile.idade} anos</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                <Link
                  to={profile.bairro === "Centro" ? "/acompanhantes-centro-macapa" : "/acompanhantes-macapa"}
                  className="hover:text-primary transition-colors"
                >
                  {profile.bairro}, Macapá – AP
                </Link>
              </span>
              <Link
                to={`/${categorySlug}`}
                className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {profile.categoria}
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Sobre</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{profile.descricao}</p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${profile.whatsapp}?text=Ol%C3%A1%2C%20vi%20seu%20an%C3%BAncio%20no%20Gatinhas%20Club!`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick(profile.id)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(142,70%,45%)] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[hsl(142,70%,40%)] sm:w-auto"
            >
              <MessageCircle size={20} />
              Chamar no WhatsApp
            </a>

            {/* Disclaimer */}
            <p className="mt-6 rounded-lg bg-secondary/50 p-3 text-[10px] text-muted-foreground">
              ⚠️ Este anúncio é de responsabilidade exclusiva da anunciante. O Gatinhas Club é apenas uma
              plataforma de{" "}
              <Link to="/acompanhantes-macapa" className="text-primary hover:underline">
                classificados adultos em Macapá
              </Link>{" "}
              e não intermedia serviços. Leia nossos{" "}
              <Link to="/termos" className="text-primary hover:underline">termos de uso</Link>.
            </p>
          </motion.div>
        </div>

        {/* Related profiles */}
        {relatedProfiles.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 font-display text-xl font-bold text-foreground">
              Perfis Semelhantes em Macapá
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {relatedProfiles.map((p, i) => (
                <ProfileCard key={p.id} profile={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
