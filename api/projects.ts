import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // GET: Listar Projetos
    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "User ID required" });

      const rows = await sql`
        SELECT * FROM projects WHERE user_id = ${userId} ORDER BY created_at DESC
      `;
      
      const projects = rows.map((row: any) => {
        // Correção de segurança: Garantir que plan_data seja um objeto JSON válido
        let planData = row.plan_data;
        if (typeof planData === 'string') {
          try {
            planData = JSON.parse(planData);
          } catch (e) {
            console.error("Erro ao fazer parse de plan_data", e);
            planData = null; 
          }
        }

        return {
          id: row.id,
          userId: row.user_id,
          title: row.title,
          niche: row.niche,
          platform: row.platform,
          createdAt: row.created_at,
          planData: planData
        };
      });

      return res.status(200).json(projects);
    }

    // POST: Salvar Projeto
    if (req.method === 'POST') {
      const { userId, requestData, planData } = req.body;
      const id = randomUUID();
      const title = `${requestData.niche} - ${requestData.platform}`;

      // Envia o objeto diretamente para o driver tratar a conversão para JSONB
      // Ou stringify se necessário, mas o parse no GET garante a leitura correta
      await sql`
         INSERT INTO projects (id, user_id, title, niche, platform, plan_data, created_at)
         VALUES (${id}, ${userId}, ${title}, ${requestData.niche}, ${requestData.platform}, ${JSON.stringify(planData)}, NOW())
       `;

      return res.status(200).json({
         id,
         userId,
         title,
         niche: requestData.niche,
         platform: requestData.platform,
         createdAt: new Date().toISOString(),
         planData
       });
    }

    // DELETE: Apagar Projeto
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Project ID required" });

      await sql`DELETE FROM projects WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

  } catch (error: any) {
    console.error("Projects API Error:", error);
    return res.status(500).json({ error: "Erro ao processar projetos" });
  }
}
