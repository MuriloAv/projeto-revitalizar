// authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = '12345'; 

const authMiddleware = (req, res, next) => {
    //  Pega o token do cabeçalho 'Authorization'
    const authHeader = req.headers.authorization;

    //  Verifica se o token foi enviado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    //  Extrai o token (remove o "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        //  Verifica se o token é válido
        const decoded = jwt.verify(token, JWT_SECRET);

        //  Se for válido, anexa o payload (que contém o userId) ao objeto 'req'
        
        req.user = decoded; 

        // 6. Passa para a próxima função (a rota real)
        next();

    } catch (error) {
        // Se o token for inválido 
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;