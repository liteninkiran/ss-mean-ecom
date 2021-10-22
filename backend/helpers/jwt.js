const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;

    return expressJwt({
        secret: secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            `${api}/users/login`,
            `${api}/users/register`,
            { url: `${api}/products`, methods: ['GET', 'OPTIONS'] },
        ]
    });
}

module.exports = authJwt;
