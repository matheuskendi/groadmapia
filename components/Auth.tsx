import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Zap, ArrowLeft, AlertCircle } from 'lucide-react';
import { AuthMode, User } from '../types';
import { dbService } from '../services/dbService';

interface AuthProps {
  initialMode: AuthMode;
  onSuccess: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ initialMode, onSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Estilo padrão para inputs com ícone à esquerda
  const inputClassName = "block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let user: User;
      if (mode === 'SIGNUP') {
        // Agora usamos await pois o dbService é assíncrono (preparado para API)
        user = await dbService.signup(formData.name, formData.email, formData.password);
      } else {
        user = await dbService.login(formData.email, formData.password);
      }
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
        
        {/* Decorative header */}
        <div className="bg-indigo-600 h-2"></div>

        <div className="p-8">
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-xl mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'LOGIN' ? 'Bem-vindo de volta' : 'Crie sua conta grátis'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {mode === 'LOGIN' 
                ? 'Entre para acessar seus calendários salvos' 
                : 'Comece a gerar conteúdo em segundos'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className={inputClassName}
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className={inputClassName}
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className={inputClassName}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-6"
            >
              {loading ? (
                'Conectando...'
              ) : (
                <>
                  {mode === 'LOGIN' ? 'Entrar' : 'Começar agora'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {mode === 'LOGIN' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button 
                onClick={toggleMode}
                className="ml-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {mode === 'LOGIN' ? 'Cadastre-se' : 'Fazer login'}
              </button>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Ao continuar, você concorda com nossos Termos de Uso.
        </div>
      </div>
    </div>
  );
};

export default Auth;