const userRepositories = require("../repositories/user.repositories")

const create = async (userData) => {
    try {
        const user = await userRepositories.create(userData);
        if (userData) {
            return userData;
        } else {
            console.error('user could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new user:', error);
        return null;
    }
};
const getUser = async (filter, populateOptions) => {
    try {
        const user = await userRepositories.find('findOne', filter, populateOptions);
        return user || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

const getUsers = async (filter, populateOptions) => {
    try {
        const attendees = await userRepositories.find('findMany', filter, populateOptions);
        return attendees;
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (userId, updatedData) => {
    try {
        const user = await userRepositories.update(userId, updatedData);
        if (user) {
            return user;
        } else {
            console.error('User could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing user:', error);
        return null;
    }
};

const deleteById = async (userId) => {
    try {
        await userRepositories.deleteById(userId);
        return null;
    } catch (error) {
        console.error('Error deleting user:', error);
        return null;
    }
};
module.exports = { create, getUser, getUsers, update, deleteById}