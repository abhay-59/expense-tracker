import dotenv from 'dotenv';
dotenv.config();
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseReceiptWithGemini(filePath) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const ext = path.extname(filePath).toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === ".pdf") {
        mimeType = "application/pdf";
    }

    const imageBuffer = fs.readFileSync(filePath);
    const imagePart = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType
        },
    };

    const prompt = `Extract a list of transactions in JSON (without markdown). Each should have:
  - type: "expense"
  - amount
  - category: (food, fuel, misc, shopping, travel, salary, other)
  - description`;

    const result = await model.generateContent([prompt, imagePart]);
    let text = result.response.text();
    // console.log("Gemini response:", text);

    text = text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
}
