
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DATA_FILE = './data.json';

app.use(cors());
app.use(express.json());

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/items', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/items', (req, res) => {
  const data = readData();
  const newItem = req.body;
  newItem.id = Date.now();
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const data = readData();
  const index = data.findIndex(i => i.id === id);
  if (index !== -1) {
    data[index] = updatedItem;
    writeData(data);
    res.json(updatedItem);
  } else {
    res.status(404).send();
  }
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let data = readData();
  data = data.filter(i => i.id !== id);
  writeData(data);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

