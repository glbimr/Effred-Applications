import { GoogleGenAI } from "@google/genai";
import { JobRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCoverLetterDraft = async (
  fullName: string,
  role: JobRole,
  experience: string
): Promise<string> => {
  try {
    const prompt = `
      Write a professional, concise, and engaging cover letter for a ${role} internship position at Effred Technologies.
      
      Candidate Name: ${fullName}
      Key Experience/Skills: ${experience}
      
      Tone: Enthusiastic, professional, innovative.
      Length: Short (approx 150 words).
      Structure:
      1. Introduction.
      2. Why I'm a good fit based on skills.
      3. Closing.
      
      Do not include placeholders like "[Your Name]" if possible, use the provided name.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate draft.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
};