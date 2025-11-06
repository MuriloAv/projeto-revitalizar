// authMiddleware.js
const jwt = require('jsonwebtoken');

// Esta é a mesma palavra-secreta que você usou no login
const JWT_SECRET = '12345'; 

const authMiddleware = (req, res, next) => {
    // 1. Pega o token do cabeçalho 'Authorization'
    const authHeader = req.headers.authorization;

    // 2. Verifica se o token foi enviado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 3. Extrai o token (remove o "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verifica se o token é válido
        const decoded = jwt.verify(token, JWT_SECRET);

        // 5. Se for válido, anexa o payload (que contém o userId) ao objeto 'req'
        // Assim, a rota final (ex: /auth/me) saberá quem é o usuário.
        req.user = decoded; 

        // 6. Passa para a próxima função (a rota real)
        next();

    } catch (error) {
        // Se o token for inválido (expirado, assinatura errada, etc.)
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;