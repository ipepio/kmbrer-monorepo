'use strict';
const {
    createRedsysAPI,
    TRANSACTION_TYPES,
    randomTransactionId,
    SANDBOX_URLS,
    PRODUCTION_URLS,
    isResponseCodeOk,
    CURRENCIES,
} = require("redsys-easy");

const orderServices = require("../../order/services/order.services")
const orderItemServices = require("../../order-item/services/orderItem.services")
const paymentServices = require("../services/payment.services")
/**
 * payment controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
    async getPendingItems(ctx) {
        const { orderId } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.badRequest("You are not authenticated.");
        }
        const order = await orderServices.getOrder({ id: orderId }, { seats: true });
        if (!order) {
            return ctx.notFound("The specified order was not found.");
        }
        let filter = {
            order: order.id,
            state: { $ne: 'cancelled' },
            // isPaid: { $ne: 'true' },
            $or: [
                { isPaid: { $ne: 'true' } }, // No es 'true'
                { isPaid: null } // Es null
            ],
        };
        let populateOptions = {
            seat: true,
            sharedWith: true,
            complement: {
                select: ['name', 'price'],
            },
            price: true,
            product: true,
        };
        const pendingItems = await orderItemServices.getOrderItems(filter, populateOptions);

        const guestOrderItemsMap = {};

        pendingItems.forEach((pendingItem) => {
            const sharedCount = (pendingItem.sharedWith?.length || 0) + 1;
            const adjustedPrice = (pendingItem.price / sharedCount).toFixed(2);
            const mainGuest = {
                id: pendingItem.seat.id,
                name: pendingItem.seat.name,
                isUser: pendingItem.seat.id === user.id,
            };
            if (!guestOrderItemsMap[mainGuest.id]) {
                guestOrderItemsMap[mainGuest.id] = {
                    guest: mainGuest,
                    orderItems: [],
                };
            }
            guestOrderItemsMap[mainGuest.id].orderItems.push({
                id: pendingItem.id,
                name: pendingItem.product.name,
                price: adjustedPrice,
            });
            pendingItem.sharedWith?.forEach((sharedGuest) => {
                const sharedGuestData = {
                    id: sharedGuest.id,
                    name: sharedGuest.name,
                    isUser: sharedGuest.id === user.id,
                };
                if (!guestOrderItemsMap[sharedGuestData.id]) {
                    guestOrderItemsMap[sharedGuestData.id] = {
                        guest: sharedGuestData,
                        orderItems: [],
                    };
                }
                guestOrderItemsMap[sharedGuestData.id].orderItems.push({
                    id: pendingItem.id,
                    name: pendingItem.product.name,
                    price: adjustedPrice,
                });
            });
            pendingItem.complement?.forEach((complement) => {
                guestOrderItemsMap[mainGuest.id].orderItems.push({
                    id: '',
                    name: complement.name,
                    price: complement.price.toFixed(2),
                });
            });
        });
        const result = Object.values(guestOrderItemsMap);
        ctx.body = { pendingItems: result };
    },
    // async payCardItems(ctx) {
    //     const { orderId } = ctx.params;
    //     const user = ctx.state.user;

    //     if (!user) {
    //         return ctx.badRequest("You are not authenticated.");
    //     }
    //     const order = await orderServices.getOrder({ id: orderId }, { table: { populate: { restaurant: { populate: { company: { populate: { redsys: true } } } } } } });
    //     if (!order) {
    //         return ctx.notFound("The specified order was not found.");
    //     }
    //     const company = order.table.restaurant.company
    //     const items = ctx.request.body
    //     const { createRedirectForm, processRestNotification } = createRedsysAPI({
    //         urls: SANDBOX_URLS,
    //         secretKey: company.redsys.secretKey,
    //     });
    //     const merchantInfo = {
    //         DS_MERCHANT_MERCHANTCODE: company.redsys.merchantCode,
    //         DS_MERCHANT_TERMINAL: company.redsys.merchantTerminal,
    //         DS_MERCHANT_MERCHANTNAME: company.redsys.merchantName,
    //     };
    //     const currencyInfo = CURRENCIES["EUR"];
    //     const redsysCurrency = currencyInfo.num;
    //     const redsysAmount = 
    //     100;
    //     const form = createRedirectForm({
    //         ...merchantInfo,
    //         DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION,
    //         DS_MERCHANT_ORDER: orderId,
    //         DS_MERCHANT_AMOUNT: redsysAmount,
    //         DS_MERCHANT_CURRENCY: redsysCurrency,
    //         DS_MERCHANT_MERCHANTURL: `${ctx.request.header.referer}/api/TPVNotification`,
    //         DS_MERCHANT_URLOK: `${ctx.request.header.referer}/${orderId}/confirmation?orderId=${orderId}&buyer=${user.name}`,
    //         DS_MERCHANT_URLKO: `${ctx.request.header.referer}/${orderId}/errorRedsys?orderId=${orderId}`,
    //     });
    //     ctx.res.status = 200;

    //     return {
    //         action: form.url,
    //         Ds_SignatureVersion: form.body.Ds_SignatureVersion,
    //         Ds_MerchantParameters: form.body.Ds_MerchantParameters,
    //         Ds_Signature: form.body.Ds_Signature,
    //     };
    // }
    async payCardItemsFromOrder(ctx) {
        try {
            const { orderId } = ctx.params;
            const user = ctx.state.user;
    
            if (!user) {
                return ctx.badRequest("You are not authenticated.");
            }
            const order = await orderServices.getOrder(
                { id: orderId },
                { 
                    seats: true, 
                    order_items: { 
                        populate: { 
                            product: true, 
                            seat: true, 
                            sharedWith: true, 
                            complement: true 
                        } 
                    },
                    table:{
                        populate: { 
                            restaurant: { 
                                populate: { 
                                    company : {
                                        populate: {
                                            redsys: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            );
            if (!order) {
                return ctx.notFound("The specified order was not found.");
            }
            order.order_items = order.order_items.filter(item => item.state !== "cancelled");
            if (user.userType === "guest") {
                order.order_items = order.order_items.filter(item => {
                    const isOwnedByUser = item.seat && item.seat.id === user.id;
                    const isSharedWithUser = item.sharedWith && item.sharedWith.some(shared => shared.id === user.id);
                    return isOwnedByUser || isSharedWithUser;
                });
            }
            for (const item of order.order_items) {
                if (item.isPaid === "true") {
                    item.price = 0;
                } else if (item.isPaid === "partial") {
                    const relatedPaymentItems = await strapi.entityService.findMany(
                        'api::payment-item.payment-item',
                        {
                            filters: {
                                orderItem: item.id,
                                payment: { transactionComplete: true },
                            },
                        }
                    );
                    const paidAmount = relatedPaymentItems.reduce((sum, paymentItem) => sum + paymentItem.amount, 0);
                    item.price = Math.max(0, item.price - paidAmount);
                }
            }
            const paymentItems = [];
            let totalAmount = 0;
            for (const orderItem of order.order_items) {
                const amount = parseFloat(orderItem.price) || 0;
                if (amount > 0) {
                    totalAmount += amount;
                    const userId = orderItem.seat ? orderItem.seat.id : user.id;
                    const paymentItem = await strapi.entityService.create("api::payment-item.payment-item", {
                        data: {
                            orderItem: orderItem.id,
                            amount: amount,
                            user: userId
                        }
                    });
                    paymentItems.push(paymentItem);
                }
            }
            if (paymentItems.length === 0) {
                return ctx.badRequest("No payable items found for this order/user.");
            }
            const company = order.table.restaurant.company;
            const randomOrderId = Math.floor(Math.random() * 1000000).toString();
            const payment = await strapi.entityService.create("api::payment.payment", {
                data: {
                    order: order.id,
                    paymentItems: paymentItems,
                    paidBy: user.id,
                    paidFor: [...new Set(paymentItems.map(pi => pi.user))], 
                    amount: totalAmount,
                    type: "redsys",
                    orderId: randomOrderId
                }
            });
            const { createRedirectForm } = createRedsysAPI({
                urls: SANDBOX_URLS,
                secretKey: company.redsys.secretKey,
            });
            const merchantInfo = {
                DS_MERCHANT_MERCHANTCODE: company.redsys.merchantCode,
                DS_MERCHANT_TERMINAL: company.redsys.merchantTerminal,
                DS_MERCHANT_MERCHANTNAME: company.redsys.merchantName,
            };
            const currencyInfo = CURRENCIES["EUR"];
            const redsysCurrency = currencyInfo.num;
            const redsysAmount = Math.round(totalAmount * 100);
            const merchantUrl = `${process.env.BACKEND_URL}/api/payment/${randomOrderId}/complete`;
            const form = createRedirectForm({
                ...merchantInfo,
                DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION,
                DS_MERCHANT_ORDER: randomOrderId,
                DS_MERCHANT_AMOUNT: redsysAmount,
                DS_MERCHANT_CURRENCY: redsysCurrency,
                DS_MERCHANT_MERCHANTURL: merchantUrl,
                DS_MERCHANT_URLOK: `${ctx.request.header.referer}confirmation?orderId=${orderId}&buyer=${user.name}`,
                DS_MERCHANT_URLKO: `${ctx.request.header.referer}errorRedsys?orderId=${orderId}`,
            });
            ctx.res.status = 200;
            return {
                action: form.url,
                Ds_SignatureVersion: form.body.Ds_SignatureVersion,
                Ds_MerchantParameters: form.body.Ds_MerchantParameters,
                Ds_Signature: form.body.Ds_Signature,
            };
    
        } catch (error) {
            console.error("Error processing payment from order:", error);
            ctx.internalServerError("An error occurred while processing the payment.");
        }
    },
    
    async payCardItems(ctx) {
        const { orderId } = ctx.params;
        const user = ctx.state.user;

        if (!user) {
            return ctx.badRequest("You are not authenticated.");
        }

        // Obtener la orden con todas las relaciones necesarias
        const order = await orderServices.getOrder({ id: orderId }, {
            table: {
                populate: {
                    restaurant: {
                        populate: {
                            company: {
                                populate: { redsys: true }
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return ctx.notFound("The specified order was not found.");
        }

        const company = order.table.restaurant.company;
        const { items } = ctx.request.body; // La estructura recibida de los items
        if(items.length === 0)
            return
        // Crear todos los PaymentItems
        const paymentItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const userId = item.id;
            for (const orderItem of item.items) {
                const amount = parseFloat(orderItem.price); // Convertir el precio en float
                totalAmount += amount; // Sumar al total general

                // Crear PaymentItem
                const paymentItem = await strapi.entityService.create("api::payment-item.payment-item", {
                    data: {
                        orderItem: orderItem.id, // Relación con el orderItem
                        amount: amount, // Monto del item
                        user: userId // Usuario que realizó el pedido
                    }
                });
                paymentItems.push(paymentItem); // Guardar el ID del paymentItem
            }
        }

        // Generar un orderId aleatorio
        const randomOrderId = Math.floor(Math.random() * 1000000).toString();

        // Crear el Payment
        const payment = await strapi.entityService.create("api::payment.payment", {
            data: {
                order: order.id, // Relación con la order
                paymentItems: paymentItems, // Relación con los paymentItems creados
                paidBy: user.id, // Usuario que realiza el pago
                paidFor: items.map(item => item.id), // Usuarios pagados
                amount: totalAmount, // Suma total
                type: "redsys", // Tipo de pago
                orderId: randomOrderId // ID aleatorio generado
            }
        });

        // Crear formulario de Redsys
        const { createRedirectForm } = createRedsysAPI({
            urls: SANDBOX_URLS,
            secretKey: company.redsys.secretKey,
        });

        const merchantInfo = {
            DS_MERCHANT_MERCHANTCODE: company.redsys.merchantCode,
            DS_MERCHANT_TERMINAL: company.redsys.merchantTerminal,
            DS_MERCHANT_MERCHANTNAME: company.redsys.merchantName,
        };

        const currencyInfo = CURRENCIES["EUR"];
        const redsysCurrency = currencyInfo.num;
        const redsysAmount = Math.round(totalAmount * 100);
        const merchantUrl = `${process.env.BACKEND_URL}/api/payment/${randomOrderId}/complete`

        const form = createRedirectForm({
            ...merchantInfo,
            DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION,
            DS_MERCHANT_ORDER: randomOrderId,
            DS_MERCHANT_AMOUNT: redsysAmount,
            DS_MERCHANT_CURRENCY: redsysCurrency,
            DS_MERCHANT_MERCHANTURL: merchantUrl,
            DS_MERCHANT_URLOK: `${ctx.request.header.referer}confirmation?orderId=${orderId}&buyer=${user.name}`,
            DS_MERCHANT_URLKO: `${ctx.request.header.referer}errorRedsys?orderId=${orderId}`,
        });

        ctx.res.status = 200;

        return {
            action: form.url,
            Ds_SignatureVersion: form.body.Ds_SignatureVersion,
            Ds_MerchantParameters: form.body.Ds_MerchantParameters,
            Ds_Signature: form.body.Ds_Signature,
        };
    },
    
    async markTransactionComplete(ctx) {
        const { paymentId } = ctx.params;
    
        try {
            // Obtener el payment actual con sus relaciones
            const payment = await paymentServices.getPayment(
                { orderId: paymentId },
                { order: true, paymentItems: {populate:{ orderItem: true }} }
            );
    
            if (!payment) {
                return ctx.notFound('Payment not found');
            }
    
            const paymentItems = payment.paymentItems; // Array de paymentItems relacionados
    
            // Iterar sobre cada paymentItem
            for (const paymentItem of paymentItems) {
                const orderItem = paymentItem.orderItem; // Obtener el orderItem relacionado
    
                if (!orderItem) {
                    continue; // Si no hay orderItem, saltar este paymentItem
                }
    
                // Buscar todos los paymentItems relacionados a este orderItem que tengan pagos completados
                const relatedPaymentItems = await strapi.entityService.findMany('api::payment-item.payment-item', {
                    filters: {
                        orderItem: orderItem.id, // Relación con el mismo orderItem
                        payment: { transactionComplete: true }, // Solo pagos completados
                    },
                    populate: { payment: true },
                });
    
                // Sumar los montos de los paymentItems relacionados (con transactionComplete = true)
                const relatedAmount = relatedPaymentItems.reduce((sum, item) => sum + item.amount, 0);
    
                // Calcular el monto total incluyendo el monto del paymentItem actual
                const totalAmount = relatedAmount + paymentItem.amount;
    
                // Comparar con el precio del orderItem
                const isPaid = totalAmount >= orderItem.price ? 'true' : 'partial';
    
                // Actualizar el campo isPaid del orderItem
                await strapi.entityService.update('api::order-item.order-item', orderItem.id, {
                    data: {
                        isPaid: isPaid,
                    },
                });
            }
    
            // Actualizar el campo transactionComplete del payment actual
            const updatedPayment = await strapi.entityService.update('api::payment.payment', payment.id, {
                data: {
                    transactionComplete: true,
                },
            });
    
            return ctx.send({
                message: 'Transaction marked as complete and order items updated',
                payment: updatedPayment,
            });
        } catch (error) {
            console.error('Error marking transaction as complete:', error);
            return ctx.internalServerError('An error occurred while updating the transaction.');
        }
    }
    
    
}))