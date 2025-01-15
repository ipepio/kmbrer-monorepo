const seatRepositories = require("../repositories/seat.repositories")

const create = async (seatData) => {
    try {
        const seat = await seatRepositories.create(seatData);
        if (seat) {
            return seat;
        } else {
            console.error('seat could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new seat:', error);
        return null;
    }
};
const getSeat = async (filter, populateOptions) => {
    try {
        return await seatRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting seat:', error);
        return null;
    }
};

const getSeats = async (filter, populateOptions) => {
    try {
        return await seatRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (seatId, updatedData) => {
    try {
        const seat = await seatRepositories.update(seatId, updatedData);
        if (seat) {
            return seat;
        } else {
            console.error('seat could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing seat:', error);
        return null;
    }
};

const deleteById = async (seatId) => {
    try {
        await seatRepositories.deleteById(seatId);
        return null;
    } catch (error) {
        console.error('Error deleting seat:', error);
        return null;
    }
};
module.exports = { create, getSeat, getSeats, update, deleteById}