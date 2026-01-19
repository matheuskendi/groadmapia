import React, { useEffect, useState } from 'react';
import { Plus, Settings, LogOut, Clock, Search, Trash2, FolderOpen, X, Loader2, User as UserIcon } from 'lucide-react';
import { User, SavedProject } from '../types';
import { dbService } from '../services/dbService';

interface DashboardProps {
  user: User;
  onCreateNew: () => void;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
  onOpenProject: (project: SavedProject) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onCreateNew, onLogout, onOpenProject }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const userProjects = await dbService.getUserProjects(user.id);
        setProjects(userProjects);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    loadProjects();
  }, [user.id]); 

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      await dbService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(date);
  };

  const searchInputClassName = "w-full md:w-96 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
              CreatorPlanner AI
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-slate-600">
                Olá, <strong>{user.name.split(' ')[0]}</strong>
              </span>

              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Minha Conta"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <button 
                onClick={onLogout}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 ml-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Meus Projetos</h1>
            <p className="text-slate-500">Gerencie seus calendários e roteiros.</p>
          </div>
          <button 
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5" />
            Novo Calendário
          </button>
        </div>

        {/* Filters/Search Bar */}
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar projetos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={searchInputClassName}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create New Card */}
          <div 
            onClick={onCreateNew}
            className="group flex flex-col items-center justify-center h-48 bg-white border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
              <Plus className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <span className="font-semibold text-slate-500 group-hover:text-indigo-600">Criar novo projeto</span>
          </div>

          {/* Loading State */}
          {loadingProjects && (
            <div className="col-span-1 md:col-span-2 flex items-center justify-center h-48 text-slate-400 gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Carregando projetos...</span>
            </div>
          )}

          {/* User Projects List */}
          {!loadingProjects && filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => onOpenProject(project)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-48 cursor-pointer relative group"
            >
              
              <button 
                onClick={(e) => handleDelete(e, project.id)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Excluir projeto"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div>
                <div className="flex items-center justify-between mb-4 pr-6">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase truncate max-w-[120px] ${
                    project.platform.includes('Instagram') ? 'bg-purple-100 text-purple-700' :
                    project.platform.includes('YouTube') ? 'bg-red-100 text-red-700' :
                    project.platform.includes('TikTok') ? 'bg-slate-800 text-white' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {project.platform}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{project.niche}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{project.planData.resumo_estrategia}</p>
              </div>
              <div className="flex items-center text-xs text-slate-400 gap-1 pt-4 border-t border-slate-50">
                <Clock className="h-3 w-3" />
                Criado em {formatDate(project.createdAt)}
              </div>
            </div>
          ))}

          {!loadingProjects && filteredProjects.length === 0 && searchTerm && (
            <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
              <FolderOpen className="h-12 w-12 text-slate-300 mb-2" />
              <p>Nenhum projeto encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Settings Modal - Simplified for Account Info only */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-indigo-600" />
                Minha Conta
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
                  <p className="text-slate-500 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-500">
                  <p>ID da Conta: <span className="font-mono text-slate-700">{user.id}</span></p>
                  <p className="mt-1">Membro desde: {formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;