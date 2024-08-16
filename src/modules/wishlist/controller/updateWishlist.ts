import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const updateWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { name, isPublic } = req.body
		if (!name && !isPublic) {
			return res.status(400).json({ error: 'Must provide field to update.' })
		}
		// Find the wishlist
		const wishlist = await Wishlist.findOne({ _user: _id })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (name !== undefined) {
			// Validate the new name
			if (typeof name !== 'string' || name.trim().length === 0) {
				return res.status(400).json({ error: 'New name must be a non-empty string.' })
			}
			// Update the name of the wishlist
			wishlist.name = name
		}
		if (isPublic !== undefined) {
			if (typeof isPublic !== 'boolean') {
				return res
					.status(400)
					.json({ error: 'Please provide only boolean value for this field.' })
			}
			wishlist.isPublic = isPublic
		}

		await wishlist.save()

		return res
			.status(200)
			.json({ success: true, message: 'Wishlist updated successfully.', data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
