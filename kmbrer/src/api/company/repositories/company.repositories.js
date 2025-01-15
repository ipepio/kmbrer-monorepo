const create = async (company) => {
    try {
        const newCompany = await strapi.entityService.create('api::company.company', {
            data: {...company}
        });
        return newCompany;
    } catch (error) {
        console.error('Error creating new company:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::company.company').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::company.company').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding company(s):', error);
        return null;
    }
};
const update = async (companyId, data) => {
    try {
        return await strapi.entityService.update('api::company.company', companyId, { data });
    } catch (error) {
        console.error('Error updating company:', error);
        return null;
    }  
}
const deleteById = async (companyId) => {
    try {
        const deletedCompany = await strapi.entityService.delete('api::company.company', companyId);
        return deletedCompany;
    } catch (error) {
        console.error('Error deleting company:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
