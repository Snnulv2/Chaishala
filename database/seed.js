const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seedAdmin() {
  const password = 'Chaishala@123';
  const hash = await bcrypt.hash(password, 10);
  
  await db.query(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password = ?`,
    ['Admin', 'admin@chaishala.com', hash, hash]
  );
  
  console.log('Admin seeded: admin@chaishala.com / Chaishala@123');
  process.exit(0);
}

seedAdmin().catch(console.error);
