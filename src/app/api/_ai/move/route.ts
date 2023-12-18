import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSearchParams } from 'next/navigation';

const api = String(process.env.GOOGLE_API_KEY);

const genAI = new GoogleGenerativeAI(api);

export async function POST(request: Request) {
  const gameRules = `
  This is a Connect 4 game.
  1. The game is played on a grid that's 6 cells by 7 cells.
  2. Two players take turns.
  3. The pieces fall straight down, occupying the lowest available space within the column.
  4. The objective of the game is to connect four of one's own discs of the same color next to each other vertically, horizontally, or diagonally before your opponent.
  5. The game ends in a tie if the entire board is filled with discs and no player has won.

  You are playing as Yellow and your opponent is Red. Suggest the next move in this format: y (just the number of the column).
  `


  const { grid } = await request.json()

  const prompt = grid + gameRules;

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'No prompt provided' }));
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return new Response(JSON.stringify({ move: text }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }));
  }
}
