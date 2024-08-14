import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const emptyWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { wishlistId } = req.query
		// Validate wishlistId
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
		}
		// Find and update the wishlist to remove all items
		const wishlist = await Wishlist.findOneAndUpdate(
			{ _id: wishlistId, _user: _id, isDeleted: false },
			{ $set: { 'items._products': [], 'items._bundles': [] } },
			{ new: true }
		)
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		return res.status(200).json({ success: true, message: 'Wishlist emptied successfully.' })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
