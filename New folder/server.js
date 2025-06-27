const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const SCORE_FILE = './scores.json';

let scores = [];
if (fs.existsSync(SCORE_FILE)) {
  scores = JSON.parse(fs.readFileSync(SCORE_FILE));
}

app.get('/highscore', (req, res) => {
  const maxScore = scores.length ? Math.max(...scores) : 0;
  res.json({ highscore: maxScore });
});

app.post('/score', (req, res) => {
  const { score } = req.body;
  if (typeof score === 'number') {
    scores.push(score);
    fs.writeFileSync(SCORE_FILE, JSON.stringify(scores));
    res.json({ message: 'Score saved' });
  } else {
    res.status(400).json({ error: 'Invalid score' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
