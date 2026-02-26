"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, MapPin, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blogPosts";

const BlogPostPage = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Artigo não encontrado</h1>
          <Link href="/blog" className="mt-4 inline-block text-sm text-primary hover:underline">
            Voltar ao blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${post.title} | Blog Gatinhas Club`}
        description={post.excerpt}
        canonical={`/blog/${post.id}`}
        ogImage={post.image}
      />

      <article className="container py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> Voltar ao blog
          </Link>

          <div className="mb-8 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          <h1 className="mb-8 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          <div className="mb-12 aspect-video overflow-hidden rounded-2xl bg-secondary shadow-lg">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>

          <div className="prose prose-pink prose-lg max-w-none space-y-6 text-muted-foreground leading-relaxed">
            {post.id === "o-que-fazer-em-macapa-a-noite" ? (
              <>
                <p>
                  Macapá, a capital banhada pelo imponente Rio Amazonas, ganha uma vida nova quando o sol se põe. 
                  Para quem busca diversão, boa gastronomia e momentos inesquecíveis, a cidade oferece opções que 
                  misturam a cultura local com a modernidade dos grandes centros.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-8">1. A Orla de Macapá</h2>
                <p>
                  O ponto de encontro clássico. Caminhar pela orla à noite é sentir a brisa do rio e ver o movimento 
                  dos quiosques. O Trapiche Eliezer Levy é uma parada obrigatória para fotos e para apreciar a imensidão 
                  do Amazonas sob o luar.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-8">2. Bares e Gastronomia no Centro</h2>
                <p>
                  O <Link href="/acompanhantes/centro-macapa" className="text-primary hover:underline font-semibold">Centro de Macapá</Link> concentra 
                  excelentes opções de bares com música ao vivo e restaurantes que servem desde o tradicional tacacá até pratos da culinária internacional.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-8">3. Vida Noturna na Zona Norte</h2>
                <p>
                  A <Link href="/acompanhantes-zona-norte-macapa" className="text-primary hover:underline font-semibold">Zona Norte</Link> tem crescido 
                  absurdamente, oferecendo novas casas de shows e pubs que atraem um público jovem e animado. É o lugar ideal para quem quer dançar e conhecer gente nova.
                </p>
                <div className="my-10 rounded-2xl gradient-primary p-8 text-primary-foreground shadow-glow">
                  <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                    <Sparkles size={24} /> Procurando companhia para a noite?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Sua noite em Macapá pode ser ainda melhor. Conheça as acompanhantes mais exclusivas da capital.
                  </p>
                  <Link href="/" className="inline-block rounded-xl bg-white px-6 py-3 font-bold text-primary transition-all hover:scale-105">
                    Ver Acompanhantes em Macapá
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p>
                  Ter um encontro de sucesso exige planejamento, especialmente quando se trata de discrição e privacidade. 
                  Macapá possui locais estratégicos que garantem que seu momento seja único e sem interrupções.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-8">Escolha o Bairro Certo</h2>
                <p>
                  Se você busca discrição total, bairros como o <Link href="/acompanhantes/trem-macapa" className="text-primary hover:underline font-semibold">Trem</Link> e 
                  <Link href="/acompanhantes/santa-rita-macapa" className="text-primary hover:underline font-semibold"> Santa Rita</Link> são excelentes opções por serem 
                  áreas nobres e mais tranquilas, longe do burburinho comercial intenso.
                </p>
                <h2 className="text-2xl font-bold text-foreground mt-8">Dicas de Segurança</h2>
                <p>
                  Sempre utilize plataformas confiáveis para encontrar companhia. No Gatinhas Club, verificamos as fotos para garantir que 
                  você encontre exatamente quem está procurando.
                </p>
                <div className="my-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin size={24} className="text-primary" /> Encontros Próximos a Você
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Encontre acompanhantes independentes que atendem no seu bairro com total discrição e segurança.
                  </p>
                  <Link href="/acompanhantes-macapa" className="inline-block rounded-xl gradient-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:shadow-glow">
                    Explorar Bairros de Macapá
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
            <div className="flex gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary">
                <Share2 size={18} className="text-muted-foreground" />
              </button>
            </div>
            <Link href="/blog" className="text-sm font-bold text-primary hover:underline">
              Mais artigos do blog
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;
