const create = async (product) => {
    try {
        const newproduct = await strapi.entityService.create('api::product.product', {
            data: {...product}
        });
        return newproduct;
    } catch (error) {
        console.error('Error creating new product:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::product.product').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::product.product').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding product(s):', error);
        return null;
    }
};
const update = async (productId, data) => {
    try {
        return await strapi.entityService.update('api::product.product', productId, { data });
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }  
}
const deleteById = async (productId) => {
    try {
        const deletedproduct = await strapi.entityService.delete('api::product.product', productId);
        return deletedproduct;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
