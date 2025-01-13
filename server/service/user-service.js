const db = require('../database');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const GetUserDto = require('../dtos/get-user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(login, fullName, password, email, role) {
        const candidate = await db.Users.findOne({
            where: {user_login: login}
        });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким логином '${login}' уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await db.Users.create({
            user_login: login,
            user_pass: hashPassword,
            user_fullname: fullName,
            user_email: email,
            user_activation_link: activationLink,
            user_role: role
        });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, login, email, password
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await db.Users.findOne({
            where: {user_activation_link: activationLink}
        });
        if (!user) {
            throw ApiError.BadRequest('Кажется возникла проблема с предоставленной ссылкой. ' +
                'Пожалуйста, свяжитесь со службой поддержки.')
        }
        user.user_activated = true;
        await user.save();
    }

    async login(login, password) {
        const user = await db.Users.findOne({
            where: {user_login: login}
        });
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с таким логином '${login}' не существует`)
        }
        const isPassEquals = await bcrypt.compare(password, user.user_pass);
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Неправильный пароль`)
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await db.Users.findByPk(userData.id); // maybe error by findByPk
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async getAllUsers() {
        const users = await db.Users.findAll();
        const getUserDto = users.map(user => new GetUserDto(user));
        return getUserDto;
    }
}

module.exports = new UserService();