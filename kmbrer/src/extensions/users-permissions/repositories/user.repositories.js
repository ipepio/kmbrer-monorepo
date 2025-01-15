const create = async (user) => {
    try {
        const newAttendee = await strapi.entityService.create('plugin::users-permissions.user', {
            data: { ...user }
        });
        return user;
    } catch (error) {
        console.error('Error creating new attendee:', error);
        return null;
    }
};

const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('plugin::users-permissions.user').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('plugin::users-permissions.user').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        }
    } catch (error) {
        console.error('Error finding attendee(s):', error);
        return null;
    }
};

const update = async (userId, user) => {
    try {
        return await strapi.entityService.update('api::attendee.attendee', userId, { user });
    } catch (error) {
        console.error('Error updating attendee:', error);
        return null;
    }
}

const deleteById = async (userId) => {
    try {
        const deletedAttendee = await strapi.entityService.delete('api::attendee.attendee', userId);
        return deletedAttendee;
    } catch (error) {
        console.error('Error deleting attendee:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
