require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
//const { Pool } = require('pg'); // Import Pool from pg

const app = express();
const PORT = process.env.PORT || 5000;

const db = require('./models'); // This imports your sequelize instance and models
const authRoutes = require('./routes/auth');

  // Test database connection using Sequelize
db.sequelize.authenticate()
    .then(() => {
          console.log('Sequelize connected to PostgreSQL database!');
          // Optionally, sync models (creates tables if they don't exist, use migrations for production)
          // db.sequelize.sync({ alter: true }) // Use { force: true } to drop and recreate for dev, { alter: true } to modify existing
          //     .then(() => console.log('Database synced!'))
          //     .catch(err => console.error('Error syncing database:', err));
      })
      .catch(err => {
          console.error('Error connecting to PostgreSQL via Sequelize:', err);
      });


// Middleware to parse JSON bodies
  app.use(express.json());

// Make db models available to your routes (optional, but good practice)
  app.use((req, res, next) => {
      req.db = db;
      next();
  });

// --- Database Connection Pool Setup ---
/*const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database!');
        client.release(); // Release the client back to the pool
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL database:', err.stack);
    });
*/
// Basic route to test server
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use the auth routes
app.use('/api/auth', authRoutes)

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});