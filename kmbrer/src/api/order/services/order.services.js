const orderRepositories = require("../repositories/order.repositories")
const tableServices = require("../../table/services/table.services")
const create = async (orderData) => {
    try {
        const order = await orderRepositories.create(orderData);
        if (order) {
            return order;
        } else {
            console.error('order could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new order:', error);
        return null;
    }
};
const getOrder = async (filter, populateOptions) => {
    try {
        return await orderRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting order:', error);
        return null;
    }
};

const getOrders = async (filter, populateOptions) => {
    try {
        return await orderRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (orderId, updatedData) => {
    try {
        const order = await orderRepositories.update(orderId, updatedData);
        if (order) {
            return order;
        } else {
            console.error('order could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing order:', error);
        return null;
    }
};

const deleteById = async (orderId) => {
    try {
        await orderRepositories.deleteById(orderId);
        return null;
    } catch (error) {
        console.error('Error deleting order:', error);
        return null;
    }
};
const checkTable = async (data) => {
    try {
        const tableId = data?.table?.connect?.[0]?.id || data?.table?.set?.[0]?.id;
        const table = await tableServices.getTable({ id: tableId})
        if (table && !table.isOpen)
            throw new Error("The order cannot be opened because the table is not open.");
        else if (table && (table.isOpen || table.isOpen === null)) {
            table.isOpen = false
            await tableServices.update(tableId, {isOpen: false});
        }
        else
            throw new Error("The specified table does not exist.");
    } catch (error) {
        console.error("Error in checkTable:", error.message);
        throw error;
    }
};
const canAddSeat = async (order) => {
    const currentOrder = await getOrder(
        { id: order.id },
        { seats: true }
    );
    if (!currentOrder) {
        throw new Error('Order not found');
    }
    if (currentOrder.seats && (currentOrder?.seats?.length < currentOrder.numOfSeats)) {
        return true;
    }
    return false;
};
const canGetGuests = async(order, user) => {
return true;
}
const canSetPrice = async(user) => {
    return true;
    }

module.exports = { create, getOrder, getOrders, update, deleteById, checkTable, canAddSeat,canGetGuests, canSetPrice}