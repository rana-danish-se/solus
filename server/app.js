// server/app.js placeholder
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
