import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PASSPORT_PROMPT = `Extract passport details in exact JSON format:
{
  "type": "P",
  "country": "issuing country",
  "passport_number": "passport number",
  "surname": "last name",
  "given_name": "first name",
  "middle_name": "middle name if any",
  "date_of_birth": "DD MMM YYYY",
  "nationality": "nationality",
  "place_of_birth": "city/state",
  "date_of_issue": "DD MMM YYYY",
  "date_of_expiry": "DD MMM YYYY",
  "issuing_authority": "authority name",
  "gender": "M/F"
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image } = req.body;
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: PASSPORT_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "high"
            }
          }
        ]
      }],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    const data = content ? JSON.parse(content) : null;

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'OCR failed' 
    });
  }
}
