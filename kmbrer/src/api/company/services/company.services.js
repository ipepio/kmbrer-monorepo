const companyRepositories = require("../repositories/company.repositories")

const create = async (companyData) => {
    try {
        const company = await companyRepositories.create(companyData);
        if (company) {
            return company;
        } else {
            console.error('company could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new company:', error);
        return null;
    }
};
const getCompany = async (filter, populateOptions) => {
    try {
        return await companyRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting company:', error);
        return null;
    }
};

const getCompanys = async (filter, populateOptions) => {
    try {
        return await companyRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (companyId, updatedData) => {
    try {
        const company = await companyRepositories.update(companyId, updatedData);
        if (company) {
            return company;
        } else {
            console.error('company could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing company:', error);
        return null;
    }
};

const deleteById = async (companyId) => {
    try {
        await companyRepositories.deleteById(companyId);
        return null;
    } catch (error) {
        console.error('Error deleting company:', error);
        return null;
    }
};
module.exports = { create, getCompany, getCompanys, update, deleteById}