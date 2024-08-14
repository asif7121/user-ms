import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'


export const getAllWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const {
			page = 1,
			limit = 10,
			search = '',
		} = req.query

		// Pagination setup
		const skip = (Number(page) - 1) * Number(limit)

		// Aggregate pipeline
		const wishlist = await Wishlist.aggregate([
			{
				$match: {
					_user: _id,
					isDeleted: false,
				},
			},
			{
				$lookup: {
					from: 'products',
					localField: 'items._products',
					foreignField: '_id',
					as: 'productDetails',
				},
			},
			{
				$lookup: {
					from: 'bundles',
					localField: 'items._bundles',
					foreignField: '_id',
					as: 'bundleDetails',
				},
			},
			{
				$addFields: {
					products: {
						$filter: {
							input: '$productDetails',
							as: 'product',
							cond: {
								$regexMatch: {
									input: '$$product.name',
									regex: search,
									options: 'i', // case insensitive
								},
							},
						},
					},
					bundles: {
						$filter: {
							input: '$bundleDetails',
							as: 'bundle',
							cond: {
								$regexMatch: {
									input: '$$bundle.name',
									regex: search,
									options: 'i',
								},
							},
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					_user: 1,
					name: 1,
					isPublic: 1,
					isDeleted: 1,
					products: {
						$map: {
							input: '$products',
							as: 'product',
							in: {
								_id: '$$product._id',
								name: '$$product.name',
								price: '$$product.price',
							},
						},
					},
					bundles: {
						$map: {
							input: '$bundles',
							as: 'bundle',
							in: {
								_id: '$$bundle._id',
								name: '$$bundle.name',
								price: '$$bundle.price',
							},
						},
					},
				},
			},
			
			{
				$sort: {name: 1},
			},
			// Pagination
			{
				$skip: skip,
			},
			{
				$limit: Number(limit),
			},
		])

		// Total count for pagination
		const total = await Wishlist.countDocuments({ _user: _id, isDeleted: false })

		return res.status(200).json({
			success: true,
			totalItems: total,
			page: Number(page),
			itemsPerPage: Number(limit),
			totalPages: Math.ceil(total / Number(limit)),
			data: wishlist,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
