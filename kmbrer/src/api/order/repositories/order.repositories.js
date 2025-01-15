const create = async (order) => {
    try {
        const neworder = await strapi.entityService.create('api::order.order', {
            data: {...order}
        });
        return neworder;
    } catch (error) {
        console.error('Error creating new order:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::order.order').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::order.order').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding order(s):', error);
        return null;
    }
};
const update = async (attenddeId, data) => {
    try {
        return await strapi.entityService.update('api::order.order', attenddeId, { data });
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }  
}
const deleteById = async (orderId) => {
    try {
        const deletedorder = await strapi.entityService.delete('api::order.order', orderId);
        return deletedorder;
    } catch (error) {
        console.error('Error deleting order:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
