const express = require('express');
console.log('Auth routes loaded');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// Login Admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.execute('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, admin: { id: admin.id, username: admin.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register Admin (One-time or internal)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
