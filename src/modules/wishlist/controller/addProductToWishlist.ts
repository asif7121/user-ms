import { Bundle } from "@models/bundle";
import { Product } from "@models/product";
import { Wishlist } from "@models/wishlist";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";







export const addProductToWishlist = async (req: Request, res: Response) => {
    try {
		const { _id } = req.user
		const { productId, bundleId }: any = req.query
		
		if (productId && bundleId) {
			return res.status(400).json({ error: 'Cannot add product and bundle at same time.' })
		}
		if (!productId && !bundleId) {
			return res.status(400).json({ error: 'Please provide product to add in the wishlist.' })
		}

		// Find the user's wishlist or create a new one
		let wishlist: any = await Wishlist.findOne({ _user: _id })
		if (productId) {
			if (!isValidObjectId(productId)) {
				return res.status(400).json({ error: 'Invalid product Id.' })
			}
			const product = await Product.findOne({
				_id: productId,
				isBlocked: false,
				isDeleted: false,
			})
			if (!product) {
				return res.status(404).json({ error: 'Product not found.' })
			}
			if (!wishlist) {
				wishlist = new Wishlist({
					_user: _id,
					items: [
						{
							productId: product._id,
							productName: product.name,
							productPrice: product.price,
						},
					],
				})
				await wishlist.save()
			} else {
				const items = wishlist.items.find(
					(item) => item.productId.toString() === productId
				)

				if (items) {
					return res.status(400).json({error:'This item is already added in your wishlist.'})
				} else {
					// If the product is not in the wishlist, add it as a new item
					wishlist.items.push({
						productId: product._id,
						productName: product.name,
						productPrice: product.price,
					})
				}
			}

			await wishlist.save()
		} else if (bundleId) {
			if (!isValidObjectId(bundleId)) {
				return res.status(400).json({ error: 'Invalid bundle Id.' })
			}
			const bundle = await Bundle.findOne({
				_id: bundleId,
				isBlocked: false,
				isDeleted: false,
			})
			if (!bundle) {
				return res.status(404).json({ error: 'Bundle not found.' })
			}
			if (!wishlist) {
				wishlist = new Wishlist({
					_user: _id,
					items: [
						{
							productId: bundle._id,
							productName: bundle.name,
							productPrice: bundle.price,
						},
					],
				})
				await wishlist.save()
			} else {
				const item = wishlist.items.find(
					(item) => item.productId.toString() === bundleId
				)

				if (item) {
					return res
						.status(400)
						.json({ error: 'This item is already added in your wishlist.' })
				
				} else {
					// If the product is not in the wishlist, add it as a new item
					wishlist.items.push({
						productId: bundle._id,
						productName: bundle.name,
						productPrice: bundle.price,
					})
				}
			}

			await wishlist.save()
		}

		return res.status(200).json({ success: true, data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}