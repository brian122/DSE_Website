require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Tableau Connected App (Direct Trust) — secrets come from env vars only
const TABLEAU_USER = process.env.TABLEAU_USER || 'b.king@salesforce.com';

app.use(express.static(path.join(__dirname)));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/tableau-token', (_req, res) => {
  const { TABLEAU_CLIENT_ID, TABLEAU_SECRET_ID, TABLEAU_SECRET_VALUE } = process.env;
  if (!TABLEAU_CLIENT_ID || !TABLEAU_SECRET_ID || !TABLEAU_SECRET_VALUE) {
    return res.status(503).json({ error: 'Tableau connected app is not configured' });
  }

  const token = jwt.sign(
    {
      iss: TABLEAU_CLIENT_ID,
      sub: TABLEAU_USER,
      aud: 'tableau',
      jti: crypto.randomUUID(),
      scp: ['tableau:views:embed']
    },
    TABLEAU_SECRET_VALUE,
    {
      algorithm: 'HS256',
      expiresIn: '5m',
      header: { kid: TABLEAU_SECRET_ID, iss: TABLEAU_CLIENT_ID }
    }
  );

  res.set('Cache-Control', 'no-store');
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
