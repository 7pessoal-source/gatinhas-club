import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";

const AvisoLegalPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Aviso Legal – Gatinhas Club"
        description="Aviso legal do Gatinhas Club. Isenções de responsabilidade e informações legais da plataforma de classificados adultos em Macapá – AP."
        canonical="/aviso-legal"
      />

      <div className="container max-w-3xl py-10 sm:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground">Aviso Legal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: Fevereiro de 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Natureza dos Serviços
            </h2>
            <p>
              O <strong className="text-foreground">Gatinhas Club</strong> é uma plataforma de
              classificados adultos que disponibiliza espaço publicitário para anunciantes
              independentes maiores de 18 anos. A Plataforma atua exclusivamente como intermediário
              de publicidade, equiparando-se a um veículo de anúncios classificados, não sendo
              responsável pelos serviços oferecidos pelas anunciantes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Conformidade Legal – Marco Civil da Internet
            </h2>
            <p>
              Esta Plataforma opera em conformidade com a Lei n.º 12.965/2014 (Marco Civil da
              Internet), que em seu artigo 19 estabelece que o provedor de aplicações de internet
              somente poderá ser responsabilizado civilmente por danos decorrentes de conteúdo gerado
              por terceiros se, após ordem judicial específica, não tomar as providências necessárias
              para tornar indisponível o conteúdo indicado como infringente.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Combate à Exploração Sexual e Tráfico de Pessoas
            </h2>
            <p>
              O Gatinhas Club tem política de tolerância zero contra:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Exploração sexual de qualquer natureza, especialmente de menores;</li>
              <li>Tráfico de pessoas (Lei n.º 13.344/2016 e art. 149-A do Código Penal);</li>
              <li>Qualquer forma de coerção ou servidão.</li>
            </ul>
            <p className="mt-2">
              Denúncias sobre conteúdos suspeitos devem ser enviadas imediatamente para:{" "}
              <strong className="text-foreground">denuncias@gatinhasclub.com.br</strong> ou pelo
              Disque Denúncia Nacional: <strong className="text-foreground">100</strong>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Isenção de Responsabilidade
            </h2>
            <p>
              O Gatinhas Club não se responsabiliza por: conteúdos publicados por anunciantes,
              transações realizadas entre usuários e anunciantes fora da Plataforma, veracidade das
              informações prestadas pelos anunciantes, disponibilidade contínua dos serviços ou
              qualquer dano decorrente do uso da Plataforma por terceiros.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              Contato para Autoridades
            </h2>
            <p>
              Requisições legais, ordens judiciais e solicitações de autoridades devem ser
              encaminhadas para:{" "}
              <strong className="text-foreground">juridico@gatinhasclub.com.br</strong>. Respondemos
              a todas as solicitações dentro dos prazos legais.
            </p>
          </section>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          Leia também:{" "}
          <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link>{" "}
          ·{" "}
          <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>{" "}
          ·{" "}
          <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>
        </div>
      </div>
    </Layout>
  );
};

export default AvisoLegalPage;
