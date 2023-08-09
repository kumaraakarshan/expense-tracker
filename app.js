const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));



// API endpoint to save form data
app.get('/api/get-expenses', async (req, res) => {
    try {
      const connection = await db.getConnection();
      const [rows, fields] =await connection.query('SELECT * FROM expense');
      connection.release(); // Release the connection back to the pool
      console.log(res.data);
      
      res.json(rows); // Send the retrieved expenses as a JSON response
    } catch (err) {
      console.error('Error fetching expenses: ' + err.message);
      res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
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
      console.log(message);
    });
  });
  
app.post('/api/save-data', (req, res) => {
  const { amount,description,category } = req.body;
console.log(amount);

  const sql = 'INSERT INTO expense (amount,description,category) VALUES (?, ?, ?)';
  db.query(sql, [amount,description,category], (err, result) => {
    if (err) {
      console.error('Error saving data: ' + err.message);
      res.status(500).json({ error: 'An error occurred while saving data.' });
      return;
    }
    
    res.json({ message: 'Data saved successfully.' });
    console.log(message);
  });
});

app.listen(3000)
