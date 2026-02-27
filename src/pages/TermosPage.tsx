import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";

const TermosPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Termos de Uso – Gatinhas Club"
        description="Termos de uso completos do Gatinhas Club, plataforma de classificados adultos independentes em Macapá – AP. Leia antes de utilizar."
        canonical="/termos"
      />

      <div className="container max-w-3xl py-10 sm:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground">Termos de Uso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: Fevereiro de 2026 · Versão 2.0
        </p>

        <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
          ⚠️ Este site contém conteúdo adulto. O acesso é restrito a pessoas maiores de 18 anos. Ao
          continuar navegando, você declara ter 18 anos ou mais e concordar integralmente com estes
          Termos de Uso.
        </div>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              1. Natureza da Plataforma
            </h2>
            <p>
              O <strong className="text-foreground">Gatinhas Club</strong> (doravante "Plataforma") é
              um serviço de classificados adultos que funciona exclusivamente como espaço publicitário
              para anunciantes independentes maiores de 18 anos, sediada em Macapá – AP, Brasil. A
              Plataforma <strong className="text-foreground">não intermedia serviços</strong>, não
              agenda encontros, não cobra comissão sobre qualquer tipo de serviço prestado pelas
              anunciantes e não se responsabiliza pelo conteúdo publicado por terceiros.
            </p>
            <p className="mt-2">
              A Plataforma funciona como um veículo de publicidade, nos termos do art. 36 e seguintes
              do Código de Defesa do Consumidor (Lei n.º 8.078/1990), sendo responsabilidade exclusiva
              do anunciante o conteúdo veiculado.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">2. Elegibilidade</h2>
            <p>
              O acesso e uso desta Plataforma são condicionados a:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Ter 18 (dezoito) anos ou mais de idade;</li>
              <li>Possuir plena capacidade civil;</li>
              <li>Concordar integral e voluntariamente com estes Termos;</li>
              <li>Residir em localidade onde o acesso a conteúdo adulto é legalmente permitido.</li>
            </ul>
            <p className="mt-2">
              O acesso de menores de 18 anos é absolutamente proibido. Ao acessar o site, o usuário
              declara, sob responsabilidade civil e penal, que atende a todos os critérios acima.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              3. Independência Total dos Anunciantes
            </h2>
            <p>
              Todos os anunciantes são profissionais autônomos e atuam de forma completamente
              independente. O Gatinhas Club não mantém:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Vínculo empregatício com qualquer anunciante;</li>
              <li>Relação societária, de representação ou de mandato;</li>
              <li>Controle sobre os serviços prestados por anunciantes;</li>
              <li>Responsabilidade por acordos celebrados fora da plataforma.</li>
            </ul>
            <p className="mt-2">
              Os anúncios publicados são de responsabilidade exclusiva de cada anunciante, que declara,
              ao publicar, ter 18 anos ou mais e ser titular dos direitos sobre o conteúdo publicado.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              4. Conteúdo Absolutamente Proibido
            </h2>
            <p>
              É expressamente proibido publicar, compartilhar ou vincular conteúdo que:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Envolva, exiba ou insinue a participação de menores de 18 anos em qualquer forma;</li>
              <li>Caracterize tráfico de pessoas (Lei n.º 13.344/2016);</li>
              <li>Promova ou facilite a exploração sexual de qualquer natureza;</li>
              <li>Contenha imagens íntimas sem o consentimento expresso da pessoa retratada (Lei n.º 13.772/2018);</li>
              <li>Seja discriminatório, degradante ou que incite violência ou ódio;</li>
              <li>Viole direitos autorais ou de imagem de terceiros;</li>
              <li>Contenha informações falsas ou enganosas sobre a anunciante;</li>
              <li>Infrinja quaisquer leis federais, estaduais ou municipais vigentes no Brasil.</li>
            </ul>
            <p className="mt-2">
              A violação desta cláusula enseja a remoção imediata do conteúdo e eventual comunicação
              às autoridades competentes, sem prejuízo de ação civil por danos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              5. Verificação de Idade e Identidade
            </h2>
            <p>
              O Gatinhas Club pode solicitar documentos comprobatórios de idade a qualquer anunciante,
              a qualquer momento. Anunciantes que não fornecerem documentação terão seus anúncios
              removidos. A falsidade de informações prestadas configura crime de falsidade ideológica
              (art. 299 do Código Penal) e sujeitará o infrator às sanções civis e penais cabíveis.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              6. Serviços Pagos e Planos de Anúncio
            </h2>
            <p>
              Os planos pagos correspondem exclusivamente à venda de espaço publicitário na
              Plataforma, nos seguintes termos:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>O pagamento confere ao anunciante o direito de publicar e exibir seu anúncio pelo período contratado;</li>
              <li>Não implica qualquer intermediação de serviços;</li>
              <li>Não gera vínculo empregatício, societário ou de representação;</li>
              <li>Pode ser cancelado a qualquer momento pelo Gatinhas Club em caso de violação destes Termos, sem reembolso;</li>
              <li>Valores, vigência e benefícios estão descritos na{" "}
                <Link to="/anunciar" className="text-primary hover:underline">página de anúncio</Link>.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              7. Limitação de Responsabilidade
            </h2>
            <p>
              Na máxima extensão permitida pela lei brasileira, o Gatinhas Club não se responsabiliza
              por: (i) conteúdo publicado por anunciantes; (ii) transações, encontros ou qualquer
              interação entre usuários e anunciantes ocorrida fora da Plataforma; (iii) danos diretos,
              indiretos, incidentais ou consequentes decorrentes do uso da Plataforma; (iv) indisponibilidade
              temporária dos serviços por motivos técnicos, manutenção ou força maior.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              8. Propriedade Intelectual
            </h2>
            <p>
              O layout, logotipo, marca, código-fonte e demais elementos visuais da Plataforma são de
              titularidade do Gatinhas Club e protegidos pela Lei n.º 9.610/1998 (Lei de Direitos
              Autorais). É vedada a reprodução, cópia ou uso não autorizado. O anunciante mantém a
              titularidade de suas fotos e conteúdos, concedendo ao Gatinhas Club licença de uso não
              exclusiva pelo período de vigência do anúncio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">9. Foro e Legislação</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro
              da comarca de Macapá – AP para dirimir quaisquer controvérsias decorrentes destes Termos,
              com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              10. Modificações dos Termos
            </h2>
            <p>
              O Gatinhas Club reserva-se o direito de modificar estes Termos a qualquer tempo. As
              alterações entram em vigor na data de sua publicação. O uso continuado da Plataforma após
              qualquer modificação implica aceitação das novas condições. Recomendamos revisão periódica.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">11. Contato</h2>
            <p>
              Para questões relacionadas a estes Termos, envie e-mail para:{" "}
              <strong className="text-foreground">contato@gatinhasclub.site</strong>
            </p>
          </section>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          Leia também:{" "}
          <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>{" "}
          ·{" "}
          <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>{" "}
          ·{" "}
          <Link to="/aviso-legal" className="text-primary hover:underline">Aviso Legal</Link>
        </div>
      </div>
    </Layout>
  );
};

export default TermosPage;
