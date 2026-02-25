import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AgeGate from "@/components/AgeGate";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import SEOPage from "./pages/SEOPage";
import AnunciarPage from "./pages/AnunciarPage";
import TermosPage from "./pages/TermosPage";
import PrivacidadePage from "./pages/PrivacidadePage";
import CookiesPage from "./pages/CookiesPage";
import AvisoLegalPage from "./pages/AvisoLegalPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import PainelGPPage from "./pages/PainelGPPage";
import CadastroGPPage from "./pages/CadastroGPPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AgeGate>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/painel" element={
                  <ProtectedRoute requireGP>
                    <PainelGPPage />
                  </ProtectedRoute>
                } />
                <Route path="/cadastro-gp" element={<CadastroGPPage />} />
                <Route path="/perfil/:id" element={<ProfilePage />} />
                <Route path="/anunciar" element={<AnunciarPage />} />
                <Route path="/termos" element={<TermosPage />} />
                <Route path="/privacidade" element={<PrivacidadePage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/aviso-legal" element={<AvisoLegalPage />} />
                {/* SEO landing pages */}
                <Route path="/acompanhantes-macapa" element={<SEOPage />} />
                <Route path="/garotas-de-programa-macapa" element={<SEOPage />} />
                <Route path="/acompanhantes-macapa-ap" element={<SEOPage />} />
                <Route path="/acompanhantes-centro-macapa" element={<SEOPage />} />
                <Route path="/acompanhantes-zona-norte-macapa" element={<SEOPage />} />
                <Route path="/acompanhantes-zona-sul-macapa" element={<SEOPage />} />
                <Route path="/acompanhantes-luxo-macapa" element={<SEOPage />} />
                <Route path="/massagem-macapa" element={<SEOPage />} />
                {/* Catch-all for other SEO pages */}
                <Route path="/:slug" element={<SEOPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </AgeGate>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
