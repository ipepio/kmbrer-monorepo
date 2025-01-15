const create = async (seat) => {
    try {
        const newSeat = await strapi.entityService.create('api::seat.seat', {
            data: {...seat}
        });
        return newSeat;
    } catch (error) {
        console.error('Error creating new seat:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::seat.seat').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::seat.seat').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding seat(s):', error);
        return null;
    }
};
const update = async (seatId, data) => {
    try {
        return await strapi.entityService.update('api::seat.seat', seatId, { data });
    } catch (error) {
        console.error('Error updating seat:', error);
        return null;
    }  
}
const deleteById = async (seatId) => {
    try {
        const deletedSeat = await strapi.entityService.delete('api::seat.seat', seatId);
        return deletedSeat;
    } catch (error) {
        console.error('Error deleting seat:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
