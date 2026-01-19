import { User, SavedProject, ContentPlanResponse } from "../types";

// Helper para chamadas de API
const apiCall = async (endpoint: string, method: string, body?: any) => {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  
  try {
    const res = await fetch(endpoint, options);
    
    // Verifica se a resposta é JSON antes de tentar fazer o parse
    const contentType = res.headers.get("content-type");
    let data;
    
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await res.json();
    } else {
      // Se não for JSON (ex: HTML de erro da Vercel ou 404 local), trata como erro
      const text = await res.text();
      throw new Error(`Erro do servidor (${res.status}): A resposta não é válida. (Verifique se o Backend está rodando).`);
    }
    
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  } catch (error: any) {
    console.warn(`Falha na chamada API [${endpoint}]:`, error.message);
    throw error;
  }
};

export const dbService = {
  
  // --- Setup ---
  getNeonUrl: () => null,
  setNeonUrl: () => {},
  
  // Chama a API de setup para garantir que as tabelas existem
  testAndSetupNeon: async () => {
    try {
      await apiCall('/api/setup', 'POST');
      return true;
    } catch (error) {
      console.error("Falha ao configurar banco (Isso é normal se estiver rodando localmente sem Vercel CLI):", error);
      return false;
    }
  },

  // --- Autenticação ---

  signup: async (name: string, email: string, password: string): Promise<User> => {
    return apiCall('/api/auth', 'POST', { action: 'signup', name, email, password });
  },

  login: async (email: string, password: string): Promise<User> => {
    return apiCall('/api/auth', 'POST', { action: 'login', email, password });
  },

  // --- Projetos ---

  saveProject: async (userId: string, requestData: any, planData: ContentPlanResponse): Promise<SavedProject> => {
    return apiCall('/api/projects', 'POST', { userId, requestData, planData });
  },

  getUserProjects: async (userId: string): Promise<SavedProject[]> => {
    return apiCall(`/api/projects?userId=${userId}`, 'GET');
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await apiCall(`/api/projects?id=${projectId}`, 'DELETE');
  },

  // --- Fallback Local ---
  createBackup: () => "",
  restoreBackup: () => true
};