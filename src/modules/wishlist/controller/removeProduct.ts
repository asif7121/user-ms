import { Product } from '@models/product'
import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const removeProductFromWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { productId }: any = req.query
		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid Product Id.' })
		}
		let wishlist:any = await Wishlist.findOne({ _user: _id })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (wishlist.items.length === 0) {
			return res.status(400).json({ error: 'Your wishlist is empty.' })
		}

		// Check if the product exists in the wishlist
		const productExists = wishlist.items.some((item) => item.productId.toString() === productId)
		if (!productExists) {
			return res.status(400).json({ error: 'Your wishlist does not contain this product.' })
		}
		wishlist.items = wishlist.items.filter((p) => p.productId.toString() !== productId)
		await wishlist.save()
		return res.status(200).json({ success: true, data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
