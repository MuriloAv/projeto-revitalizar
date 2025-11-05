const express = require('express');
const cors = require('cors');
const authRoutes = require('./authRoutes'); // Importa as rotas

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Usa o arquivo authRoutes.js
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});