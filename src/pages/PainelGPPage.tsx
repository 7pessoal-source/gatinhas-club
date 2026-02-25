import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Save, LogOut, Eye } from 'lucide-react';
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
  const { user, isGP, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnuncioForm>({
    resolver: zodResolver(anuncioSchema),
  });

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (!loading && !isGP && !isAdmin) navigate('/cadastro-gp');
  }, [loading, user, isGP, isAdmin, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    if (data) {
      setProfile(data);
      setFotos(data.fotos || []);
      reset({
        nome: data.nome,
        idade: data.idade,
        bairro: data.bairro,
        categoria: data.categoria,
        descricao: data.descricao,
        whatsapp: data.whatsapp,
      });
    }
  };

  const totalFotos = fotos.length + newFiles.length;

  const handleAddFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - totalFotos;
    const toAdd = files.slice(0, remaining);
    setNewFiles([...newFiles, ...toAdd]);
    setNewPreviews([...newPreviews, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingFoto = (idx: number) => setFotos(fotos.filter((_, i) => i !== idx));
  const removeNewFoto = (idx: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== idx));
    setNewPreviews(newPreviews.filter((_, i) => i !== idx));
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

      toast({ title: 'Anúncio salvo! ✅' });
      setNewFiles([]);
      setNewPreviews([]);
      fetchProfile();
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  const errorCls = "mt-1 text-xs text-red-400";

  return (
    <Layout>
      <SEOHead title="Meu Painel" description="Gerencie seu anúncio" canonical="/painel" />

      <div className="container max-w-2xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {profile ? 'Editar Anúncio' : 'Criar Anúncio'}
          </h1>
          <div className="flex gap-2">
            {profile && (
              <button
                onClick={() => navigate(`/perfil/${profile.id}`)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
              >
                <Eye size={14} /> Ver perfil
              </button>
            )}
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
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
                  <button type="button" onClick={() => removeExistingFoto(i)} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative h-24 w-24 overflow-hidden rounded-xl border border-primary">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeNewFoto(i)} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white">
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-primary/80 py-0.5 text-center text-[9px] text-primary-foreground">Nova</span>
                </div>
              ))}
              {totalFotos < 3 && (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:shadow-glow disabled:opacity-50 transition-all"
          >
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar Anúncio'}
          </button>
        </motion.form>
      </div>
    </Layout>
  );
}
