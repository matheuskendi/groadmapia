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

  const { action, name, email, password, userId, apiKey } = req.body;

  try {
    // 1. SIGNUP
    if (action === 'signup') {
      const passwordHash = await bcrypt.hash(password, 10);
      const id = randomUUID();
      
      try {
        const result = await sql`
          INSERT INTO users (id, name, email, password, created_at)
          VALUES (${id}, ${name}, ${email}, ${passwordHash}, NOW())
          RETURNING id, name, email, api_key, created_at
        `;
        const user = result[0];
        return res.status(200).json({ 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          apiKey: user.api_key || '', 
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
        apiKey: user.api_key || '',
        createdAt: user.created_at
      });
    }

    // 3. UPDATE USER (API KEY)
    if (action === 'update') {
      if (!userId) return res.status(400).json({ error: "User ID required" });
      
      await sql`UPDATE users SET api_key = ${apiKey} WHERE id = ${userId}`;
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Action not supported" });

  } catch (error: any) {
    console.error("Auth Error:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}