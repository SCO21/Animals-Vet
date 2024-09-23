const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../db/models");
const { secret } = require("../_config/config"); // Asegúrate de almacenar tu clave secreta de JWT de manera segura

class UsersService {
    async register(req) {
        const { name, email, password, role } = req.body;
        
        // Verificar si el email ya existe
        if (await models.tbl_users.findOne({ where: { email } })) {
            return {
                status: 400,
                mensaje: "The email is already registered",
            };
        }
        // Crear una nueva cuenta
        const user = new models.tbl_users({
            name,
            email,
            role,
            password: await bcrypt.hash(password, 10), // Hashear la contraseña
        });

        // Guardar la cuenta
        await user.save();

        // Retornar detalles básicos del usuario
        const data = { name: user.name, email: user.email, role: user.role };

        return {
            status: 200,
            mensaje: "Account has been registered",
            data: data,
        };
    }

    async authenticate(req) {
        const { email, password } = req.body;
        const user = await models.tbl_users
            .findOne({ where: { email: email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
                mensaje: "The email or password is incorrect",
                status: 400,
            };
        }

        const jwtToken = this.generateJwtToken(user);

        // Retornar la información básica junto con el JWT
        return {
            mensaje: "You have successfully logged in",
            status: 200,
            ...{ name: user.name, email: user.email, role: user.role },
            jwtToken,
        };
    }

    generateJwtToken(user) {
        return jwt.sign(
            {
                sub: user.email,
                id: user.email,
                role: user.role,
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            },
            secret,
            {
                expiresIn: "24h",
            }
        );
    }
}

module.exports = UsersService;
