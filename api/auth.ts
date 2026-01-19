import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function handler(req: any, res: any) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Pega a URL do banco das variáveis de ambiente da Vercel
  const sql = neon(process.env.DATABASE_URL!);

  const { action, name, email, password } = req.body;

  try {
    // 1. SIGNUP
    if (action === 'signup') {
      const passwordHash = await bcrypt.hash(password, 10);
      const id = randomUUID();
      
      try {
        const result = await sql`
          INSERT INTO users (id, name, email, password, created_at)
          VALUES (${id}, ${name}, ${email}, ${passwordHash}, NOW())
          RETURNING id, name, email, created_at
        `;
        const user = result[0];
        return res.status(200).json({ 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          createdAt: user.created_at 
        });
      } catch (e: any) {
        if (e.code === '23505') return res.status(400).json({ error: "E-mail já cadastrado." });
        throw e;
      }
    }

    // 2. LOGIN
    if (action === 'login') {
      const result = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (result.length === 0) return res.status(401).json({ error: "E-mail ou senha incorretos." });

      const user = result[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return res.status(401).json({ error: "E-mail ou senha incorretos." });

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      });
    }

    return res.status(400).json({ error: "Action not supported" });

  } catch (error: any) {
    console.error("Auth Error:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}