'use strict';

/**
 * order-item controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;
// @ts-ignore
const { z } = require('zod');

module.exports = createCoreController('api::order-item.order-item', ({ strapi }) => ({
    async updateOrderItemStatus(ctx) {
        try {
            const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

            // Validación de parámetros y cuerpo
            const paramsSchema = z.object({
                orderItemId: z.string().nonempty("The 'orderItemId' parameter is required."),
            });

            const bodySchema = z.object({
                status: z.enum(validStatuses, {
                    errorMap: () => ({ message: `Status must be one of: ${validStatuses.join(', ')}` }),
                }),
            });

            // Extraer y validar parámetros y body
            const { orderItemId } = paramsSchema.parse(ctx.params);
            const { status } = bodySchema.parse(ctx.request.body);

            // Buscar el order_item por su ID
            const orderItem = await strapi.entityService.findOne('api::order-item.order-item', orderItemId);

            if (!orderItem) {
                return ctx.notFound(`Order item with ID ${orderItemId} not found.`);
            }

            // Actualizar el estado
            const updatedOrderItem = await strapi.entityService.update('api::order-item.order-item', orderItemId, {
                data: { state: status },
            });

            // Emitir una actualización a través de socket si se necesita
            strapi.io.to(orderItem.restaurantId).emit('orderUpdate', [updatedOrderItem]);

            // Responder con la orden actualizada
            ctx.send({
                message: 'Order item status updated successfully.',
                order_item: updatedOrderItem,
            });
        } catch (error) {
            console.error('Error updating order item status:', error);
            return ctx.badRequest(error.message);
        }
    },
}));
