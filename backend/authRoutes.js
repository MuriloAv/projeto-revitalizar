// authRoutes.js (Refatorado para Multer)
const express = require('express');
const router = express.Router();
const db = require('./db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // <-- NOVO
const path = require('path'); // <-- NOVO

//  CONFIGURAÇÃO DO MULTER  
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salva na pasta backend/public/uploads
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    // nome de arquivo único para evitar conflitos
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
// 'upload' será  "segurança" de arquivos
const upload = multer({ storage: storage });
// FIM DA CONFIGURAÇÃO DO MULTER

// Rota de Registro (POST /register) 
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) return res.status(400).json({ error: 'Este email já está cadastrado.' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await db.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, hashedPassword]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// rota de Login (POST /login) 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas.' });
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Credenciais inválidas.' });
        const token = jwt.sign(
            { userId: user.rows[0].id },
            process.env.JWT_SECRET || 'SUA_PALAVRA_SECRETA_MUDE_ISSO', 
            { expiresIn: '24h' }
        );
        res.json({
            message: 'Login bem-sucedido!',
            token: token,
            user: { id: user.rows[0].id, email: user.rows[0].email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota Pública: GET /residue-types
router.get('/residue-types', async (req, res) => {
    try {
        const types = await db.query("SELECT * FROM residue_types ORDER BY name");
        res.status(200).json(types.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota Pública GET /uploads
router.get('/uploads', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9; 
        const offset = (page - 1) * limit;
        const totalResult = await db.query('SELECT COUNT(*) FROM uploads');
        const totalUploads = parseInt(totalResult.rows[0].count);
        const totalPages = Math.ceil(totalUploads / limit) || 1; 
        const dataQuery = `
            SELECT 
                uploads.id, uploads.image_url, uploads.collected_at,
                json_build_object('email', users.email) AS user,
                json_build_object('name', residue_types.name, 'category', residue_types.category, 'decomposition_time', residue_types.decomposition_time) AS residue_type
            FROM uploads
            JOIN users ON uploads.user_id = users.id
            JOIN residue_types ON uploads.residue_type_id = residue_types.id
            ORDER BY uploads.collected_at DESC
            LIMIT $1 OFFSET $2
        `;
        const dataResult = await db.query(dataQuery, [limit, offset]);
        res.status(200).json({
            uploads: dataResult.rows,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Erro ao buscar uploads paginados:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Middleware de Autenticação
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']; 
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    const token = authHeader.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SUA_PALAVRA_SECRETA_MUDE_ISSO');
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}
router.post('/uploads', 
  authMiddleware, // 1. Verifica o token
  upload.single('imageFile'), // 2. Multer intercepta e salva o arquivo com o nome 'imageFile'
  async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // Pega os dados de texto do req.body
      const { residueTypeId, city, river_name, notes, latitude, longitude } = req.body;
      
      //  O Multer dá o arquivo em req.file
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
      }

      //  Criamos a URL pública para a imagem      
      const imageUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;

      if (!residueTypeId) {
        return res.status(400).json({ error: 'residueTypeId é obrigatório.' });
      }
      
      //  Salva a URL no banco 
      const newUpload = await db.query(
        `INSERT INTO uploads (user_id, residue_type_id, image_url, location_lat, location_lng, city, river_name, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, residueTypeId, imageUrl, latitude, longitude, city, river_name, notes]
      );

      res.status(201).json(newUpload.rows[0]);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Endpoint Protegido: GET /auth/me 
router.get('/auth/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await db.query(
            "SELECT id, email, created_at FROM users WHERE id = $1",
            [userId]
        );
        if (user.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;