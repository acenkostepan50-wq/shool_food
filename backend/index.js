console.log('index.js запущен');

const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// тестовый маршрут
app.get('/', (req, res) => {
  res.send('SchoolFood API работает');
});

// тест подключения к БД
const pool = require('./db');

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      time: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка подключения к БД' });
  }
});

// запуск сервера
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
