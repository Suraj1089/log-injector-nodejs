// index.js (Log Ingestor)

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const DB_URL="mongodb+srv://ghadgerasika16:Rasika123@cluster0.0fnjyu2.mongodb.net/AIInterviewer?retryWrites=true&w=majority"

mongoose.connect(DB_URL);

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String
  }
});

const Log = mongoose.model('Log', logSchema);

app.post('/logs', async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).send('Log successfully ingested.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// render the index.html page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Log Ingestor listening at http://localhost:${port}`);
});
