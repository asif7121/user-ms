import { Request, Response } from 'express'
import { Order } from '@models/order'
import { isValidObjectId } from 'mongoose'


export const cancelOrder = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { orderId } = req.query

		// Find the order by ID and ensure it belongs to the authenticated user
		const order = await Order.findOne({ _id: orderId, _user: _id })

		if (!order) {
			return res.status(404).json({ error: 'Order not found or does not belong to you.' })
		}
        if (!isValidObjectId(orderId)) {
			return res.status(404).json({ error: `Invalid order ID : ${orderId}` })
        }
		
        if (order.orderStatus === 'Shipped') {
			return res.status(400).json({
				error: 'Order cannot be canceled. It already had been shipped, you can return it once delivered.',
			})
		}
		if (order.orderStatus === 'Delivered') {
			return res.status(400).json({
				error: 'Order already had been delivered, you can return it now.',
			})
		}
        if (order.orderStatus === 'Returned') {
			return res.status(400).json({
				error: 'Order has been returned.',
			})
        }
        if (order.orderStatus === 'Cancelled') {
			return res.status(400).json({
				error: 'Order already has been cancelled.',
			})
		}
		
		order.orderStatus = 'Cancelled'
		await order.save()

		// Return success response
		return res.status(200).json({
			success: true,
			message: 'Order canceled successfully.',
			data: order,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
