import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Save, LogOut, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const anuncioSchema = z.object({
  nome: z.string().min(2).max(50),
  idade: z.number({ coerce: true }).min(18).max(80),
  bairro: z.string().min(2),
  categoria: z.enum(['Luxo', 'Independente', 'Massagem', 'Acompanhante']),
  descricao: z.string().min(20).max(1000),
  whatsapp: z.string().regex(/^[0-9]{12,13}$/, 'DDI+DDD+número (ex: 5596912345678)'),
});

type AnuncioForm = z.infer<typeof anuncioSchema>;

export default function PainelGPPage() {
  const { user, isGP, isAdmin, loading, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnuncioForm>({
    resolver: zodResolver(anuncioSchema),
  });

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (!loading && isAdmin) navigate('/admin');
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);

    // Busca o cadastro enviado
    const { data: app } = await supabase
      .from('gp_applications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setApplication(app || null);

    // Se aprovada, busca o perfil público para edição
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
          nome: prof.nome,
          idade: prof.idade,
          bairro: prof.bairro,
          categoria: prof.categoria,
          descricao: prof.descricao,
          whatsapp: prof.whatsapp,
        });
      }
    }

    setLoadingData(false);
  };

  const handleAddFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - (fotos.length + newFiles.length);
    const toAdd = files.slice(0, remaining);
    setNewFiles([...newFiles, ...toAdd]);
    setNewPreviews([...newPreviews, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  const uploadFoto = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `gp-photos/${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('profiles').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('profiles').getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (data: AnuncioForm) => {
    setSaving(true);
    try {
      const uploadedUrls: string[] = [];
      for (const f of newFiles) {
        uploadedUrls.push(await uploadFoto(f));
      }
      const allFotos = [...fotos, ...uploadedUrls];

      const payload = {
        ...data,
        fotos: allFotos,
        foto_principal: allFotos[0] || null,
        user_id: user!.id,
        ativo: true,
      };

      if (profile) {
        await supabase.from('profiles').update(payload).eq('id', profile.id);
      } else {
        await supabase.from('profiles').insert(payload);
      }

      toast({ title: '✅ Anúncio salvo!' });
      setNewFiles([]);
      setNewPreviews([]);
      fetchData();
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  // Sem cadastro enviado ainda → redireciona para cadastro
  if (!application) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="font-display text-xl font-bold text-foreground">Cadastro necessário</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você ainda não enviou seu cadastro para análise. Preencha seus dados para se tornar uma anunciante.
            </p>
            <button
              onClick={() => navigate('/cadastro-gp')}
              className="mt-6 w-full rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:shadow-glow transition-all"
            >
              Enviar cadastro
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  const errorCls = "mt-1 text-xs text-red-400";
  const totalFotos = fotos.length + newFiles.length;

  return (
    <Layout>
      <SEOHead title="Meu Painel" description="Painel da anunciante" canonical="/painel" />

      <div className="container max-w-2xl py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Olá, {userProfile?.nome || 'Anunciante'} 👋
            </h1>
            <p className="text-sm text-muted-foreground">Gerencie seu anúncio</p>
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>

        {/* Status do cadastro */}
        <div className={`mb-6 rounded-xl border p-4 ${
          application.status === 'pendente'
            ? 'border-yellow-500/30 bg-yellow-500/5'
            : application.status === 'aprovado'
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-center gap-3">
            {application.status === 'pendente' && <Clock size={20} className="text-yellow-400 shrink-0" />}
            {application.status === 'aprovado' && <CheckCircle size={20} className="text-green-400 shrink-0" />}
            {application.status === 'rejeitado' && <XCircle size={20} className="text-red-400 shrink-0" />}
            <div>
              <p className={`font-semibold text-sm ${
                application.status === 'pendente' ? 'text-yellow-400'
                : application.status === 'aprovado' ? 'text-green-400'
                : 'text-red-400'
              }`}>
                {application.status === 'pendente' && 'Cadastro em análise'}
                {application.status === 'aprovado' && 'Cadastro aprovado!'}
                {application.status === 'rejeitado' && 'Cadastro não aprovado'}
              </p>
              <p className="text-xs text-muted-foreground">
                {application.status === 'pendente' && 'Seu cadastro foi enviado e está sendo analisado pela equipe. Em breve você receberá uma resposta.'}
                {application.status === 'aprovado' && 'Seu perfil está publicado no site. Você pode editar seu anúncio abaixo.'}
                {application.status === 'rejeitado' && 'Seu cadastro não foi aprovado. Entre em contato conosco para mais informações.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cadastro pendente ou rejeitado — sem acesso ao editor */}
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

        {/* Aprovada → editor de anúncio */}
        {application.status === 'aprovado' && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">Meu Anúncio</h2>
              {profile && (
                <button
                  type="button"
                  onClick={() => navigate(`/perfil/${profile.id}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                >
                  <Eye size={13} /> Ver no site
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome artístico *</label>
                <input {...register('nome')} className={inputCls} />
                {errors.nome && <p className={errorCls}>{errors.nome.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Idade *</label>
                <input {...register('idade')} type="number" min={18} max={80} className={inputCls} />
                {errors.idade && <p className={errorCls}>{errors.idade.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Bairro *</label>
                <input {...register('bairro')} className={inputCls} />
                {errors.bairro && <p className={errorCls}>{errors.bairro.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria *</label>
                <select {...register('categoria')} className={inputCls}>
                  <option value="">Selecione...</option>
                  {['Luxo', 'Independente', 'Massagem', 'Acompanhante'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.categoria && <p className={errorCls}>{errors.categoria.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp *</label>
              <input {...register('whatsapp')} placeholder="5596912345678" className={inputCls} />
              <p className="mt-1 text-xs text-muted-foreground">DDI+DDD+número, apenas números</p>
              {errors.whatsapp && <p className={errorCls}>{errors.whatsapp.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Descrição *</label>
              <textarea {...register('descricao')} rows={4} className={inputCls} />
              {errors.descricao && <p className={errorCls}>{errors.descricao.message}</p>}
            </div>

            {/* Fotos */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Fotos ({totalFotos}/3)
              </label>
              <div className="flex flex-wrap gap-3">
                {fotos.map((url, i) => (
                  <div key={`ex-${i}`} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotos(fotos.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {newPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative h-24 w-24 overflow-hidden rounded-xl border border-primary">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setNewFiles(newFiles.filter((_, idx) => idx !== i));
                        setNewPreviews(newPreviews.filter((_, idx) => idx !== i));
                      }}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                    >
                      <X size={12} />
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-center text-[9px] text-primary-foreground">
                      Nova
                    </span>
                  </div>
                ))}
                {totalFotos < 3 && (
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    <Upload size={20} />
                    <span className="mt-1 text-xs">Adicionar</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddFotos} />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Salvando...' : 'Salvar Anúncio'}
            </button>
          </motion.form>
        )}
      </div>
    </Layout>
  );
}
