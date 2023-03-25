import {supabase} from "@/lib/supabaseClient";

export default async function handler(req: any, res: any) {
  supabase.auth.api.setAuthCookie(req, res)
}