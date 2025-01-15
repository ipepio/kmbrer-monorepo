const paymentRepositories = require("../repositories/payment.repositories")

const create = async (paymentData) => {
    try {
        const payment = await paymentRepositories.create(paymentData);
        if (payment) {
            return payment;
        } else {
            console.error('payment could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new payment:', error);
        return null;
    }
};
const getPayment = async (filter, populateOptions) => {
    try {
        return await paymentRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting payment:', error);
        return null;
    }
};

const getPayments = async (filter, populateOptions) => {
    try {
        return await paymentRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (paymentId, updatedData) => {
    try {
        const payment = await paymentRepositories.update(paymentId, updatedData);
        if (payment) {
            return payment;
        } else {
            console.error('payment could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing payment:', error);
        return null;
    }
};

const deleteById = async (paymentId) => {
    try {
        await paymentRepositories.deleteById(paymentId);
        return null;
    } catch (error) {
        console.error('Error deleting payment:', error);
        return null;
    }
};
module.exports = { create, getPayment, getPayments, update, deleteById}