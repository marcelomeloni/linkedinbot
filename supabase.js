import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("🚨 Faltam as credenciais do Supabase no arquivo .env (SUPABASE_URL e a KEY).");
}


export const supabase = createClient(supabaseUrl, supabaseKey);