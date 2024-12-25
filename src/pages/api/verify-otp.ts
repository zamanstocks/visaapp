import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Missing SUPABASE_KEY");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phoneNumber, countryCode, otp, firstName } = req.body;

  if (!phoneNumber || !countryCode || !otp || !firstName) {
    return res.status(400).json({
      error: "Required fields missing",
    });
  }

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  try {
    // Verify OTP
    const { data, error } = await supabase
      .from("otps")
      .select("otp, created_at")
      .eq("phone_number", fullPhoneNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("❌ Error fetching OTP:", error.message);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }

    if (!data || data.otp !== otp) {
      console.error("❌ Invalid OTP:", { receivedOtp: otp, expectedOtp: data?.otp });
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Generate session token
    const sessionToken = uuidv4();

    // Delete existing OTPs
    await supabase
      .from("otps")
      .delete()
      .eq("phone_number", fullPhoneNumber);

    // Create or update session
    const { error: sessionError } = await supabase
      .from("sessions")
      .upsert({
        token: sessionToken,
        phone_number: fullPhoneNumber,
        name: firstName,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      });

    if (sessionError) {
      console.error("❌ Session Error:", sessionError.message);
      return res.status(500).json({ error: "Failed to create session" });
    }

    return res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        name: firstName,
        phone_number: fullPhoneNumber
      }
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}