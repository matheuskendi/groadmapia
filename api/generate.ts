import { GoogleGenAI } from "@google/genai";

// Removemos 'edge' runtime para garantir compatibilidade total com node_modules na Vercel
// export const config = { runtime: 'edge' };

export default async function handler(req: any, res: any) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { request, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API Key não fornecida' });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const SYSTEM_INSTRUCTION = `
    Você é um planner de conteúdo e roteirista especializado em vídeos curtos e longos para criadores de conteúdo.
    Sua função é pegar poucas informações sobre o criador e entregar um plano de conteúdo completo em formato estruturado.

    REGRAS GERAIS:
    Escreva sempre em português brasileiro.
    Foque em ideias que atraem audiência e ajudam a vender.
    Nunca copie conteúdo.
    Priorize títulos com gancho forte.

    SAÍDA (OBRIGATÓRIO SEMPRE EM JSON VÁLIDO):
    Retorne SEMPRE um JSON exatamente neste formato:
    {
      "resumo_estrategia": "string",
      "calendario": [
        {
          "dia": "Dia 1",
          "plataforma": "string",
          "tipo_conteudo": "video_curto | video_longo | live | carrossel",
          "titulo": "string",
          "hook_abertura": "string",
          "topicos_roteiro": ["string"],
          "cta_sugerida": "string",
          "objetivo_da_peca": "engajamento | autoridade | venda | bastidores"
        }
      ],
      "ideias_bonus": [{"titulo": "string", "descricao": "string"}]
    }
    `;

    const prompt = `
      Gere um plano de conteúdo com base nestes dados:
      nicho: ${request.niche}
      objetivo_principal: ${request.objective}
      plataforma_principal: ${request.platform}
      frequencia_semana: ${request.frequency}
      nivel_publico: ${request.level}
      tom_de_voz: ${request.tone}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Usando modelo estável disponível
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    // Extrai o texto JSON da resposta
    const text = response.text;
    
    // Tenta parsear para garantir que é JSON válido antes de enviar
    let jsonResponse;
    try {
      if (text) {
        jsonResponse = JSON.parse(text);
      } else {
         throw new Error("Resposta vazia da IA");
      }
    } catch (e) {
      // Se falhar o parse, envia um erro legível
      return res.status(500).json({ error: "A IA não retornou um JSON válido. Tente novamente." });
    }

    return res.status(200).json(jsonResponse);

  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message || "Erro interno ao gerar conteúdo" });
  }
}