import { ContentPlanRequest, ContentPlanResponse } from "../types";

export const generateContentPlan = async (request: ContentPlanRequest, apiKey: string): Promise<ContentPlanResponse> => {
  if (!apiKey) {
    throw new Error("API Key não fornecida. Configure sua chave nas configurações.");
  }

  try {
    // Chamada para o Back-end seguro na Vercel
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request, apiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao conectar com o servidor de IA.");
    }

    const data = await response.json() as ContentPlanResponse;
    return data;

  } catch (error: any) {
    console.error("Error generating content plan:", error);
    throw new Error(error.message || "Falha ao gerar o plano.");
  }
};