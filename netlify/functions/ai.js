// netlify/functions/ai.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Proxy to OpenAI (server-side). Expects OPENAI_API_KEY in env.
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt || '';
    const provider = body.provider || 'openai';

    // Basic completion call (OpenAI ChatCompletions example)
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 800 })
    });
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ provider: 'openai', data }) };
  } catch (err) {
    console.error('AI proxy error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
