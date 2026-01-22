import { neon } from '@neondatabase/serverless';  // Conexão com banco Neon Postgres
import { randomUUID } from 'crypto'          // Gera IDs únicos para cada plano
import type { NextApiRequest, NextApiResponse } from 'next';  // Tipos TypeScript do Next.js

// Define o formato da resposta que o endpoint vai retornar
type Response = {
    message: string;
    plans?: Array<{id: string; name: string; price: number}>  // Lista dos planos criados (opcional)
} | { error: string };  // OU erro caso algo dê errado

export default async function handler(
    req: NextApiRequest,      // Requisição que chega (POST do Postman/curl)
    res: NextApiResponse<Response>  // Resposta que enviamos de volta
) {
    // 🔒 SEGURANÇA: Só aceita método POST, rejeita GET/PUT/etc
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Use POST' });
    }

    try {
        // 1️⃣ Conecta no banco Neon usando DATABASE_URL do .env
        const sql = neon(process.env.DATABASE_URL!);

        // 2️⃣ VERIFICA SE PLANOS JÁ EXISTEM (evita duplicatas)
        const result = await sql`SELECT COUNT(*) as count FROM plans`;
        const count = (result as any[])[0].count as number;
        console.log(`📊 Planos existentes: ${count}`);

        // Se já tem planos, não faz nada (evita bagunça)
        if (count > 0) {
            return res.status(200).json({
                message: `✅ Planos já existem (${count} registros)!`
            });
        }

        // 3️⃣ GERA 4 IDs ÚNICOS para cada plano (TEXT como PRIMARY KEY)
        const idGratis = randomUUID();
        const idPlus = randomUUID();
        const idPro = randomUUID();
        const idMax = randomUUID();

        await sql`

            INSERT INTO plans (id, name, price, currency, features, interval_months) VALUES
                                                                                         
            (${idGratis}, 'Grátis', 0.00, 'BRL', 
             '["2 roteiros/semana", "1 template", "básico"]'::jsonb, 1),
             
            (${idPro}, 'Pro', 49.90, 'BRL', 
             '["50 roteiros/mês", "templates ilimitados", "IA básica"]'::jsonb, 1),
             
            (${idPlus}, 'Plus', 79.90, 'BRL', 
             '["ilimitado", "IA avançada", "tone de voz", "export SRT/JSON"]'::jsonb, 1),
             
            (${idMax}, 'Max', 99.90, 'BRL', 
            '["ilimitado", "tudo + colaboração", "API", "suporte 24h"]'::jsonb, 1)
        `;

        // 5️⃣ Retorna confirmação + IDs dos planos criados
        res.status(200).json({
            message: '🎉 Planos inseridos com sucesso!',
            plans: [
                { id: idGratis, name: 'Grátis', price: 0 },
                { id: idPro, name: 'Pro', price: 49.90 },
                { id: idPlus, name: 'Pro', price: 79.90 },
                { id: idMax, name: 'Max', price: 99.90 }
            ]
        });

    } catch (error: any) {
        // 🐛 TRATA ERROS (ex: tabela não existe, conexão falhou)
        console.error('❌ Erro ao inserir planos:', error);
        res.status(500).json({ error: error.message });
    }
}
