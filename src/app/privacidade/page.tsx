import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "next/link";

const PrivacidadePage = () => {
  return (
    <Layout>
      <SEOHead
        title="Política de Privacidade – Gatinhas Club"
        description="Política de privacidade e proteção de dados do Gatinhas Club, conforme a LGPD (Lei 13.709/2018). Plataforma de classificados adultos em Macapá – AP."
        canonical="/privacidade"
      />

      <div className="container max-w-3xl py-10 sm:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: Fevereiro de 2026 · Em conformidade com a LGPD (Lei n.º 13.709/2018)
        </p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              1. Controlador dos Dados
            </h2>
            <p>
              O controlador dos dados pessoais tratados nesta Plataforma é o{" "}
              <strong className="text-foreground">Gatinhas Club</strong>, com sede em Macapá – AP,
              Brasil. Contato do Encarregado (DPO):{" "}
              <strong className="text-foreground">privacidade@gatinhasclub.com.br</strong>
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              2. Dados Coletados
            </h2>
            <p>
              Coletamos apenas os dados estritamente necessários para o funcionamento da Plataforma:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong className="text-foreground">Anunciantes:</strong> nome artístico, idade declarada, bairro em Macapá, descrição do anúncio, fotos fornecidas, número de WhatsApp e, para planos pagos, dados de pagamento;</li>
              <li><strong className="text-foreground">Visitantes:</strong> dados de navegação anônimos (páginas acessadas, tempo de sessão, dispositivo), coletados via cookies analíticos com o seu consentimento;</li>
              <li><strong className="text-foreground">Dados técnicos:</strong> endereço IP (anonimizado após 24h), tipo de navegador e sistema operacional.</li>
            </ul>
            <p className="mt-2">
              <strong className="text-foreground">Não coletamos:</strong> dados de documentos de identidade sem solicitação expressa, dados bancários completos, senhas em texto claro ou qualquer dado de menores de 18 anos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">3. Finalidade do Tratamento</h2>
            <p>Os dados são tratados exclusivamente para:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Exibição dos anúncios na Plataforma (base legal: execução de contrato);</li>
              <li>Comunicação sobre planos e pagamentos com anunciantes (base legal: execução de contrato);</li>
              <li>Melhoria da experiência e análise de desempenho (base legal: interesse legítimo e consentimento);</li>
              <li>Cumprimento de obrigações legais e atendimento a ordens judiciais (base legal: obrigação legal);</li>
              <li>Prevenção de fraudes e uso indevido (base legal: interesse legítimo).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">4. Compartilhamento de Dados</h2>
            <p>
              <strong className="text-foreground">Não vendemos, alugamos ou comercializamos</strong> dados pessoais. Podemos compartilhar dados apenas:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Com autoridades policiais ou judiciais, mediante ordem judicial ou legal;</li>
              <li>Com prestadores de serviços técnicos (hospedagem, banco de dados) que atuam como operadores sob contratos de confidencialidade e proteção de dados;</li>
              <li>Em caso de reorganização societária, fusão ou aquisição, mediante aviso prévio ao titular.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">5. Retenção dos Dados</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Dados de anúncios: pelo período de vigência do plano + 6 meses para fins contábeis;</li>
              <li>Dados de navegação: anonimizados após 24 horas, logs analíticos por até 13 meses;</li>
              <li>Dados de pagamento: conforme exigência fiscal (até 5 anos).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">6. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas, incluindo criptografia TLS em
              trânsito, armazenamento criptografado em repouso, controle de acesso por perfil e
              auditoria de acessos. Em caso de incidente de segurança que possa causar risco ou dano
              aos titulares, notificaremos a ANPD e os titulares afetados nos prazos previstos pela LGPD.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              7. Seus Direitos (LGPD – Art. 18)
            </h2>
            <p>Como titular dos dados, você tem direito a:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Confirmar a existência de tratamento;</li>
              <li>Acessar seus dados pessoais;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimizar, bloquear ou eliminar dados desnecessários ou excessivos;</li>
              <li>Solicitar a portabilidade dos dados;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Solicitar informações sobre o compartilhamento de dados;</li>
              <li>Peticionar perante a ANPD.</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, envie solicitação para:{" "}
              <strong className="text-foreground">privacidade@gatinhasclub.com.br</strong>. Responderemos em até 15 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">8. Cookies</h2>
            <p>
              Utilizamos cookies essenciais (necessários para o funcionamento) e, com o seu
              consentimento, cookies analíticos. Consulte nossa{" "}
              <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>{" "}
              para detalhes completos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              9. Transferência Internacional
            </h2>
            <p>
              Caso dados sejam transferidos para servidores localizados fora do Brasil, garantimos que
              o país destinatário oferece grau de proteção adequado ou que medidas contratuais
              equivalentes às exigidas pela LGPD estão em vigor.
            </p>
          </section>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          Leia também:{" "}
          <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>{" "}
          ·{" "}
          <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>{" "}
          ·{" "}
          <Link href="/aviso-legal" className="text-primary hover:underline">Aviso Legal</Link>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacidadePage;
