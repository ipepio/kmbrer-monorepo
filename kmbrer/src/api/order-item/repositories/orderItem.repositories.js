const create = async (orderItem, populateOptions) => {
    try {
        const neworderItem = await strapi.entityService.create('api::order-item.order-item', {
            data: {...orderItem},
            populate: populateOptions
        });
        return neworderItem;
    } catch (error) {
        console.error('Error creating new orderItem:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::order-item.order-item').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::order-item.order-item').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding orderItem(s):', error);
        return null;
    }
};
const update = async (orderItemId, data) => {
    try {
        return await strapi.entityService.update('api::order-item.order-item', orderItemId, { data });
    } catch (error) {
        console.error('Error updating orderItem:', error);
        return null;
    }  
}
const deleteById = async (orderItemId) => {
    try {
        const deletedorderItem = await strapi.entityService.delete('api::order-item.order-item', orderItemId);
        return deletedorderItem;
    } catch (error) {
        console.error('Error deleting orderItem:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
