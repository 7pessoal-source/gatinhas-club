"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/acompanhantes-macapa", label: "Acompanhantes" },
    { href: "/blog", label: "Blog" },
    { href: "/anunciar", label: "Anunciar" },
  ];

  const seoLinks = [
    { href: "/acompanhantes-macapa", label: "Acompanhantes Macapá" },
    { href: "/garotas-de-programa-macapa", label: "Garotas de Programa Macapá" },
    { href: "/acompanhantes-macapa-ap", label: "Acompanhante Macapá AP" },
    { href: "/acompanhantes-centro-macapa", label: "Acompanhantes Centro Macapá" },
    { href: "/acompanhantes-zona-norte-macapa", label: "Acompanhantes Zona Norte Macapá" },
    { href: "/acompanhantes-zona-sul-macapa", label: "Acompanhantes Zona Sul Macapá" },
    { href: "/acompanhantes-luxo-macapa", label: "Acompanhantes Luxo Macapá" },
    { href: "/massagem-macapa", label: "Massagem Macapá" },
  ];

  const bairrosLinks = [
    { href: "/acompanhantes/centro-macapa", label: "Centro" },
    { href: "/acompanhantes/santa-rita-macapa", label: "Santa Rita" },
    { href: "/acompanhantes/buritizal-macapa", label: "Buritizal" },
    { href: "/acompanhantes/trem-macapa", label: "Trem" },
    { href: "/acompanhantes/marco-zero-macapa", label: "Marco Zero" },
    { href: "/acompanhantes/jardim-equatorial-macapa", label: "Jardim Equatorial" },
    { href: "/acompanhantes/congos-macapa", label: "Congós" },
    { href: "/acompanhantes/novo-horizonte-macapa", label: "Novo Horizonte" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-gradient">Gatinhas Club</span>
            <span className="hidden text-[10px] text-muted-foreground sm:inline">Macapá – AP</span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
            {user ? (
              <>
                {!isAdmin && (
                  <Link href="/painel" className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                    <LayoutDashboard size={14} /> Painel
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link href="/auth" className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                <LogIn size={14} /> Entrar
              </Link>
            )}
            <Link
              href="/cadastro-gp"
              className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
            >
              Anunciar
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-foreground md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
            >
              <div className="container flex flex-col gap-3 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm font-medium transition-colors ${
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-sm font-medium text-yellow-400">
                    <ShieldCheck size={15} /> Admin
                  </Link>
                )}
                {user ? (
                  <>
                    {!isAdmin && (
                      <Link href="/painel" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                        <LayoutDashboard size={14} /> Meu Painel
                      </Link>
                    )}
                    <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-left text-sm font-medium text-muted-foreground">
                      Sair
                    </button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <LogIn size={14} /> Entrar / Cadastrar
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border bg-secondary/30">
        <div className="container py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 font-display text-lg font-bold text-gradient">Gatinhas Club</h3>
              <p className="text-xs text-muted-foreground">
                Plataforma de classificados adultos independentes em Macapá – AP, Amapá. Não
                intermediamos serviços, não agendamos encontros e não cobramos comissão.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                CNPJ: Em processo de registro | Macapá – AP, Brasil
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Navegação</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Início</Link>
                <Link href="/blog" className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold">Blog</Link>
                <Link href="/anunciar" className="text-xs text-muted-foreground hover:text-primary transition-colors">Anunciar</Link>
                <Link href="/termos" className="text-xs text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link>
                <Link href="/privacidade" className="text-xs text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link>
                <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">Política de Cookies</Link>
                <Link href="/aviso-legal" className="text-xs text-muted-foreground hover:text-primary transition-colors">Aviso Legal</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Categorias</h4>
              <div className="flex flex-col gap-2">
                {seoLinks.slice(0, 5).map((l) => (
                  <Link key={l.href} href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Bairros de Macapá</h4>
              <div className="flex flex-col gap-2">
                {bairrosLinks.slice(0, 5).map((l) => (
                  <Link key={l.href} href={l.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Encontre Acompanhantes em Todos os Bairros de Macapá
            </h4>
            <div className="flex flex-wrap gap-2">
              {bairrosLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border/50 bg-background px-3 py-1 text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  rel="related"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <p>
              O <strong>Gatinhas Club</strong> é a principal plataforma de{" "}
              <Link href="/acompanhantes-macapa" className="text-primary hover:underline">
                acompanhantes em Macapá
              </Link>{" "}
              – AP. Encontre{" "}
              <Link href="/garotas-de-programa-macapa" className="text-primary hover:underline">
                garotas de programa em Macapá
              </Link>
              ,{" "}
              <Link href="/acompanhantes-centro-macapa" className="text-primary hover:underline">
                acompanhantes no Centro de Macapá
              </Link>
              ,{" "}
              <Link href="/acompanhantes-zona-norte-macapa" className="text-primary hover:underline">
                acompanhantes na Zona Norte de Macapá
              </Link>{" "}
              e{" "}
              <Link href="/acompanhantes-zona-sul-macapa" className="text-primary hover:underline">
                acompanhantes na Zona Sul de Macapá
              </Link>
              . Todos os anúncios são de anunciantes independentes maiores de 18 anos.
            </p>
          </div>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} Gatinhas Club. Todos os direitos reservados. Plataforma
              exclusiva de classificados adultos. Conteúdo restrito a maiores de 18 anos. | Macapá –
              AP, Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
