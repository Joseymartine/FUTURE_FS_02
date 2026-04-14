const pool = require('./db/connection');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('Seeding database...');
        
        // 1. Clear existing data (optional)
        // await pool.execute('DELETE FROM leads');
        // await pool.execute('DELETE FROM admins');

        // 2. Add Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.execute('INSERT IGNORE INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
        console.log('Admin user "admin" with password "admin123" created (if not existed).');

        // 3. Add Leads
        const dummyLeads = [
            ['John Doe', 'john@example.com', '1234567890', 'Website Contact', 'new', 'Looking for a website rebuild.'],
            ['Jane Smith', 'jane@design.co', '0987654321', 'Referral', 'contacted', 'Interested in SEO services.'],
            ['Mike Ross', 'mike@pearson.com', '5551234', 'LinkedIn', 'in-progress', 'Discussing retainer contract.'],
            ['Harvey Specter', 'harvey@specter.com', '5559999', 'Direct', 'converted', 'Signed for 6 months.'],
            ['Donna Paulsen', 'donna@firm.com', '5558888', 'Website Contact', 'closed', 'Not looking for services at this time.']
        ];

        for (const lead of dummyLeads) {
            await pool.execute(
                'INSERT INTO leads (name, email, phone, source, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
                lead
            );
        }

        console.log('Seeded 5 dummy leads.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
