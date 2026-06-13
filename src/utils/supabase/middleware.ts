import { createServerClient } from '@supabase/ssr';
import type { Request, Response, NextFunction } from 'express';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

export const refreshSupabaseSession = async (req: Request, res: Response, next: NextFunction) => {
  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return req.headers.cookie ? req.headers.cookie.split(';').map((cookie) => {
          const [name, ...rest] = cookie.trim().split('=');
          return { name, value: rest.join('=') };
        }) : [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieValue = `${name}=${value}; Path=${options?.path || '/'}; ${options?.maxAge ? `Max-Age=${options.maxAge};` : ''} ${options?.httpOnly ? 'HttpOnly;' : ''} ${options?.sameSite ? `SameSite=${options.sameSite};` : ''} ${options?.secure ? 'Secure;' : ''}`.trim();
          res.setHeader('Set-Cookie', [res.getHeader('Set-Cookie'), cookieValue].filter(Boolean) as string[]);
        });
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  (req as any).supabase = supabase;
  (req as any).session = session;
  next();
};
