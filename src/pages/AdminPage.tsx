import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Application {
  id: string;
  nome: string;
  idade: number;
  bairro: string;
  categoria: string;
  descricao: string;
  whatsapp: string;
  fotos: string[];
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
  user_id: string;
}

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('pendente');

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/');
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    fetchApps();
  }, [filter]);

  const fetchApps = async () => {
    setLoadingApps(true);
    let q = supabase.from('gp_applications').select('*').order('created_at', { ascending: false });
    if (filter !== 'todos') q = q.eq('status', filter);
    const { data, error } = await q;
    if (!error && data) setApps(data);
    setLoadingApps(false);
  };

  const updateStatus = async (id: string, status: 'aprovado' | 'rejeitado', userId: string) => {
    const { error } = await supabase.from('gp_applications').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      return;
    }

    if (status === 'aprovado') {
      // Update user role to 'gp'
      await supabase.from('user_profiles').upsert({ id: userId, role: 'gp' });
    }

    toast({ title: status === 'aprovado' ? 'Aprovada! ✅' : 'Rejeitada' });
    setSelected(null);
    fetchApps();
  };

  if (loading) return null;

  const statusBadge = (s: string) => {
    const map = {
      pendente: 'bg-yellow-500/20 text-yellow-400',
      aprovado: 'bg-green-500/20 text-green-400',
      rejeitado: 'bg-red-500/20 text-red-400',
    };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[s as keyof typeof map]}`}>{s}</span>;
  };

  return (
    <Layout>
      <SEOHead title="Painel Admin" description="Painel administrativo" canonical="/admin" />

      <div className="container py-8">
        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Painel Admin</h1>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(['pendente', 'aprovado', 'rejeitado', 'todos'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f ? 'gradient-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loadingApps ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : apps.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p>Nenhuma solicitação encontrada</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 shadow-card"
              >
                {app.fotos?.[0] && (
                  <img src={app.fotos[0]} alt={app.nome} className="mb-3 h-32 w-full rounded-lg object-cover" />
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{app.nome}, {app.idade}</p>
                    <p className="text-xs text-muted-foreground">{app.bairro} · {app.categoria}</p>
                  </div>
                  {statusBadge(app.status)}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{app.descricao}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setSelected(app)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-secondary py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                  >
                    <Eye size={12} /> Ver
                  </button>
                  {app.status === 'pendente' && (
                    <>
                      <button
                        onClick={() => updateStatus(app.id, 'aprovado', app.user_id)}
                        className="flex items-center gap-1 rounded-lg bg-green-600/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-600/30"
                      >
                        <CheckCircle size={12} /> Aprovar
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, 'rejeitado', app.user_id)}
                        className="flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/30"
                      >
                        <XCircle size={12} /> Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal detalhes */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">{selected.nome}</h2>
              {statusBadge(selected.status)}
            </div>
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {selected.fotos?.map((url, i) => (
                <img key={i} src={url} alt="" className="h-32 w-32 shrink-0 rounded-lg object-cover" />
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Idade:</span> <span className="text-foreground">{selected.idade}</span></p>
              <p><span className="text-muted-foreground">Bairro:</span> <span className="text-foreground">{selected.bairro}</span></p>
              <p><span className="text-muted-foreground">Categoria:</span> <span className="text-foreground">{selected.categoria}</span></p>
              <p><span className="text-muted-foreground">WhatsApp:</span> <span className="text-foreground">{selected.whatsapp}</span></p>
              <p><span className="text-muted-foreground">Descrição:</span></p>
              <p className="rounded-lg bg-secondary p-3 text-foreground">{selected.descricao}</p>
              <p className="text-xs text-muted-foreground">Cadastro: {new Date(selected.created_at).toLocaleString('pt-BR')}</p>
            </div>
            {selected.status === 'pendente' && (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => updateStatus(selected.id, 'aprovado', selected.user_id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
                >
                  <CheckCircle size={16} /> Aprovar
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'rejeitado', selected.user_id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
                >
                  <XCircle size={16} /> Rejeitar
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
