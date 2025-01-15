const restaurant = require("../api/restaurant/controllers/restaurant");
const userServices = require("../extensions/users-permissions/services/user.services")

module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        if (ctx.request.path.startsWith('/api/auth/local')) {
            const { identifier, 
                // IAM
             } = ctx.request.body;
            // if (!IAM) {
            //     ctx.status = 401;
            //     ctx.body = { message: 'IAM not provied' };
            //     return;
            // }
            // const user = await userServices.getUser({ username: identifier }, { restaurant: true })
            // if (user === null) {
            //     ctx.status = 404;
            //     ctx.body = { message: "User not found" };
            //     return;
            // }
            // if (IAM !== user.restaurant.IAM) {
            //     ctx.status = 403;
            //     ctx.body = { message: "Don't have permissions" };
            //     return;
            // }
        }
        await next();
    }

};
