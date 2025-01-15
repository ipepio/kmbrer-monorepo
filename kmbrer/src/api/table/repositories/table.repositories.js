const create = async (table) => {
    try {
        const newtable = await strapi.entityService.create('api::table.table', {
            data: {...table}
        });
        return newtable;
    } catch (error) {
        console.error('Error creating new table:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::table.table').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::table.table').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding table(s):', error);
        return null;
    }
};
const update = async (tableId, data) => {
    try {
        return await strapi.entityService.update('api::table.table', tableId, { data });
    } catch (error) {
        console.error('Error updating table:', error);
        return null;
    }  
}
const deleteById = async (tableId) => {
    try {
        const deletedtable = await strapi.entityService.delete('api::table.table', tableId);
        return deletedtable;
    } catch (error) {
        console.error('Error deleting table:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
