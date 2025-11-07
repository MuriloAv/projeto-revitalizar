// index.js (Refatorado para Multer)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes');
const path = require('path'); // <-- Pacote do Node

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`[SUCESSO!] Servidor rodando na porta ${PORT}`);
});