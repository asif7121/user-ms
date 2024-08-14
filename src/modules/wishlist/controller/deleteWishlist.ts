import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const deleteWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { wishlistId } = req.query
		// Validate wishlistId
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
        }
        if (!wishlistId) {
			return res.status(400).json({ error: 'Please provide wishlist id.' })
        }
		// Find and update the wishlist
		const wishlist: any = await Wishlist.findOne(
			{ _id: wishlistId, _user: _id },
		)
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (wishlist.isDeleted) {
			return res.status(400).json({ error: 'This wishlist is already deleted.' })
		}
        wishlist.isDeleted = true
        wishlist.items._products = []
        wishlist.items._bundles = []
        await wishlist.save()
		return res.status(200).json({ success: true, message: 'Wishlist deleted successfully.' })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
