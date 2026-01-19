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
    const { request } = req.body;

    // A chave agora deve ser uma chave da DeepSeek configurada na Vercel
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("ERRO CRÍTICO: API_KEY (DeepSeek) não configurada no ambiente do servidor.");
      return res.status(500).json({ error: 'Configuração de servidor ausente. Contate o suporte.' });
    }

    const SYSTEM_INSTRUCTION = `
    Você é um planner de conteúdo e roteirista especializado em vídeos curtos e longos para criadores de conteúdo.
    Sua função é pegar poucas informações sobre o criador e entregar um plano de conteúdo MENSAL (30 dias / 4 semanas) completo em formato estruturado.

    REGRAS GERAIS:
    Escreva sempre em português brasileiro.
    Foque em ideias que atraem audiência e ajudam a vender.
    Nunca copie conteúdo.
    Priorize títulos com gancho forte.
    Gere conteúdo suficiente para cobrir 4 semanas completas com base na frequência informada pelo usuário.

    SAÍDA (OBRIGATÓRIO SEMPRE EM JSON VÁLIDO):
    Você DEVE retornar APENAS um JSON válido, sem markdown (backticks) e sem texto antes ou depois.
    Formato exato:
    {
      "resumo_estrategia": "string",
      "calendario": [
        {
          "dia": "Semana X - Dia Y (ou Data sugerida)",
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

    const userPrompt = `
      Gere um plano de conteúdo COMPLETO PARA 30 DIAS (4 SEMANAS) com base nestes dados:
      nicho: ${request.niche}
      objetivo_principal: ${request.objective}
      plataforma_principal: ${request.platform}
      frequencia_semana: ${request.frequency} posts por semana (Total esperado: ${request.frequency * 4} posts)
      nivel_publico: ${request.level}
      tom_de_voz: ${request.tone}

      IMPORTANTE:
      1. Gere o planejamento para as 4 semanas completas.
      2. O array "calendario" deve conter aproximadamente ${request.frequency * 4} itens (posts).
      3. Organize o campo "dia" para indicar a sequência (ex: "Semana 1 - Post 1", "Semana 1 - Post 2", ..., "Semana 4 - Post X").
      4. Não pare na primeira semana. O usuário precisa do mês todo.
    `;

    // Chamada para API da DeepSeek (Compatível com OpenAI)
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 1.1, // DeepSeek recomenda temperatura um pouco mais alta para criatividade
        max_tokens: 4000 // Aumentado para garantir resposta longa (JSON de 30 dias pode ser grande)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API DeepSeek: ${response.status} - ${errorText}`);
    }

    const data: any = await response.json();
    const content = data.choices[0].message.content;

    // Limpeza AGRESSIVA de markdown/JSON fences
    const cleanJson = content
      .replace(/```(?:json)?[\s\S]*?```/gs, '')  // Remove ```json ... ```
      .replace(/```[\s\S]*?```/gs, '')          // Remove qualquer ```
      .trim();

    console.log('Raw DeepSeek response:', cleanJson.substring(0, 200));  // Log pra debug

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanJson);
      if (!jsonResponse.calendario || jsonResponse.calendario.length < 20) {
        throw new Error('JSON válido mas calendário incompleto');
      }
    } catch (e) {
      console.error('Parse fail - raw:', cleanJson);
      return res.status(500).json({ error: 'IA retornou inválido. Raw: ' + cleanJson.substring(0, 100) });
    }

    // Sucesso! Retorna o JSON da IA
    return res.status(200).json(jsonResponse);

  } catch (error: any) {
    console.error('Erro no handler:', error);
    return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
}
