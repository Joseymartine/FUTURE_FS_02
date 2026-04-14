const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
    res.send('Mini CRM API is running...');
});

const pool = require('./db/connection');

app.listen(PORT, async () => {
    try {
        await pool.query('SELECT 1');
        console.log('Database connected successfully');
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
});
