const restaurantRepositories = require("../repositories/restaurant.repositories")

const create = async (restaurantData) => {
    try {
        const restaurant = await restaurantRepositories.create(restaurantData);
        if (restaurantData) {
            return restaurantData;
        } else {
            console.error('restaurant could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new restaurant:', error);
        return null;
    }
};
const getRestaurant = async (filter, populateOptions) => {
    try {
        return await restaurantRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting restaurant:', error);
        return null;
    }
};

const getRestaurants = async (filter, populateOptions) => {
    try {
        return await restaurantRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (restaurantId, updatedData) => {
    try {
        const restaurant = await restaurantRepositories.update(restaurantId, updatedData);
        if (restaurant) {
            return restaurant;
        } else {
            console.error('restaurant could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing restaurant:', error);
        return null;
    }
};

const deleteById = async (restaurantId) => {
    try {
        await restaurantRepositories.deleteById(restaurantId);
        return null;
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        return null;
    }
};
module.exports = { create, getRestaurant, getRestaurants, update, deleteById}