import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, skillPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Build system prompt
  const systemPrompt = skillPrompt 
    ? skillPrompt 
    : '你是 AIBP 平台的 HR AI 问答助手。你精通招聘面试、试用期考核、绩效反馈、组织调整、培训体系等 HR 专业领域。回答要专业、具体、有实操性，用中文回答。';

  // Build OpenAI-compatible request
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))
  ];

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: apiMessages,
        max_tokens: 2048,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Deepseek API error:', response.status, errorData);
      return res.status(response.status).json({ error: `API error: ${response.status}` });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '抱歉，AI 暂时无法回答。';

    return res.status(200).json({ content });
  } catch (error: any) {
    console.error('Error calling Deepseek:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}