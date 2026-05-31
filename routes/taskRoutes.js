const express = require('express');
const router = express.Router();

// Temporary array to store tasks in memory
let tasks = [];

// POST Route to create a task
// Path here is '/' because '/api/tasks' is handled by server.js
router.post('/', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: "Please provide title and description" });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        createdAt: new Date()
    };

    tasks.push(newTask);
    
    // Sending success response back to Thunder Client
    res.status(201).json({
        message: "Task created successfully!",
        task: newTask
    });
});

// Optional: GET Route to see all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

module.exports = router;