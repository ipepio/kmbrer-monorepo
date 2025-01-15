const tableRepositories = require("../repositories/table.repositories")
const crypto = require("crypto");

const create = async (tableData) => {
    try {
        const table = await tableRepositories.create(tableData);
        if (tableData) {
            return tableData;
        } else {
            console.error('table could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new table:', error);
        return null;
    }
};
const getTable = async (filter, populateOptions) => {
    try {
        return await tableRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting table:', error);
        return null;
    }
};

const getTables = async (filter, populateOptions) => {
    try {
        return await tableRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (tableId, updatedData) => {
    try {
        const table = await tableRepositories.update(tableId, updatedData);
        if (table) {
            return table;
        } else {
            console.error('table could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing table:', error);
        return null;
    }
};

const deleteById = async (tableId) => {
    try {
        await tableRepositories.deleteById(tableId);
        return null;
    } catch (error) {
        console.error('Error deleting table:', error);
        return null;
    }
};

const generateCode = () => {
    return crypto
        .randomBytes(18)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substr(0, 24)
        .toUpperCase();
};

const createTableCode = async (currentTable) => {
    let randomCode = null;
    while (!randomCode) {
        randomCode = generateCode();
        let tableCode = await strapi.entityService.findMany("api::table.table", {
            filters: { code: randomCode },
        });
        if (tableCode && tableCode.length > 0) {
            randomCode = null;
        }
    }
    currentTable.code = randomCode;
}
module.exports = { create, getTable, getTables, update, deleteById, createTableCode }