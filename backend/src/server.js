require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const vagasRoutes = require('./routes/vagasRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const entrevistasRoutes = require('./routes/entrevistasRoutes');
const funcionariosRoutes = require('./routes/funcionariosRoutes');
const rhRoutes = require('./routes/rhRoutes');
const candidaturasRoutes = require('./routes/candidaturasRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const planosRoutes = require('./routes/planosRoutes');
const assinaturasRoutes = require('./routes/assinaturasRoutes');
const pagamentosRoutes = require('./routes/pagamentosRoutes');
const adminRoutes = require('./routes/adminRoutes');
const matchRoutes = require('./routes/matchRoutes');
const cursosRoutes = require('./routes/cursosRoutes');

const { errorHandler, rotaNaoEncontrada } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/vagas', vagasRoutes);
app.use('/api/perfil', perfilRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/entrevistas', entrevistasRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/rh', rhRoutes);
app.use('/api/candidaturas', candidaturasRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/planos', planosRoutes);
app.use('/api/assinaturas', assinaturasRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api', matchRoutes);
app.use('/api/cursos', cursosRoutes);

app.get('/teste', (_req, res) => {
  res.json({
    status: 'ok',
    sistema: 'MatchHire API',
    versao: '1.0.0'
  });
});

app.use(errorHandler);
app.use(rotaNaoEncontrada);

app.listen(PORT, () => {
  console.log(
    `MatchHire API rodando em http://localhost:${PORT}`
  );

  console.log(
    `Teste check: http://localhost:${PORT}/teste`
  );
});