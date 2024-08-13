import { Product } from '@models/product'
import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const removeProductFromWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { productId, wishlistId } = req.query

		// Validate productId and wishlistId
		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid product id.' })
		}
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
		}

		// Check if the product exists
		const product = await Product.findById(productId)
		if (!product) {
			return res.status(404).json({ error: 'Product not found.' })
		}

		// Find the wishlist
		const wishlist: any = await Wishlist.findOne({ _user: _id, _id: wishlistId })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (wishlist.isDeleted) {
			return res.status(400).json({ error: 'Wishlist is deleted.' })
		}

		// Check if the product is in the wishlist
		const productExists = wishlist.items?._products?.some(
			(id) => id.toString() === productId
		)
		if (!productExists) {
			return res.status(400).json({ error: 'Product is not in the wishlist.' })
		}
		// Remove the product from the wishlist
		wishlist.items._products = wishlist.items?._products.filter(
			(id) => id.toString() !== productId
		)
		await wishlist.save()

		return res
			.status(200)
			.json({ success: true, message: 'Product removed from wishlist.', data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
