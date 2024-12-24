import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_KEY');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TEMPLATE_NAME = "otp";
const LANGUAGE_CODE = "en_US";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phoneNumber, countryCode } = req.body;

  if (!phoneNumber || !countryCode) {
    return res.status(400).json({ error: "Phone number and country code are required." });
  }

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;
  const OTP_CODE = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Insert new OTP with timestamp
    const { error: saveError } = await supabase
      .from("otps")
      .insert([{ 
        phone_number: fullPhoneNumber, 
        otp: OTP_CODE,
        created_at: new Date().toISOString()
      }]);

    if (saveError) {
      console.error("❌ Supabase Error:", saveError.message);
      return res.status(500).json({ error: "Failed to store OTP." });
    }

    // Prepare WhatsApp Cloud API payload
    const payload = {
      messaging_product: "whatsapp",
      to: fullPhoneNumber,
      type: "template",
      template: {
        name: TEMPLATE_NAME,
        language: { code: LANGUAGE_CODE },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: OTP_CODE }],
          },
          {
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [{ type: "text", text: OTP_CODE }],
          },
        ],
      },
    };

    const response = await fetch(`https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ WhatsApp API Error:", result);
      return res.status(500).json({ error: result.error.message || "Failed to send OTP." });
    }

    console.log(`✅ OTP Sent Successfully: ${OTP_CODE}`);
    return res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}