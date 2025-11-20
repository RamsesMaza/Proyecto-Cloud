import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ¡AQUÍ ESTÁ EL TRUCO!
// No pegues el texto "db-final..." aquí. 
// Usa process.env.DB_HOST para que Azure inyecte el valor automáticamente.

export const pool = mysql.createPool({
  host: process.env.DB_HOST,       // <--- Azure rellenará esto con lo que pusiste en el Lugar 1
  user: process.env.DB_USER,       // <--- Azure pondrá 'Mikuy'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: {
    rejectUnauthorized: false      // Obligatorio para Azure MySQL
  }
});
