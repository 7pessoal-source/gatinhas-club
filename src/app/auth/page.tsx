"use client";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const registerSchema = loginSchema.extend({
  nome: z.string().min(2, 'Nome muito curto').max(50),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useRouter();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginForm) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast({ title: 'Erro ao entrar', description: 'E-mail ou senha incorretos.', variant: 'destructive' });
    } else {
      toast({ title: 'Bem-vinda! 🌸' });
      navigate('/painel');
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    const { error } = await signUp(data.email, data.password, data.nome);
    if (error) {
      toast({ title: 'Erro no cadastro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cadastro realizado!', description: 'Verifique seu e-mail para confirmar a conta.' });
      setMode('login');
    }
  };

  return (
    <Layout>
      <SEOHead title="Entrar / Cadastrar" description="Acesse sua conta no Gatinhas Club." canonical="/auth" />

      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card"
        >
          {/* Tabs */}
          <div className="mb-8 flex rounded-xl bg-secondary p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === m ? 'gradient-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Senha</label>
                <div className="relative">
                  <input
                    {...loginForm.register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-muted-foreground">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-400">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50"
              >
                <LogIn size={16} /> Entrar
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nome</label>
                <input
                  {...registerForm.register('nome')}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {registerForm.formState.errors.nome && (
                  <p className="mt-1 text-xs text-red-400">{registerForm.formState.errors.nome.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
                <input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-400">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Senha</label>
                <div className="relative">
                  <input
                    {...registerForm.register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-muted-foreground">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-400">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Confirmar Senha</label>
                <input
                  {...registerForm.register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50"
              >
                <UserPlus size={16} /> Criar Conta
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao criar uma conta você concorda com os{' '}
            <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}

