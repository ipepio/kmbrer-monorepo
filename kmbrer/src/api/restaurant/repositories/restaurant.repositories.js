const create = async (restaurant) => {
    try {
        const newproduct = await strapi.entityService.create('api::restaurant.restaurant', {
            data: {...restaurant}
        });
        return newproduct;
    } catch (error) {
        console.error('Error creating new restaurant:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::restaurant.restaurant').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::restaurant.restaurant').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding restaurant(s):', error);
        return null;
    }
};
const update = async (productId, data) => {
    try {
        return await strapi.entityService.update('api::restaurant.restaurant', productId, { data });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        return null;
    }  
}
const deleteById = async (productId) => {
    try {
        const deletedproduct = await strapi.entityService.delete('api::restaurant.restaurant', productId);
        return deletedproduct;
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
