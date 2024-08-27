import { Request, Response } from 'express'
import { Order } from '@models/order'
import { isValidObjectId } from 'mongoose'

export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const { _id} = req.user
		const { orderId } = req.query
        
		if (!orderId) {
			return res.status(400).json({ error: 'Order ID is required.' })
		}
        if (!isValidObjectId(orderId)) {
			return res.status(400).json({ error: 'Order ID is Invalid.' })
        }
		// Find the order
		const order = await Order.findOne({_id: orderId, _user: _id})

		if (!order) {
			return res.status(404).json({ error: 'Order not found.' })
		}
        if (order.isDeleted) {
			return res.status(400).json({ error: 'Order has been deleted.' })
        }
		// Return the order details
		return res.status(200).json({
			success: true,
			data: order,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
