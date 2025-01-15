'use strict';

module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        const user = ctx.state.user;
        const { restaurantId } = ctx.params;

        if (!user) {
            return ctx.unauthorized("User not authenticated.");
        }
        const hasAccess = await strapi.entityService.count('plugin::users-permissions.user', {
            filters: {
                id: user.id,
                restaurant: restaurantId,
            },
        });

        if (!hasAccess) {
            return ctx.forbidden("User does not have access to this restaurant.");
        }
        await next();
    }
};
