import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "next/link";

const CookiesPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Política de Cookies – Gatinhas Club"
        description="Política de cookies do Gatinhas Club. Saiba quais cookies utilizamos e como gerenciá-los. Plataforma de classificados adultos em Macapá – AP."
        canonical="/cookies"
      />

      <div className="container max-w-3xl py-10 sm:py-16">
        <h1 className="font-display text-3xl font-bold text-foreground">Política de Cookies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: Fevereiro de 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">O que são Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita
              um site. São amplamente utilizados para garantir o funcionamento dos sites, melhorar a
              eficiência e fornecer informações aos proprietários.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Cookies que Utilizamos</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Cookie</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Finalidade</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Duração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono">age_verified</td>
                    <td className="px-4 py-3">Essencial</td>
                    <td className="px-4 py-3">Verificação de confirmação de idade</td>
                    <td className="px-4 py-3">Sessão</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">_ga</td>
                    <td className="px-4 py-3">Analítico</td>
                    <td className="px-4 py-3">Google Analytics – distinguir usuários</td>
                    <td className="px-4 py-3">2 anos</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">_ga_*</td>
                    <td className="px-4 py-3">Analítico</td>
                    <td className="px-4 py-3">Google Analytics – manter estado de sessão</td>
                    <td className="px-4 py-3">2 anos</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">cookie_consent</td>
                    <td className="px-4 py-3">Essencial</td>
                    <td className="px-4 py-3">Armazena sua preferência de consentimento</td>
                    <td className="px-4 py-3">12 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Gerenciar Cookies</h2>
            <p>
              Você pode gerenciar ou desativar cookies nas configurações do seu navegador. Note que
              desativar cookies essenciais pode afetar o funcionamento da Plataforma. Para cada
              navegador, o processo é diferente:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Chrome: Configurações → Privacidade e segurança → Cookies</li>
              <li>Firefox: Configurações → Privacidade e Segurança</li>
              <li>Safari: Preferências → Privacidade</li>
              <li>Edge: Configurações → Privacidade, pesquisa e serviços</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Consentimento</h2>
            <p>
              Ao acessar a Plataforma pela primeira vez, você verá um aviso de cookies. Cookies
              analíticos só são ativados mediante o seu consentimento expresso, conforme exigência da
              LGPD e boas práticas de privacidade.
            </p>
          </section>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          Leia também:{" "}
          <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>{" "}
          ·{" "}
          <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>{" "}
          ·{" "}
          <Link href="/aviso-legal" className="text-primary hover:underline">Aviso Legal</Link>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
