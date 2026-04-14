const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.adminId = decoded.id;
        next();
    });
};

// Create a Lead (Public - e.g. from a contact form)
router.post('/', async (req, res) => {
    const { name, email, phone, source, notes } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO leads (name, email, phone, source, notes) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, source || 'Website Contact Form', notes]
        );
        res.status(201).json({ message: 'Lead submitted successfully', leadId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all Leads (Admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Lead Status (Admin only)
router.put('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        await pool.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Lead Notes (Admin only)
router.put('/:id/notes', verifyToken, async (req, res) => {
    const { notes } = req.body;
    const { id } = req.params;
    try {
        await pool.execute('UPDATE leads SET notes = ? WHERE id = ?', [notes, id]);
        res.json({ message: 'Notes updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Lead (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
