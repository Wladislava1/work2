const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306, 
  user: 'root',             
  password: 'Wlada@2005', 
  database: 'task_db',     
  waitForConnections: true,
  connectionLimit: 10,
});

// Вернули /api/tasks (с буквой s на конце)
app.get('/api/tasks', async (req, res) => {
  try {
    // Исправили опечатку "taskы*" на "tasks.*" и вернули таблицу "tasks"
    const [rows] = await pool.query(`
      SELECT tasks.*, team.name as assignee, team.role 
      FROM tasks 
      LEFT JOIN team ON tasks.assignee_id = team.id
      ORDER BY tasks.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Вернули /api/tasks
app.post('/api/tasks', async (req, res) => {
  const { title, description, assignee_id, project, status, priority, type, start_date, end_date } = req.body;
  try {
    // Вернули INSERT INTO tasks
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, assignee_id, project, status, priority, type, start_date, end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        description || '', 
        assignee_id, 
        project || 'ССПБ ID', 
        status || 'Будущие', 
        priority || 'Medium', 
        type || 'Задача', 
        start_date || null, 
        end_date || null
      ]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('🚀 Бэкенд обновлен и запущен на порту 3001');
});