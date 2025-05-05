const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const cors =require('cors')
const app = express();
const PORT = 3000;
app.use(cors())
app.use(express.json());

app.post('/generate-story', async (req, res) => {
  const userPrompt = req.body.prompt || 'Tell me a 250 word story.';

  try {
    const response = await axios.post(
      'https://llm.chutes.ai/v1/chat/completions',
      {
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        stream: false,
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHUTES_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to generate story',
      error: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
