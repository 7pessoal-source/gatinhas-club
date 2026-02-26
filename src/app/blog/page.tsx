import { Link } from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export const blogPosts = [
  {
    id: "o-que-fazer-em-macapa-a-noite",
    title: "O que fazer em Macapá à noite: Guia Completo de Lazer e Diversão",
    excerpt: "Descubra os melhores lugares para aproveitar a noite na capital amapaense, desde a Orla de Macapá até os bares e casas noturnas mais badalados.",
    date: "26 de Fevereiro, 2026",
    readTime: "5 min",
    category: "Lazer",
    image: "/favicon.jpg", // Usando o favicon como placeholder já que não temos outras imagens
  },
  {
    id: "dicas-de-encontros-em-macapa",
    title: "Dicas de Encontros em Macapá: Como ter uma experiência inesquecível",
    excerpt: "Planejando um encontro na cidade? Confira nossas dicas de lugares discretos, restaurantes românticos e como garantir total privacidade.",
    date: "25 de Fevereiro, 2026",
    readTime: "4 min",
    category: "Dicas",
    image: "/favicon.jpg",
  }
];

const BlogPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Blog Gatinhas Club - Dicas e Lazer em Macapá AP"
        description="Confira as melhores dicas de lazer, vida noturna e encontros em Macapá. Fique por dentro de tudo o que acontece na capital do Amapá."
        canonical="/blog"
      />

      <section className="gradient-hero py-16 sm:py-24">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-primary-foreground sm:text-5xl"
          >
            Blog Gatinhas Club
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-primary-foreground/70"
          >
            Dicas exclusivas sobre Macapá, vida noturna e muito mais.
          </motion.p>
        </div>
      </section>

      <section className="container py-12 sm:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-card-hover"
            >
              <Link href={`/blog/${post.id}`} className="block">
                <div className="aspect-video overflow-hidden bg-secondary">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {post.readTime}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="mb-3 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    Ler artigo completo <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;

