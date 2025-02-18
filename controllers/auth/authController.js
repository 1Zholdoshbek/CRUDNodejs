const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('/home/zholdoshbek/Documents/CRUDNodejs/models/User.js');

// Генерация токенов
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Access token живет 15 минут
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Refresh token живет 7 дней
    );

    return { accessToken, refreshToken };
};

const registerUser = async (req, res, next) => {
    try {
        const { username, password, email, fullName } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            email,
            fullName
        });

        const { accessToken, refreshToken } = generateTokens(user);

        // Сохраняем refresh token в базе
        await user.update({ refreshToken });

        res.status(201).json({
            message: 'Пользователь успешно создан',
            id: user.id,
            username: user.username,
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Пользователь не найден' });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Неверный пароль' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Обновляем refresh token в базе
        await user.update({ refreshToken });

        res.json({
            message: 'Успешная авторизация',
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token обязателен' });
        }

        // Находим пользователя с таким refresh token
        const user = await User.findOne({ where: { refreshToken } });
        if (!user) {
            return res.status(403).json({ error: 'Недействительный refresh token' });
        }

        // Проверяем валидность refresh token
        try {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            await user.update({ refreshToken: null });
            return res.status(403).json({ error: 'Недействительный refresh token' });
        }

        // Генерируем новые токены
        const tokens = generateTokens(user);

        // Обновляем refresh token в базе
        await user.update({ refreshToken: tokens.refreshToken });

        res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token обязателен' });
        }

        // Находим пользователя и очищаем его refresh token
        const user = await User.findOne({ where: { refreshToken } });
        if (user) {
            await user.update({ refreshToken: null });
        }

        res.json({ message: 'Успешный выход из системы' });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { email, fullName, bio } = req.body;

        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await user.update({
            email,
            fullName,
            bio
        });

        res.json({
            message: 'Профиль успешно обновлен',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                bio: user.bio
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logout,
    getProfile,
    updateProfile
};