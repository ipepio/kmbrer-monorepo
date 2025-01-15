const create = async (payment) => {
    try {
        const newPayment = await strapi.entityService.create('api::payment.payment', {
            data: {...payment}
        });
        return newPayment;
    } catch (error) {
        console.error('Error creating new payment:', error);
        return null;
    }
};
const find = async (method, filter, populateOptions, locale = "es") => {
    try {
        if (method === 'findOne') {
            return await strapi.query('api::payment.payment').findOne({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else if (method === 'findMany') {
            return await strapi.query('api::payment.payment').findMany({
                where: filter,
                populate: populateOptions,
                locale: locale,
            });
        } else {
            throw new Error("The method must be 'findOne' or 'findMany'");
        } 
    } catch (error) {
        console.error('Error finding payment(s):', error);
        return null;
    }
};
const update = async (paymentId, data) => {
    try {
        return await strapi.entityService.update('api::payment.payment', paymentId, { data });
    } catch (error) {
        console.error('Error updating payment:', error);
        return null;
    }  
}
const deleteById = async (paymentId) => {
    try {
        const deletedPayment = await strapi.entityService.delete('api::payment.payment', paymentId);
        return deletedPayment;
    } catch (error) {
        console.error('Error deleting payment:', error);
        return null;
    }
};

module.exports = { create, find, update, deleteById };
