const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ error: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Сохраняем информацию о пользователе в req.user
        next();
    } catch (error) {
        res.status(403).json({ error: 'Неверный или просроченный токен' });
    }
};

module.exports = authenticateJWT;
