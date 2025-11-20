import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {pool} from './db';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
// El puerto solo sirve para local, Azure lo ignora
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('API backend bd_disearqui funcionando');
});

// Example endpoint: obtener productos
app.get('/products', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

if (!process.env.AZURE_FUNCTIONS_WORKER_RUNTIME) {
    app.listen(port, () => {
        console.log(`Servidor backend escuchando en http://localhost:${port}`);
    });
}

export default app;