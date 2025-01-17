const jwt = require('jsonwebtoken');
const db = require('../database');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '6h'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await db.Tokens.findOne({
            where: { token_user_id: userId }
        });
        if (tokenData) {
            tokenData.token = refreshToken;
            return tokenData.save();
        }
        const token = await db.Tokens.create({ token_user_id: userId, token: refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await db.Tokens.destroy({
            where: { token: refreshToken }
        });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await db.Tokens.findOne({
            where: { token: refreshToken }
        });
        return tokenData;
    }
}

module.exports = new TokenService();