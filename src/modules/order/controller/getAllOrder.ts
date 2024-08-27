import { Request, Response } from 'express'
import { Order } from '@models/order'

export const getAllOrders = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { page = 1, limit = 10 } = req.query

		const pageNumber = parseInt(page as string, 10)
		const pageSize = parseInt(limit as string, 10)
        const matchFilter = {
			isDeleted: false,
			_user: _id,
		}
		// Aggregation pipeline
		const orders = await Order.aggregate([
			{
				$match: matchFilter,
			},
			{
				$sort: { orderDate: 1 },
			},
			{
				$project: {
					_id: 1,
					products: 1,
					totalAmount: 1,
					shippingAddress: 1,
					paymentMethod: 1,
					paymentStatus: 1,
					orderStatus: 1,
					orderDate: 1,
					deliveryDate: 1,
				},
			},

			{
				$skip: (pageNumber - 1) * pageSize,
			},
			{
				$limit: pageSize,
			},
		])

		const totalOrders = await Order.countDocuments(matchFilter)
		const totalPages = Math.ceil(totalOrders / pageSize)

		// Return the orders and pagination info
		return res.status(200).json({
			success: true,
			currentPage: pageNumber,
			totalPages: totalPages,
			itemPerPage: pageSize,
			totalOrders: totalOrders,
			data: orders,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
