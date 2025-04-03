import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const GITHUB_CLIENT_ID = 'Ov23lidWLxrz4PKKh3nU';
const GITHUB_CLIENT_SECRET = '12496cc17299c18cb89dac9f79ffed555beb89b5';

app.post('/api/auth/github/callback', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: {
        Accept: 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
  });