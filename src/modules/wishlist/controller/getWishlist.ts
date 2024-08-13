import { Wishlist } from "@models/wishlist";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";




export const getWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { wishlistId } = req.query

		// Validate wishlistId
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
		}

		// Aggregate to fetch the wishlist along with product and bundle details
		const wishlist = await Wishlist.aggregate([
			{
				$match: {
					_id: wishlistId,
					_user: _id,
					isDeleted: false,
				},
			},
			{
				$unwind: {
					path: '$items._products',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$items._bundles',
					preserveNullAndEmptyArrays: true,
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
				$group: {
					_id: '$_id',
					_user: { $first: '$_user' },
					name: { $first: '$name' },
					isPublic: { $first: '$isPublic' },
					isDeleted: { $first: '$isDeleted' },
					items: {
						$push: {
							_products: '$items._products',
							productDetails: { $arrayElemAt: ['$productDetails', 0] },
							_bundles: '$items._bundles',
							bundleDetails: { $arrayElemAt: ['$bundleDetails', 0] },
						},
					},
				},
			},
		])

		// Check if wishlist was found
		if (!wishlist || wishlist.length === 0) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}

		return res.status(200).json({ success: true, data: wishlist[0] })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}