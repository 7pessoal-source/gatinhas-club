"use client";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Save, LogOut, Eye, Clock, CheckCircle, XCircle,
  AlertCircle, Camera, Pencil, Trash2, ToggleLeft, ToggleRight,
  MessageCircle, MapPin, Sparkles, User, LayoutDashboard, FileText,
  ChevronRight, Star, Menu, Home, LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';

const anuncioSchema = z.object({
  nome: z.string().min(2).max(50),
  idade: z.number({ coerce: true }).min(18).max(80),
  bairro: z.string().min(2),
  categoria: z.enum(['Luxo', 'Independente', 'Massagem', 'Acompanhante']),
  descricao: z.string().min(20).max(1000),
  whatsapp: z.string().regex(/^[0-9]{12,13}$/, 'DDI+DDD+número (ex: 5596912345678)'),
});

type AnuncioForm = z.infer<typeof anuncioSchema>;
type Tab = 'dashboard' | 'anuncio' | 'fotos';

export default function PainelGPPage() {
  const { user, isAdmin, loading, signOut, userProfile } = useAuth();
  const navigate = useRouter();

  const [tab, setTab] = useState<Tab>('dashboard');
  const [application, setApplication] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const form = useForm<AnuncioForm>({ resolver: zodResolver(anuncioSchema) });
  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = form;
  const watched = watch();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (!loading && isAdmin) navigate('/admin');
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    const { data: app } = await supabase
      .from('gp_applications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setApplication(app || null);

    if (app?.status === 'aprovado') {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (prof) {
        setProfile(prof);
        setFotos(prof.fotos || []);
        reset({
          nome: prof.nome, idade: prof.idade, bairro: prof.bairro,
          categoria: prof.categoria, descricao: prof.descricao, whatsapp: prof.whatsapp,
        });
      }
    }
    setLoadingData(false);
  };

  const uploadFoto = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `gp-photos/${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('profiles').upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from('profiles').getPublicUrl(path).data.publicUrl;
  };

  const onSubmit = async (data: AnuncioForm) => {
    setSaving(true);
    try {
      const uploaded = await Promise.all(newFiles.map(uploadFoto));
      const allFotos = [...fotos, ...uploaded];
      const payload = { ...data, fotos: allFotos, foto_principal: allFotos[0] || null, user_id: user!.id, ativo: true };
      if (profile) {
        await supabase.from('profiles').update(payload).eq('id', profile.id);
      } else {
        await supabase.from('profiles').insert(payload);
      }
      toast({ title: '✅ Anúncio salvo com sucesso!' });
      setNewFiles([]); setNewPreviews([]);
      fetchData();
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const toggleAtivo = async () => {
    if (!profile) return;
    const novoAtivo = !profile.ativo;
    await supabase.from('profiles').update({ ativo: novoAtivo }).eq('id', profile.id);
    setProfile({ ...profile, ativo: novoAtivo });
    toast({ title: novoAtivo ? '✅ Anúncio ativado!' : '⏸ Anúncio pausado' });
  };

  const deleteAnuncio = async () => {
    if (!profile) return;
    setDeleting(true);
    await supabase.from('profiles').delete().eq('id', profile.id);
    toast({ title: 'Anúncio removido' });
    setProfile(null); setFotos([]); setConfirmDelete(false);
    setDeleting(false); fetchData();
  };

  const removeFotoExistente = async (url: string, idx: number) => {
    const newFotos = fotos.filter((_, i) => i !== idx);
    setFotos(newFotos);
    if (profile) {
      await supabase.from('profiles').update({
        fotos: newFotos,
        foto_principal: newFotos[0] || null,
      }).eq('id', profile.id);
      setProfile({ ...profile, fotos: newFotos, foto_principal: newFotos[0] || null });
    }
    toast({ title: 'Foto removida' });
  };

  const saveFotos = async () => {
    setSaving(true);
    try {
      const uploaded = await Promise.all(newFiles.map(uploadFoto));
      const allFotos = [...fotos, ...uploaded];
      await supabase.from('profiles').update({
        fotos: allFotos, foto_principal: allFotos[0] || null,
      }).eq('id', profile.id);
      setFotos(allFotos); setNewFiles([]); setNewPreviews([]);
      setProfile({ ...profile, fotos: allFotos, foto_principal: allFotos[0] || null });
      toast({ title: '✅ Fotos atualizadas!' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading || loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // Sem cadastro
  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText size={28} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Cadastro necessário</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Envie seu cadastro para análise e comece a anunciar no Gatinhas Club.
          </p>
          <button onClick={() => navigate('/cadastro-gp')}
            className="mt-6 w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:shadow-glow transition-all">
            Enviar cadastro agora
          </button>
          <button onClick={async () => { await signOut(); navigate('/'); }}
            className="mt-3 w-full rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sair
          </button>
        </motion.div>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all";
  const errCls = "mt-1 text-xs text-red-400";
  const totalFotos = fotos.length + newFiles.length;
  const fotoPrincipal = profile?.foto_principal || fotos[0];
  const isAprovada = application?.status === 'aprovado';

  const navItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'anuncio' as Tab, label: 'Editar Anúncio', icon: Pencil, disabled: !isAprovada },
    { id: 'fotos' as Tab, label: 'Gerenciar Fotos', icon: Camera, disabled: !isAprovada },
  ];

  return (
    <>
      <SEOHead title="Meu Painel" description="Painel da anunciante" canonical="/painel" />

      <div className="flex min-h-screen bg-background">

        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex fixed left-0 top-0 h-screen overflow-y-auto">
          {/* Logo */}
          <div className="border-b border-border px-6 py-5 sticky top-0 bg-card">
            <Link href="/" className="font-display text-lg font-bold text-gradient">Gatinhas Club</Link>
            <p className="mt-0.5 text-xs text-muted-foreground">Painel Profissional</p>
          </div>

          {/* Avatar e Status */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-primary/10">
                {fotoPrincipal ? (
                  <img src={fotoPrincipal} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User size={20} className="text-primary/50" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{profile?.nome || userProfile?.nome || 'Anunciante'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`mt-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
              application.status === 'pendente' ? 'bg-yellow-500/10 text-yellow-400'
              : application.status === 'aprovado' ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
            }`}>
              {application.status === 'pendente' && <Clock size={12} />}
              {application.status === 'aprovado' && <CheckCircle size={12} />}
              {application.status === 'rejeitado' && <XCircle size={12} />}
              <span>
                {application.status === 'pendente' ? 'Em análise'
                : application.status === 'aprovado' ? 'Aprovado'
                : 'Rejeitado'}
              </span>
            </div>

            {/* Link para perfil público */}
            {profile && (
              <button onClick={() => navigate(`/perfil/${profile.id}`)}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
                <Eye size={13} /> Ver perfil público
              </button>
            )}
          </div>

          {/* Navegação */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  tab === item.id
                    ? 'bg-primary/10 text-primary'
                    : item.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border px-3 py-4 space-y-2">
            <button onClick={async () => { await signOut(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <LogOut size={14} /> Sair
            </button>
            <button onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Home size={14} /> Voltar ao site
            </button>
          </div>
        </aside>

        {/* Mobile Header + Bottom Nav */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
            <Link href="/" className="font-display text-base font-bold text-gradient">Gatinhas Club</Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-accent rounded-lg">
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-40 flex flex-col overflow-y-auto">
                  
                  <div className="border-b border-border px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-primary/10">
                        {fotoPrincipal ? (
                          <img src={fotoPrincipal} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User size={16} className="text-primary/50" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{profile?.nome || 'Anunciante'}</p>
                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                        disabled={item.disabled}
                        className={`w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                          tab === item.id
                            ? 'bg-primary/10 text-primary'
                            : item.disabled
                            ? 'text-muted-foreground/50 cursor-not-allowed'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}>
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="border-t border-border px-3 py-4 space-y-2">
                    <button onClick={async () => { await signOut(); navigate('/'); }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <LogOut size={14} /> Sair
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">

                {/* ── DASHBOARD ── */}
                {tab === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="mb-8">
                      <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
                      <p className="text-sm text-muted-foreground mt-1">Visualize o status do seu cadastro e estatísticas</p>
                    </div>

                    {/* Status Card */}
                    <div className={`mb-6 rounded-2xl border p-6 ${
                      application.status === 'pendente' ? 'border-yellow-500/30 bg-yellow-500/5'
                      : application.status === 'aprovado' ? 'border-green-500/30 bg-green-500/5'
                      : 'border-red-500/30 bg-red-500/5'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0 bg-current/10">
                          {application.status === 'pendente' && <Clock size={24} className="text-yellow-400" />}
                          {application.status === 'aprovado' && <CheckCircle size={24} className="text-green-400" />}
                          {application.status === 'rejeitado' && <XCircle size={24} className="text-red-400" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-lg ${
                            application.status === 'pendente' ? 'text-yellow-400'
                            : application.status === 'aprovado' ? 'text-green-400'
                            : 'text-red-400'
                          }`}>
                            {application.status === 'pendente' && 'Cadastro em análise'}
                            {application.status === 'aprovado' && 'Cadastro aprovado!'}
                            {application.status === 'rejeitado' && 'Cadastro não aprovado'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {application.status === 'pendente' && 'Seu cadastro foi enviado e está sendo analisado pela equipe. Em breve você receberá uma resposta.'}
                            {application.status === 'aprovado' && 'Seu perfil está publicado no site. Você pode editar seu anúncio e gerenciar fotos.'}
                            {application.status === 'rejeitado' && 'Seu cadastro não foi aprovado. Entre em contato conosco para mais informações.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo por status */}
                    {application.status === 'pendente' && (
                      <div className="rounded-2xl border border-border bg-card p-8 text-center">
                        <Clock size={48} className="mx-auto mb-4 text-yellow-400/50" />
                        <p className="font-medium text-foreground">Aguardando aprovação</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Quando seu cadastro for aprovado, você poderá gerenciar seu anúncio aqui.
                        </p>
                      </div>
                    )}

                    {application.status === 'rejeitado' && (
                      <div className="rounded-2xl border border-border bg-card p-8 text-center">
                        <XCircle size={48} className="mx-auto mb-4 text-red-400/50" />
                        <p className="font-medium text-foreground">Cadastro não aprovado</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Entre em contato com nossa equipe para entender o motivo e enviar um novo cadastro.
                        </p>
                      </div>
                    )}

                    {application.status === 'aprovado' && profile && (
                      <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
                          <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground font-medium">Visualizações</p>
                            <p className="text-2xl font-bold text-foreground mt-2">{profile.views || 0}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground font-medium">Cliques WhatsApp</p>
                            <p className="text-2xl font-bold text-foreground mt-2">{profile.whatsapp_clicks || 0}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground font-medium">Fotos</p>
                            <p className="text-2xl font-bold text-foreground mt-2">{fotos.length}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground font-medium">Status</p>
                            <p className={`text-2xl font-bold mt-2 ${profile.ativo ? 'text-green-400' : 'text-yellow-400'}`}>
                              {profile.ativo ? 'Ativo' : 'Pausado'}
                            </p>
                          </div>
                        </div>

                        {/* Preview Card */}
                        <div className="mb-6">
                          <h2 className="font-display text-xl font-bold text-foreground mb-4">Preview do seu anúncio</h2>
                          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lg transition-shadow">
                            <div className="aspect-[3/4] overflow-hidden bg-muted">
                              {fotoPrincipal ? (
                                <img src={fotoPrincipal} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <Camera size={40} className="text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-bold text-lg text-foreground">{profile.nome}</h3>
                                  <p className="text-sm text-muted-foreground">{profile.idade} anos • {profile.bairro}</p>
                                </div>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                  {profile.categoria}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{profile.descricao}</p>
                              <div className="mt-4 flex gap-2">
                                <button className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
                                  <MessageCircle size={14} className="inline mr-1" /> WhatsApp
                                </button>
                                <button className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
                                  <Eye size={14} className="inline mr-1" /> Ver
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                          <h2 className="font-display text-xl font-bold text-foreground mb-4">Ações rápidas</h2>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <button onClick={() => setTab('anuncio')}
                              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-accent transition-colors">
                              <Pencil size={24} className="text-primary" />
                              <span className="text-xs font-medium text-foreground">Editar</span>
                            </button>
                            <button onClick={() => setTab('fotos')}
                              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-accent transition-colors">
                              <Camera size={24} className="text-primary" />
                              <span className="text-xs font-medium text-foreground">Fotos</span>
                            </button>
                            <button onClick={toggleAtivo}
                              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-accent transition-colors">
                              {profile.ativo ? (
                                <>
                                  <ToggleRight size={24} className="text-green-400" />
                                  <span className="text-xs font-medium text-foreground">Pausar</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft size={24} className="text-yellow-400" />
                                  <span className="text-xs font-medium text-foreground">Ativar</span>
                                </>
                              )}
                            </button>
                            <button onClick={() => setConfirmDelete(true)}
                              className="flex flex-col items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-4 hover:bg-red-500/10 transition-colors">
                              <Trash2 size={24} className="text-red-400" />
                              <span className="text-xs font-medium text-red-400">Excluir</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* ── EDITAR ANÚNCIO ── */}
                {tab === 'anuncio' && isAprovada && (
                  <motion.div key="anuncio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">Editar Anúncio</h1>
                        <p className="text-sm text-muted-foreground mt-1">Atualize as informações do seu perfil</p>
                      </div>
                      {isDirty && (
                        <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">
                          <AlertCircle size={14} /> Alterações não salvas
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-6 space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">Nome artístico *</label>
                          <input {...register('nome')} className={inputCls} />
                          {errors.nome && <p className={errCls}>{errors.nome.message}</p>}
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">Idade *</label>
                          <input {...register('idade')} type="number" min={18} max={80} className={inputCls} />
                          {errors.idade && <p className={errCls}>{errors.idade.message}</p>}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">Bairro *</label>
                          <input {...register('bairro')} className={inputCls} placeholder="Ex: Centro" />
                          {errors.bairro && <p className={errCls}>{errors.bairro.message}</p>}
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria *</label>
                          <select {...register('categoria')} className={inputCls}>
                            <option value="">Selecione...</option>
                            {['Luxo', 'Independente', 'Massagem', 'Acompanhante'].map(c => <option key={c}>{c}</option>)}
                          </select>
                          {errors.categoria && <p className={errCls}>{errors.categoria.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp *</label>
                        <input {...register('whatsapp')} placeholder="5596912345678" className={inputCls} />
                        <p className="mt-1 text-xs text-muted-foreground">DDI + DDD + número, apenas números</p>
                        {errors.whatsapp && <p className={errCls}>{errors.whatsapp.message}</p>}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Descrição *</label>
                        <textarea {...register('descricao')} rows={5} className={inputCls}
                          placeholder="Fale sobre você, seus serviços e diferenciais..." />
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                          {watched.descricao?.length || 0}/1000
                        </p>
                        {errors.descricao && <p className={errCls}>{errors.descricao.message}</p>}
                      </div>

                      <button type="submit" disabled={saving}
                        className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50">
                        <Save size={16} /> {saving ? 'Salvando...' : 'Salvar alterações'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ── GERENCIAR FOTOS ── */}
                {tab === 'fotos' && isAprovada && (
                  <motion.div key="fotos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="mb-6">
                      <h1 className="font-display text-3xl font-bold text-foreground">Gerenciar Fotos</h1>
                      <p className="text-sm text-muted-foreground mt-1">Até 3 fotos. A primeira é usada como capa.</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6">
                      {totalFotos === 0 && (
                        <div className="mb-6 rounded-lg bg-yellow-500/10 p-4 flex items-start gap-3">
                          <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-400">Sem fotos</p>
                            <p className="text-xs text-yellow-400/80 mt-1">Seu anúncio fica menos atrativo sem fotos. Adicione pelo menos uma!</p>
                          </div>
                        </div>
                      )}

                      <div className="mb-6 grid grid-cols-3 gap-4">
                        {/* Fotos existentes */}
                        {fotos.map((url, i) => (
                          <div key={`ex-${i}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            {i === 0 && (
                              <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">
                                Capa
                              </span>
                            )}
                            <button onClick={() => removeFotoExistente(url, i)}
                              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}

                        {/* Novas fotos */}
                        {newPreviews.map((src, i) => (
                          <div key={`new-${i}`} className="group relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-primary/50">
                            <img src={src} alt="" className="h-full w-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-primary/80 py-1 text-center text-[10px] font-medium text-primary-foreground">
                              Nova — não salva
                            </span>
                            <button onClick={() => {
                              setNewFiles(f => f.filter((_, idx) => idx !== i));
                              setNewPreviews(p => p.filter((_, idx) => idx !== i));
                            }} className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {/* Slot de upload */}
                        {totalFotos < 3 && (
                          <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
                            <Upload size={24} />
                            <span className="mt-2 text-xs font-medium">Adicionar foto</span>
                            <span className="mt-1 text-[10px] opacity-60">{3 - totalFotos} restante(s)</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              const remaining = 3 - totalFotos;
                              const toAdd = files.slice(0, remaining);
                              setNewFiles(f => [...f, ...toAdd]);
                              setNewPreviews(p => [...p, ...toAdd.map(f => URL.createObjectURL(f))]);
                            }} />
                          </label>
                        )}
                      </div>

                      {newFiles.length > 0 && (
                        <button onClick={saveFotos} disabled={saving}
                          className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50">
                          <Save size={16} /> {saving ? 'Salvando...' : `Salvar ${newFiles.length} nova(s) foto(s)`}
                        </button>
                      )}

                      {newFiles.length === 0 && fotos.length > 0 && (
                        <p className="text-center text-xs text-muted-foreground">
                          Passe o mouse sobre uma foto para removê-la
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </main>

          {/* Mobile Bottom Nav */}
          <nav className="lg:hidden border-t border-border bg-card sticky bottom-0 flex gap-1 px-2 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                disabled={item.disabled}
                className={`flex-1 flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-medium transition-all ${
                  tab === item.id
                    ? 'bg-primary/10 text-primary'
                    : item.disabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                <item.icon size={16} />
                <span className="line-clamp-1">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Modal confirmar exclusão */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setConfirmDelete(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Excluir anúncio?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Seu anúncio será removido permanentemente do site. Esta ação não pode ser desfeita.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Cancelar
                </button>
                <button onClick={deleteAnuncio} disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50">
                  {deleting ? 'Excluindo...' : 'Sim, excluir'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

