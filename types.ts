export interface ContentPlanRequest {
  niche: string;
  objective: string;
  platform: string;
  frequency: number;
  level: string;
  tone: string;
}

export interface CalendarDay {
  dia: string;
  plataforma: string;
  tipo_conteudo: string;
  titulo: string;
  hook_abertura: string;
  topicos_roteiro: string[];
  cta_sugerida: string;
  objetivo_da_peca: string;
}

export interface BonusIdea {
  titulo: string;
  descricao: string;
}

export interface ContentPlanResponse {
  resumo_estrategia: string;
  calendario: CalendarDay[];
  ideias_bonus: BonusIdea[];
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
}

export type AuthMode = 'LOGIN' | 'SIGNUP';

// Novos tipos para o Banco de Dados
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção, nunca salve senhas em texto puro!
  apiKey?: string; // Chave da API do usuário (opcional)
  createdAt: string;
}

export interface SavedProject {
  id: string;
  userId: string;
  title: string;
  niche: string;
  platform: string;
  createdAt: string;
  planData: ContentPlanResponse;
}