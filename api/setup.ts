import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Criar tabela de Usuários
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        api_key TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar tabela de Projetos
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        title TEXT NOT NULL,
        niche TEXT NOT NULL,
        platform TEXT NOT NULL,
        plan_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar tabela de Planos
    await sql`
      CREATE TABLE IF NOT EXISTS plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,  -- 'Grátis', 'Pro', 'Max'
        price DECIMAL(10,2) NOT NULL,  -- 0.00, 29.90, 99.90
        currency TEXT DEFAULT 'BRL',
        interval_months INTEGER DEFAULT 1,
        features JSONB,  -- ["ilimitado", "IA avançada"]
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;
    // Tabela de Assinaturas (vincula user + plano + Mercado Pago)
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        plan_id TEXT REFERENCES plans(id),
        mp_preapproval_plan_id TEXT,  -- ID do plano no MP
        status TEXT NOT NULL,  -- 'active', 'pending', 'cancelled'
        start_date TIMESTAMP WITH TIME ZONE,
        next_billing_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  ) 
`;

    return res.status(200).json({ message: "Database configured successfully" });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return res.status(500).json({ error: error.message });
  }
}