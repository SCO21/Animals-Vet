const { expressjwt: jwt } = require('express-jwt');
const { algorithm, secret } = require('../_config/config');
const models = require('../db/models');

module.exports = authorize;

async function authorize(req, res, next) {
    // Autenticación JWT Token y asignación al usuario
    jwt({ secret, algorithms: [algorithm] })(req, res, async (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized', status: 401 });
        }

        // Extraer el email desde el token
        const email = req.auth.sub; // `sub` contiene el email según el JWT generado

        // Buscar al usuario en la base de datos usando el email
        const user = await models.tbl_users.findOne({ where: { email } });
        if (!user) {
            // Si el usuario no existe
            return res.status(401).json({ message: 'Unauthorized', status: 401 });
        }

        // Usuario autenticado correctamente, asignar datos adicionales si es necesario
        req.auth.name = user.name;
        req.auth.email = user.email;
        req.auth.role = user.role;
        next();
    });
}
