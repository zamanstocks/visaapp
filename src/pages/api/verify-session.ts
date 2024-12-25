import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing SUPABASE_KEY");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required." });
  }

  try {
    // Check if session token exists in Supabase
    const { data, error } = await supabase
      .from("sessions")
      .select("phone_number, name, created_at")
      .eq("token", token)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid session." });
    }

    return res.status(200).json({ success: true, user: data });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
