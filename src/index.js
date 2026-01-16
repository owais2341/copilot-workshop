// Create an Express server on port 3000 with GET / returning {status:"ok"} and a /health endpoint.

const express = require('express');
const todosRoutes = require('./routes/todosRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Mount todos CRUD routes
app.use('/api/todos', todosRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

