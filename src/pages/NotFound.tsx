import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle, Home, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Usuário tentou acessar rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Ícone de erro */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl"></div>
            <div className="relative bg-destructive/10 rounded-full p-6">
              <AlertCircle className="w-20 h-20 text-destructive" />
            </div>
          </div>
        </div>

        {/* Código de erro */}
        <div>
          <h1 className="text-7xl md:text-8xl font-bold text-foreground mb-2">404</h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Página Não Encontrada
          </p>
          <p className="text-lg text-muted-foreground">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Informações adicionais */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            <strong>URL solicitada:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Se você acredita que isso é um erro, por favor nos informe para que possamos corrigir.
          </p>
        </div>

        {/* Ações disponíveis */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="gap-2"
          >
            <a href="/">
              <Home className="w-5 h-5" />
              Voltar para Home
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <a href="/acompanhantes-macapa">
              <Search className="w-5 h-5" />
              Ver Acompanhantes
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <a href="mailto:contato@gatinhasclub.com.br">
              <Mail className="w-5 h-5" />
              Reportar Erro
            </a>
          </Button>
        </div>

        {/* Links úteis */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Links úteis que podem ajudar:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <a
              href="/"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Página Inicial
            </a>
            <a
              href="/acompanhantes-macapa"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Acompanhantes
            </a>
            <a
              href="/anunciar"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Anunciar
            </a>
            <a
              href="/termos"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="/privacidade"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Privacidade
            </a>
            <a
              href="/cookies"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>

        {/* Mensagem de suporte */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            Precisa de ajuda? Entre em contato conosco através do email{" "}
            <a
              href="mailto:contato@gatinhasclub.com.br"
              className="text-primary font-semibold hover:underline"
            >
              contato@gatinhasclub.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
