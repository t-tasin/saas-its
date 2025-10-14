#!/usr/bin/env node

/**
 * Database initialization script for ticket-svc
 * This script creates the necessary schema and tables
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing database initialization...');
    await client.query(sql);
    console.log('Database initialization completed successfully!');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the initialization
initDatabase();
