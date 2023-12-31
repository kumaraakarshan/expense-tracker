const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'node-complete'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

// API endpoint to get all expenses
app.get('/api/get-expenses', (req, res) => {
  const sql = 'SELECT * FROM expense';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching expenses: ' + err.message);
      res.status(500).json({ error: 'An error occurred while fetching expenses.' });
      return;
    }

    res.json(results); // Send the retrieved expenses as a JSON response
  });
});

// API endpoint to save form data
app.post('/api/save-data', (req, res) => {
  const { amount, description, category } = req.body;

  const sql = 'INSERT INTO expense (amount, description, category ) VALUES (?, ?, ?)';
  db.query(sql, [amount, description, category ], (err, result) => {
    if (err) {
      console.error('Error saving data: ' + err.message);
      res.status(500).json({ error: 'An error occurred while saving data.' });
      return;
    }
    res.json({ message: 'Data saved successfully.' });
  });
});

// API endpoint to delete a expense by ID
app.delete('/api/delete-expense/:id', (req, res) => {
  const expenseId = req.params.id;

  const sql = 'DELETE FROM expense WHERE id = ?';
  db.query(sql, [expenseId], (err, result) => {
    if (err) {
      console.error('Error deleting expense: ' + err.message);
      res.status(500).json({ error: 'An error occurred while deleting expense.' });
      return;
    }

    res.json({ message: 'expense deleted successfully.' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
