const orderItemRepositories = require("../repositories/orderItem.repositories")

const create = async (orderItemData, populateOptions) => {
    try {
        const orderItem = await orderItemRepositories.create(orderItemData, populateOptions);
        if (orderItemData) {
            return orderItem;
        } else {
            console.error('orderItem could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new orderItem:', error);
        return null;
    }
};
const getOrderItem = async (filter, populateOptions) => {
    try {
        return await orderItemRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting orderItem:', error);
        return null;
    }
};

const getOrderItems = async (filter, populateOptions) => {
    try {
        return await orderItemRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (orderItemId, updatedData) => {
    try {
        const orderItem = await orderItemRepositories.update(orderItemId, updatedData);
        if (orderItem) {
            return orderItem;
        } else {
            console.error('orderItem could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing orderItem:', error);
        return null;
    }
};

const deleteById = async (orderItemId) => {
    try {
        await orderItemRepositories.deleteById(orderItemId);
        return null;
    } catch (error) {
        console.error('Error deleting orderItem:', error);
        return null;
    }
};
module.exports = { create, getOrderItem, getOrderItems, update, deleteById}