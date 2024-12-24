import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_KEY');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phoneNumber, countryCode, otp } = req.body;

  if (!phoneNumber || !countryCode || !otp) {
    return res.status(400).json({ error: "Country code, phone number, and OTP are required." });
  }

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  try {
    // Fetch the most recent OTP from Supabase
    const { data, error } = await supabase
      .from("otps")
      .select("otp, created_at")
      .eq("phone_number", fullPhoneNumber)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("❌ Error fetching OTP:", error.message);
      return res.status(500).json({ error: "Failed to verify OTP. Try again later." });
    }

    if (!data || data.otp !== otp) {
      console.error("❌ Invalid OTP:", { receivedOtp: otp, expectedOtp: data?.otp });
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    // Delete all OTPs for this phone number after successful verification
    await supabase
      .from("otps")
      .delete()
      .eq("phone_number", fullPhoneNumber);

    console.log("✅ OTP Verified Successfully");
    return res.status(200).json({ success: true, message: "OTP Verified Successfully!" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}