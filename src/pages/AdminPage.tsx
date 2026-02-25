import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Eye, LogOut, Users } from 'lucide-react';
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
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('pendente');
  const [stats, setStats] = useState({ pendente: 0, aprovado: 0, rejeitado: 0 });

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/');
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    fetchApps();
    fetchStats();
  }, [filter]);

  const fetchStats = async () => {
    const { data } = await supabase.from('gp_applications').select('status');
    if (data) {
      setStats({
        pendente: data.filter(d => d.status === 'pendente').length,
        aprovado: data.filter(d => d.status === 'aprovado').length,
        rejeitado: data.filter(d => d.status === 'rejeitado').length,
      });
    }
  };

  const fetchApps = async () => {
    setLoadingApps(true);
    let q = supabase.from('gp_applications').select('*').order('created_at', { ascending: false });
    if (filter !== 'todos') q = q.eq('status', filter);
    const { data, error } = await q;
    if (!error && data) setApps(data);
    setLoadingApps(false);
  };

  const updateStatus = async (app: Application, status: 'aprovado' | 'rejeitado') => {
    const { error } = await supabase
      .from('gp_applications')
      .update({ status })
      .eq('id', app.id);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      return;
    }

    if (status === 'aprovado') {
      // Promove role para 'gp'
      await supabase.from('user_profiles').update({ role: 'gp' }).eq('id', app.user_id);

      // Cria perfil público automaticamente
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: app.user_id,
        nome: app.nome,
        idade: app.idade,
        bairro: app.bairro,
        categoria: app.categoria,
        descricao: app.descricao,
        whatsapp: app.whatsapp,
        fotos: app.fotos,
        foto_principal: app.fotos?.[0] || null,
        ativo: true,
      }, { onConflict: 'user_id' });

      if (profileError) {
        toast({ title: 'Aviso', description: 'Role atualizado mas erro ao criar perfil: ' + profileError.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: status === 'aprovado' ? '✅ Aprovada e perfil publicado!' : 'Cadastro rejeitado' });
    setSelected(null);
    fetchApps();
    fetchStats();
  };

  if (loading) return null;

  const statusBadge = (s: string) => {
    const map = {
      pendente: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      aprovado: 'bg-green-500/20 text-green-400 border border-green-500/30',
      rejeitado: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[s as keyof typeof map]}`}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <SEOHead title="Painel Admin" description="Painel administrativo" canonical="/admin" />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-sm text-muted-foreground">Gerencie os cadastros de anunciantes</p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
            <p className="font-display text-3xl font-bold text-yellow-400">{stats.pendente}</p>
            <p className="mt-1 text-xs text-muted-foreground">Pendentes</p>
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
            <p className="font-display text-3xl font-bold text-green-400">{stats.aprovado}</p>
            <p className="mt-1 text-xs text-muted-foreground">Aprovadas</p>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
            <p className="font-display text-3xl font-bold text-red-400">{stats.rejeitado}</p>
            <p className="mt-1 text-xs text-muted-foreground">Rejeitadas</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(['pendente', 'aprovado', 'rejeitado', 'todos'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'todos' && (
                <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">
                  {stats[f as keyof typeof stats]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loadingApps ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : apps.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Clock size={40} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground">Nenhuma solicitação encontrada</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
              >
                {app.fotos?.[0] ? (
                  <img src={app.fotos[0]} alt={app.nome} className="h-36 w-full object-cover" />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-secondary">
                    <Users size={32} className="text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{app.nome}, {app.idade}</p>
                      <p className="text-xs text-muted-foreground">{app.bairro} · {app.categoria}</p>
                    </div>
                    {statusBadge(app.status)}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{app.descricao}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/40">
                    {new Date(app.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setSelected(app)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-secondary py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                    >
                      <Eye size={12} /> Ver detalhes
                    </button>
                    {app.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => updateStatus(app, 'aprovado')}
                          className="flex items-center gap-1 rounded-lg bg-green-600/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-600/30"
                        >
                          <CheckCircle size={12} />
                        </button>
                        <button
                          onClick={() => updateStatus(app, 'rejeitado')}
                          className="flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/30"
                        >
                          <XCircle size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">{selected.nome}</h2>
              {statusBadge(selected.status)}
            </div>

            {selected.fotos?.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {selected.fotos.map((url, i) => (
                  <img key={i} src={url} alt="" className="h-40 w-40 shrink-0 rounded-xl border border-border object-cover" />
                ))}
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Idade', value: `${selected.idade} anos` },
                  { label: 'Categoria', value: selected.categoria },
                  { label: 'Bairro', value: selected.bairro },
                  { label: 'WhatsApp', value: selected.whatsapp },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="mb-1 text-xs text-muted-foreground">Descrição</p>
                <p className="leading-relaxed text-foreground">{selected.descricao}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Enviado em {new Date(selected.created_at).toLocaleString('pt-BR')}
              </p>
            </div>

            {selected.status === 'pendente' && (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => updateStatus(selected, 'aprovado')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500"
                >
                  <CheckCircle size={16} /> Aprovar e Publicar
                </button>
                <button
                  onClick={() => updateStatus(selected, 'rejeitado')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                >
                  <XCircle size={16} /> Rejeitar
                </button>
              </div>
            )}
            {selected.status === 'aprovado' && (
              <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-400">
                ✅ Perfil publicado no site
              </div>
            )}
            {selected.status === 'rejeitado' && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                ❌ Cadastro rejeitado
              </div>
            )}
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
