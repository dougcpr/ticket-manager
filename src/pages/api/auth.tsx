import {supabase} from "@/lib/supabaseClient";

export default async function handler(req, res) {
  supabase.auth.api.setAuthCookie(req, res)
}