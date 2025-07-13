export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST', 'OPTIONS']);
      return res.status(405).end('Method Not Allowed');
    }

    try {
      const { text, language } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'No API key' });

      const payload = {
        model: 'gpt-4o-mini-tts',
        input: text,
        voice: 'alloy',
        response_format: 'mp3',
      };

      const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!openaiRes.ok) {
        const error = await openaiRes.text();
        return res.status(openaiRes.status).send(error);
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Content-Type', 'audio/mpeg');

      const buffer = await openaiRes.arrayBuffer();
      res.status(200).send(Buffer.from(buffer));
    } catch (e) {
      res.status(500).json({ error: e.message || 'Unknown error' });
    }
  }