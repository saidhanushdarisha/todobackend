const axios = require('axios');
const Todo = require('../models/Todo');

exports.summarizeTodos = async (req, res) => {
  const cohereApiKey = process.env.COHERE_API_KEY;
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!cohereApiKey || !slackWebhookUrl) {
    return res.status(500).json({ error: 'Missing LLM or Slack configuration' });
  }

  try {
    const todos = await Todo.find({ completed: false });
    if (todos.length === 0) {
      return res.status(400).json({ message: 'No pending todos to summarize' });
    }

    const prompt = `Summarize these todos:\n${todos.map(t => `- ${t.text}`).join('\n')}`;

    const cohereResponse = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt,
        max_tokens: 100,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const summary = cohereResponse.data.generations[0].text.trim();
    await axios.post(slackWebhookUrl, { text: summary });

    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary or send to Slack' });
  }
};
