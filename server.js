
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv')

dotenv.config()
const DB_URL = process.env.DB_URL;
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

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint for searching logs
app.post('/search', async (req, res) => {
    console.log("search logs");
    try {
        const { level, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId } = req.body;

        // Build a query object based on the provided search criteria
        const query = {};
        if (level) query.level = level;
        if (message) query.message = message;
        if (resourceId) query.resourceId = resourceId;
        if (timestamp) query.timestamp = timestamp;
        if (traceId) query.traceId = traceId;
        if (spanId) query.spanId = spanId;
        if (commit) query.commit = commit;
        if (parentResourceId) query['metadata.parentResourceId'] = parentResourceId;

        // Search for logs based on the query
        const searchResults = await Log.find(query);
        console.log(searchResults)

        // Check if no results were found
        if (searchResults.length === 0) {
            return res.json({ success: true, message: 'No results found' });
        }

        // Send the search results to the client
        res.json({ success: true, results: searchResults });
    } catch (error) {
        console.error('Error searching')
    }
}
)
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('newLog', async (log) => {
        console.log('Received new log:', log);
        const logs = new Log(log);
        await logs.save();
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
