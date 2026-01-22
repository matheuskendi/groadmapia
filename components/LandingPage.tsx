import React from 'react';
import { Play, CheckCircle, Calendar, FileText, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { AuthMode } from '../types';

interface LandingPageProps {
  onAuth: (mode: AuthMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CreatorPlanner AI</span>
            </div>
            <button 
              onClick={() => onAuth('LOGIN')}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
          Novo: Geração com IA 2.0
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Gere 1 mês de ideias e roteiros <br className="hidden md:block" />
          <span className="text-indigo-600">em 60 segundos</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Planejador de conteúdo com IA para criadores que querem postar todo dia sem travar na ideia ou no roteiro.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={() => onAuth('SIGNUP')}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Play className="h-5 w-5 fill-current" />
            Testar grátis por 7 dias
          </button>
          <p className="text-sm text-slate-400">
            Sem cartão na criação de conta · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Para criadores que já sabem que precisam postar, <br />
              <span className="text-slate-500">mas não conseguem manter o ritmo</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Você abre o app de gravação e não sabe o que falar.",
              "Perde horas pensando em ideias e no fim não posta nada.",
              "Tem produto/serviço, mas não consegue transformar isso em conteúdo que vende.",
              "Quer parar de depender de agência/copywriter para cada vídeo."
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="mt-1 min-w-5">
                  <div className="h-5 w-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
                    <span className="text-red-500 text-xs font-bold">✕</span>
                  </div>
                </div>
                <p className="text-slate-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Como o planner com IA trabalha por você</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="h-8 w-8 text-indigo-600" />,
              title: "1. Informe seus dados",
              desc: "Informe seu nicho, objetivo e quantas vezes por semana você quer postar."
            },
            {
              icon: <Calendar className="h-8 w-8 text-indigo-600" />,
              title: "2. IA gera o plano",
              desc: "A IA gera um calendário de 30 dias com títulos, ganchos e tópicos de roteiro."
            },
            {
              icon: <FileText className="h-8 w-8 text-indigo-600" />,
              title: "3. Você grava",
              desc: "Você só abre a câmera, segue o roteiro e posta."
            }
          ].map((step, i) => (
            <div key={i} className="text-center p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all">
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
            <CheckCircle className="h-4 w-4" />
            Tudo em português, pensado para YouTube, Shorts, TikTok e Reels.
          </span>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Tudo o que o app entrega em segundos</h2>
            <ul className="space-y-6">
              {[
                "Calendário de 30 dias pronto, adaptado ao seu nicho.",
                "Títulos com gancho forte e focados em clique.",
                "Hooks de abertura para prender a atenção nos primeiros 3s.",
                "Roteiro em tópicos: é só seguir linha por linha.",
                "CTAs prontas para crescer seguidores e vendas.",
                "Espaço para salvar diferentes projetos."
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-indigo-400 shrink-0" />
                  <span className="text-slate-300 text-lg">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
            {/* Mockup visualization */}
            <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-700">
              <div className="h-2 w-20 bg-indigo-500 rounded mb-2"></div>
              <div className="h-6 w-3/4 bg-slate-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-800 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                <div className="h-3 w-4/6 bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 opacity-50">
               <div className="h-2 w-20 bg-slate-600 rounded mb-2"></div>
               <div className="h-6 w-1/2 bg-slate-700 rounded mb-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Escolha o plano ideal para seu momento</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">

          {/* Grátis */}
          <div className="group p-6 lg:p-8 rounded-3xl border border-slate-200 bg-white h-full flex flex-col hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Grátis</h3>
            <p className="text-slate-500 text-sm mb-6">Testador curioso</p>
            <div className="text-4xl font-bold text-slate-900 mb-8">R$ 0<span className="text-lg font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1 min-h-0 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 flex-shrink-0" />
                2 calendários de 7 dias/mês
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 flex-shrink-0" />
                Títulos + hooks + roteiro básico
              </li>
            </ul>
            <button
                onClick={() => onAuth('SIGNUP')}
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Testar grátis
            </button>
          </div>

          {/* Pro */}
          <div className="group p-6 lg:p-8 rounded-3xl border-2 border-indigo-600 bg-gradient-to-br from-indigo-50/50 to-white h-full flex flex-col relative shadow-xl hover:shadow-2xl transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Popular
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Criador Pro</h3>
            <p className="text-slate-500 text-sm mb-6">Criador individual</p>
            <div className="text-4xl font-bold text-slate-900 mb-8">R$ 39<span className="text-lg font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1 min-h-0 text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 flex-shrink-0" />
                Calendários ilimitados 30 dias
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 flex-shrink-0" />
                3 projetos salvos
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <CheckCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 flex-shrink-0" />
                Export básico
              </li>
            </ul>
            <button
                onClick={() => onAuth('SIGNUP')}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg transition-all"
            >
              Começar agora
            </button>
          </div>

          {/* Plus - Mais Popular */}
          <div className="group p-6 lg:p-8 rounded-3xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-50/50 to-white h-full flex flex-col relative shadow-xl hover:shadow-2xl transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Mais Popular
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Criador Plus</h3>
            <p className="text-slate-500 text-sm mb-6">Influencer pro</p>
            <div className="text-4xl font-bold text-slate-900 mb-8">R$ 69<span className="text-lg font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1 min-h-0 text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 flex-shrink-0" />
                Tudo do Pro + export Notion/Sheets
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 flex-shrink-0" />
                5 projetos + prioridade IA
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 flex-shrink-0" />
                Templates custom
              </li>
            </ul>
            <button
                onClick={() => onAuth('SIGNUP')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg transition-all"
            >
              Começar agora
            </button>
          </div>

          {/* Max */}
          <div className="group p-6 lg:p-8 rounded-3xl border border-slate-200 bg-white h-full flex flex-col hover:shadow-md transition-all">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Agência Max</h3>
            <p className="text-slate-500 text-sm mb-6">Equipes/agências</p>
            <div className="text-4xl font-bold text-slate-900 mb-8">R$ 99<span className="text-lg font-normal text-slate-500">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1 min-h-0 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-slate-900 shrink-0 mt-0.5 flex-shrink-0" />
                Tudo ilimitado + suporte 24h
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-slate-900 shrink-0 mt-0.5 flex-shrink-0" />
                Projetos ilimitados
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-slate-900 shrink-0 mt-0.5 flex-shrink-0" />
                White label & API
              </li>
              <li className="flex items-start gap-2 opacity-75">
                <CheckCircle className="h-4 w-4 text-slate-900 shrink-0 mt-0.5 flex-shrink-0" />
                Relatórios avançados
              </li>
            </ul>
            <button
                onClick={() => onAuth('SIGNUP')}
                className="w-full py-3 px-4 rounded-xl border-2 border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 transition-colors"
            >
              Assinar Max
            </button>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Feito por dev e criador que vive isso todo dia</h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Aplicativo criado por um desenvolvedor e criador de conteúdo que já passou pela dor de ter que pensar em roteiro todo dia enquanto estuda, trabalha e cuida da vida. A ideia é simples: tirar essa carga da sua cabeça, para você focar no que importa – aparecer, se comunicar e vender.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {[
            { q: "Preciso entender de marketing para usar?", a: "Não. Você só precisa saber o que vende e quem quer atingir. O app te faz perguntas simples e gera o plano para você seguir." },
            { q: "Funciona para qualquer nicho?", a: "Sim. De finanças a barbeiros, estudos, loja de roupa, estética, etc. Basta informar o nicho e objetivo." },
            { q: "E se eu não gostar?", a: "Você pode testar grátis. Se assinar e não curtir, é só cancelar, sem multa." }
          ].map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-900 bg-white hover:bg-slate-50 transition-colors"
                onClick={() => toggleFaq(i)}
              >
                {faq.q}
                {openFaq === i ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              {openFaq === i && (
                <div className="p-4 pt-0 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>&copy; 2024 CreatorPlanner AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;