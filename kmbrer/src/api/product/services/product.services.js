const productRepositories = require("../repositories/product.repositories")

const create = async (productData) => {
    try {
        const product = await productRepositories.create(productData);
        if (productData) {
            return productData;
        } else {
            console.error('product could not be created.');
            return null;
        }
    } catch (error) {
        console.error('Error creating new product:', error);
        return null;
    }
};
const getProduct = async (filter, populateOptions) => {
    try {
        return await productRepositories.find('findOne', filter, populateOptions) || null;
    } catch (error) {
        console.error('Error getting product:', error);
        return null;
    }
};

const getProducts = async (filter, populateOptions) => {
    try {
        return await productRepositories.find('findMany', filter, populateOptions);
    } catch (error) {
        console.error('Error getting attendees:', error);
        return null;
    }
};

const update = async (productId, updatedData) => {
    try {
        const product = await productRepositories.update(productId, updatedData);
        if (product) {
            return product;
        } else {
            console.error('product could not be updated.');
            return null;
        }
    } catch (error) {
        console.error('Error editing product:', error);
        return null;
    }
};

const deleteById = async (productId) => {
    try {
        await productRepositories.deleteById(productId);
        return null;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
};
module.exports = { create, getProduct, getProducts, update, deleteById}