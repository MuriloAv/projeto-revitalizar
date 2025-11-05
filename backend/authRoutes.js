// authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // Ajuste o caminho se o db.js não estiver na raiz
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ===================================================
// --- Rota de Registro (POST /register) ---
// ===================================================
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        // Verifica se já existe um usuário com o mesmo e-mail
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado.' });
        }

        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cria o usuário no banco de dados
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

// ===================================================
// --- Rota de Login (POST /login) ---
// ===================================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Cria o token JWT com o ID do usuário
        // 🔒 Lembre-se de criar um arquivo .env com seu JWT_SECRET
        const token = jwt.sign(
            { userId: user.rows[0].id },
            process.env.JWT_SECRET || 'SUA_PALAVRA_SECRETA_MUDE_ISSO', // Use .env ou um fallback
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login bem-sucedido!',
            token: token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// ===================================================
// --- Rota Pública: GET /residue-types ---
// (Para o frontend preencher o formulário de upload)
// ===================================================
router.get('/residue-types', async (req, res) => {
    try {
        const types = await db.query("SELECT * FROM residue_types ORDER BY name");
        res.status(200).json(types.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// ===================================================
// --- Rota Pública: GET /uploads (Galeria) ---
// (Para a página inicial mostrar todas as fotos)
// ===================================================
router.get('/uploads', async (req, res) => {
    try {
        const uploads = await db.query(
            `SELECT 
                uploads.id,
                uploads.image_url,
                uploads.collected_at,
                residue_types.name AS residue_name,
                users.email AS user_email
            FROM uploads
            JOIN residue_types ON uploads.residue_type_id = residue_types.id
            JOIN users ON uploads.user_id = users.id
            ORDER BY uploads.collected_at DESC`
        );
        res.status(200).json(uploads.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// ===================================================
// --- Middleware de Autenticação (Segurança) ---
// (Verifica o token JWT antes de permitir o acesso)
// ===================================================
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']; // ou req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SUA_PALAVRA_SECRETA_MUDE_ISSO');
        req.user = decoded; // agora req.user.userId está disponível
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

// ===================================================
// --- Endpoint Protegido: POST /uploads ---
// (Cria o registro no banco DEPOIS que a imagem foi pro S3)
// ===================================================
router.post('/uploads', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; // vem do token
        const { imageUrl, residueTypeId, latitude, longitude } = req.body;

        if (!imageUrl || !residueTypeId) {
            return res.status(400).json({ error: 'imageUrl e residueTypeId são obrigatórios.' });
        }

        const newUpload = await db.query(
            `INSERT INTO uploads (user_id, residue_type_id, image_url, location_lat, location_lng)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [userId, residueTypeId, imageUrl, latitude, longitude]
        );

        res.status(201).json(newUpload.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// ===================================================
// --- Endpoint Protegido: GET /auth/me ---
// (Para o frontend saber quem é o usuário logado)
// ===================================================
router.get('/auth/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await db.query(
            "SELECT id, email, created_at FROM users WHERE id = $1",
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(user.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// Exporta o router para o index.js usar
module.exports = router;