export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, genre } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Формируем промпт в зависимости от жанра
    let systemPrompt = 'Ты - опытный рассказчик сказок. Создай увлекательную сказку для детей.';
    
    switch (genre) {
      case 'adventure':
        systemPrompt = 'Ты - опытный рассказчик приключенческих сказок. Создай захватывающую сказку о путешествиях и приключениях.';
        break;
      case 'fantasy':
        systemPrompt = 'Ты - опытный рассказчик фантастических сказок. Создай волшебную сказку с магией и чудесами.';
        break;
      case 'educational':
        systemPrompt = 'Ты - опытный рассказчик поучительных сказок. Создай сказку, которая учит добру и мудрости.';
        break;
      case 'funny':
        systemPrompt = 'Ты - опытный рассказчик смешных сказок. Создай веселую и забавную сказку.';
        break;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({ 
        error: 'OpenAI API error', 
        details: errorData 
      });
    }

    const data = await response.json();
    
    // Парсим ответ OpenAI
    const content = data.choices[0]?.message?.content || '';
    
    // Извлекаем заголовок и текст
    const lines = content.split('\n').filter(line => line.trim() !== '');
    let title = '';
    let text = '';
    
    let foundTitle = false;
    for (const line of lines) {
      if (!foundTitle && line.trim() !== '') {
        title = line.trim();
        foundTitle = true;
      } else if (foundTitle) {
        text += line + '\n';
      }
    }
    
    // Если заголовок не найден, берем первую строку
    if (title === '' && lines.length > 0) {
      title = lines[0].trim();
      text = lines.slice(1).join('\n');
    }

    res.status(200).json({
      success: true,
      data: {
        title: title,
        content: text.trim(),
        fullContent: content
      }
    });

  } catch (error) {
    console.error('API Gateway error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 