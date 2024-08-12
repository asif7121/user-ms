import { Discount } from "@models/discount";
import { Request, Response } from "express";





export const getHotDeals = async (req: Request, res: Response) => {
	try {
		const topDeals = await Discount.aggregate([
			// Match active and non-deleted discounts
			{
				$match: {
					isDeleted: false,
					startDate: { $lte: new Date() },
					endDate: { $gte: new Date() },
				},
			},
			// Process product and bundle discounts separately
			{
				$facet: {
					// Handling discounts applied directly to products
					productDiscounts: [
						{
							$match: {
								_products: { $exists: true, $ne: [] },
							},
						},
						{ $unwind: '$_products' },
						{
							$lookup: {
								from: 'products',
								localField: '_products',
								foreignField: '_id',
								as: 'productDetails',
							},
						},
						{ $unwind: '$productDetails' },
						{
							$project: {
								_id: 0,
								type: 'product',
								discountId: '$_id',
								productId: '$productDetails._id',
								productName: '$productDetails.name',
								productPrice: '$productDetails.price',
								productMRP: '$productDetails.mrp',
								discountValue: '$value',
								discountType: '$type',
							},
						},
					],
					// Handling discounts applied to bundles
					bundleDiscounts: [
						{
							$match: {
								_bundles: { $exists: true, $ne: [] },
							},
						},
						{ $unwind: '$_bundles' },
						{
							$lookup: {
								from: 'bundles',
								localField: '_bundles',
								foreignField: '_id',
								as: 'bundleDetails',
							},
						},
						{ $unwind: '$bundleDetails' },
						{
							$lookup: {
								from: 'products',
								localField: 'bundleDetails._products',
								foreignField: '_id',
								as: 'bundleProducts',
							},
						},
						{
							$project: {
								_id: 0,
								type: 'bundle',
								discountId: '$_id',
								bundleId: '$bundleDetails._id',
								bundleName: '$bundleDetails.name',
								bundlePrice: '$bundleDetails.price',
								bundleMRP: '$bundleDetails.mrp',
								discountValue: '$value',
								discountType: '$type',
								products: {
									$map: {
										input: '$bundleProducts',
										as: 'product',
										in: {
											productId: '$$product._id',
											productName: '$$product.name',
											productPrice: '$$product.price',
											productMRP: '$$product.mrp',
										},
									},
								},
							},
						},
					],
				},
			},
			// Combine the results from both facets
			{
				$project: {
					combined: { $concatArrays: ['$productDiscounts', '$bundleDiscounts'] },
				},
			},
			// Unwind the combined array to get individual documents
			{ $unwind: '$combined' },
			// Replace the root to simplify the document structure
			{
				$replaceRoot: { newRoot: '$combined' },
			},
			// Sort by discount value in descending order to highlight top deals
			{ $sort: { discountValue: -1 } },
			// Limit the results to the top 10 deals
			{ $limit: 10 },
		])

		return res.status(200).json({
			message: 'Hot Deals of the Day',
			data: topDeals,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error', error })
	}
}