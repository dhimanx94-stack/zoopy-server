const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const systemPrompt = `
You are Zoopy, DigiVibe AI assistant.

Rules:
- Talk in Hindi / English / Hinglish based on user
- Ask business type first
- Ask what problem user is facing
- Suggest solution
- Convince why DigiVibe is best
- Push user to WhatsApp: 8377020052 for pricing
- Be smart, professional, slightly witty
- Keep replies short and impactful
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...(history || []),
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

   const reply = data?.choices?.[0]?.message?.content;

if(!reply){
  return res.json({
    reply: "⚠️ Zoopy busy hai, try again"
  });
}

res.json({ reply });

  } catch (err) {
    res.json({ reply: "⚠️ Server busy hai, try again." });
  }
});

app.listen(3000, () => console.log("🚀 Zoopy running"));
