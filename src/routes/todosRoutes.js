const express = require('express');
const router = express.Router();

// In-memory todos array
let todos = [];
let nextId = 1;

// Validation middleware
const validateTodo = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ 
      error: 'Title is required and must be a non-empty string' 
    });
  }
  
  next();
};

// GET all todos
router.get('/', (req, res) => {
  try {
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
});

// GET a single todo by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todo' });
  }
});

// CREATE a new todo
router.post('/', validateTodo, (req, res) => {
  try {
    const { title, completed = false } = req.body;
    
    const newTodo = {
      id: nextId++,
      title: title.trim(),
      completed,
      createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// UPDATE a todo
router.put('/:id', validateTodo, (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo = todos.find(t => t.id === parseInt(id));
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.title = title.trim();
    if (completed !== undefined) {
      todo.completed = completed;
    }
    todo.updatedAt = new Date().toISOString();
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE a todo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const deletedTodo = todos.splice(index, 1);
    res.json(deletedTodo[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
