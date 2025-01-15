'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        const authHeader = ctx.request.headers.authorization;
        try {
            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    ctx.state.user = decoded;
                    await next();
                    return;
                } catch (err) {
                    return ctx.unauthorized('Invalid JWT token');
                }
            }
        } catch (error) {

        }
        await next();
    };
};
