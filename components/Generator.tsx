import React, { useState } from 'react';
import { generateContentPlan } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { ContentPlanRequest, ContentPlanResponse, CalendarDay, User } from '../types';
import { ArrowLeft, Loader2, Sparkles, Copy, Check, Video, Camera, Youtube, Share2, Save, AlertTriangle, Key } from 'lucide-react';

interface GeneratorProps {
  onBack: () => void;
  user: User;
}

const Generator: React.FC<GeneratorProps> = ({ onBack, user }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState<ContentPlanRequest>({
    niche: '',
    objective: '',
    platform: 'Instagram Reels',
    frequency: 5,
    level: 'Iniciante',
    tone: 'Divertido e Educativo'
  });

  // Estilo padrão para todos os inputs e selects
  const inputClassName = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user.apiKey) {
      setError("Você precisa configurar sua API Key antes de gerar conteúdo. Volte ao Dashboard e clique no ícone de engrenagem.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateContentPlan(formData, user.apiKey);
      setResult(data);
      
      // Salvar automaticamente no DB Local (agora async)
      await dbService.saveProject(user.id, formData, data);
      setSaved(true);
      
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao gerar o plano.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDay = (index: number) => {
    setActiveDay(activeDay === index ? null : index);
  };

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('curto') || t.includes('reels') || t.includes('tiktok')) return <Camera className="h-4 w-4" />;
    if (t.includes('youtube') || t.includes('longo')) return <Youtube className="h-4 w-4" />;
    return <Video className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="relative mb-6 mx-auto w-24 h-24">
             <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
             <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Criando sua estratégia...</h2>
          <p className="text-slate-500">
            Analisando seu nicho de <span className="font-semibold text-indigo-600">{formData.niche}</span> e criando roteiros para {formData.frequency} vídeos por semana.
          </p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Voltar para Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
               {saved && (
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                   <Save className="h-3 w-3" />
                   Salvo automaticamente
                 </span>
               )}
               <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
               >
                 {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                 {copied ? 'Copiado' : 'Copiar'}
               </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Estratégia Definida</h2>
            <p className="text-indigo-100 text-lg leading-relaxed">{result.resumo_estrategia}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                Calendário de Conteúdo
              </h3>
              
              {result.calendario.map((day: CalendarDay, index: number) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    onClick={() => toggleDay(index)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg text-slate-500 font-bold text-xs uppercase tracking-wide">
                         <span>{day.dia.split(' ')[0]}</span>
                         <span className="text-lg text-slate-900">{day.dia.split(' ')[1] || (index+1)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            day.objetivo_da_peca === 'venda' ? 'bg-green-100 text-green-700' :
                            day.objetivo_da_peca === 'autoridade' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {day.objetivo_da_peca}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                             {getIconForType(day.tipo_conteudo)}
                             {day.plataforma}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 leading-tight">{day.titulo}</h4>
                      </div>
                    </div>
                  </div>
                  
                  {activeDay === index && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                       <div className="mb-4">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hook (Gancho)</h5>
                         <p className="text-indigo-900 font-medium italic bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">"{day.hook_abertura}"</p>
                       </div>
                       
                       <div className="mb-4">
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Roteiro</h5>
                         <ul className="space-y-2">
                           {day.topicos_roteiro.map((topic, i) => (
                             <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                               <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                               {topic}
                             </li>
                           ))}
                         </ul>
                       </div>
                       
                       <div>
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">CTA</h5>
                         <p className="text-slate-800 font-medium text-sm">{day.cta_sugerida}</p>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar / Bonus Ideas */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Ideias Bônus
                </h3>
                <div className="space-y-4">
                  {result.ideias_bonus.map((idea, i) => (
                    <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <h4 className="font-bold text-amber-900 text-sm mb-1">{idea.titulo}</h4>
                      <p className="text-amber-800/80 text-xs leading-relaxed">{idea.descricao}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button onClick={onBack} className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm">
                    Voltar para Meus Projetos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100 px-4 py-4 sticky top-0 bg-white/90 backdrop-blur z-20">
        <div className="max-w-xl mx-auto flex items-center gap-4">
           <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100">
             <ArrowLeft className="h-5 w-5" />
           </button>
           <h1 className="font-bold text-lg text-slate-900">Novo Projeto</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Sobre você</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Qual seu nicho?</label>
              <input
                required
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                placeholder="Ex: Finanças para jovens, Marketing para barbeiros..."
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nível do público</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={inputClassName}
              >
                <option value="Iniciante">Iniciante (Conceitos básicos)</option>
                <option value="Intermediário">Intermediário (Prática)</option>
                <option value="Avançado">Avançado (Técnico e profundo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Objetivo principal (30 dias)</label>
              <input
                required
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="Ex: Vender mentoria, crescer seguidores..."
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Formato</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Plataforma principal</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className={inputClassName}
              >
                <option value="Instagram Reels">Instagram (Reels + Feed)</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="YouTube Longo">YouTube (Vídeos Longos)</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Multiplataforma">Multiplataforma (Adaptável)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Posts/semana</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tom de voz</label>
                <input
                   name="tone"
                   value={formData.tone}
                   onChange={handleChange}
                   placeholder="Ex: Motivacional"
                   className={inputClassName}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              {loading ? 'Gerando Plano...' : 'Gerar Calendário Mágico'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              A IA pode levar até 30 segundos para criar toda a estratégia.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Generator;