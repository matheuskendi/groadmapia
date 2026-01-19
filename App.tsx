import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Generator from './components/Generator';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { AppView, AuthMode, User, SavedProject } from './types';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [authMode, setAuthMode] = useState<AuthMode>('SIGNUP');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);

  // Inicializar Banco de Dados com Timeout Absoluto
  useEffect(() => {
    let isMounted = true;

    const initDB = async () => {
      console.log("Iniciando app...");
      
      try {
        // Tenta conectar, mas desiste após 3 segundos
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
        
        await Promise.race([
          dbService.testAndSetupNeon(),
          timeout
        ]);
        
      } catch (e: any) {
        console.warn("Aviso de conexão:", e.message);
        if (isMounted) setConnectionError(true);
      } finally {
        // O finalmente garante que o loading SEMPRE vai sumir, independente do erro
        if (isMounted) {
          setIsDbReady(true);
        }
      }
    };

    initDB();
    return () => { isMounted = false; };
  }, []);

  // Verificar sessão salva
  useEffect(() => {
    const savedUser = localStorage.getItem('creator_planner_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView(AppView.DASHBOARD);
    }
  }, []);

  const handleAuthNavigation = (mode: AuthMode) => {
    setAuthMode(mode);
    setView(AppView.AUTH);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('creator_planner_session', JSON.stringify(user));
    setView(AppView.DASHBOARD);
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('creator_planner_session', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('creator_planner_session');
    setView(AppView.LANDING);
  };

  const handleOpenProject = (project: SavedProject) => {
    setSelectedProject(project);
    setView(AppView.GENERATOR);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setView(AppView.DASHBOARD);
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
           <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-slate-500 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {connectionError && view === AppView.LANDING && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 text-xs text-center font-medium border-b border-amber-200">
          Modo Offline/Demonstração (Conexão com servidor instável ou não configurada)
        </div>
      )}

      {view === AppView.LANDING && (
        <LandingPage onAuth={handleAuthNavigation} />
      )}
      
      {view === AppView.AUTH && (
        <Auth 
          initialMode={authMode} 
          onSuccess={handleLoginSuccess}
          onBack={() => setView(AppView.LANDING)}
        />
      )}

      {view === AppView.DASHBOARD && currentUser && (
        <Dashboard 
          user={currentUser}
          onCreateNew={() => { setSelectedProject(null); setView(AppView.GENERATOR); }}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
          onOpenProject={handleOpenProject}
        />
      )}

      {view === AppView.GENERATOR && currentUser && (
        <Generator 
          user={currentUser}
          onBack={handleBackToDashboard} 
          initialProject={selectedProject || undefined}
        />
      )}
    </>
  );
};

export default App;
