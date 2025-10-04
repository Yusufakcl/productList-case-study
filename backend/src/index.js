import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import productRoutes from '#routes/productRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req,res) => {
  res.json({ status: 'ok' });
});

app.use('/products', productRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

