const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');
// Essential Middleware to read JSON body
app.use(express.json());

// Main Route link
app.use('/api/tasks', taskRoutes);

// Simple Welcome Route to check if server is working
app.get('/', (req, res) => {
    res.send("Backend server is running perfectly!");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});