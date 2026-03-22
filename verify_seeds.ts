import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function checkUsers() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT name, "apiKey", tier FROM users');
    console.log('Current Users in DB:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error checking users:', err.message);
  } finally {
    await client.end();
  }
}

checkUsers();
