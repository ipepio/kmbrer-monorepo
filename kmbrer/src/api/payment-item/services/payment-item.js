'use strict';

/**
 * payment-item service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-item.payment-item');
