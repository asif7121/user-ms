import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const updateWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { wishlistId } = req.query
		const { name } = req.body

		// Validate wishlistId
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
		}

		// Validate the new name
		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return res
				.status(400)
				.json({ error: 'New name is required and must be a non-empty string.' })
		}

		// Find the wishlist
		const wishlist = await Wishlist.findOne({ _user: _id, _id: wishlistId, isDeleted: false })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}

		// Update the name of the wishlist
		wishlist.name = name
		await wishlist.save()

		return res
			.status(200)
			.json({ success: true, message: 'Wishlist updated successfully.', data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
