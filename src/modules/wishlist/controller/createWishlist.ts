import { Wishlist } from "@models/wishlist";
import { Request, Response } from "express";







export const createWishlist = async (req: Request, res: Response) => {
    try {
		const { _id } = req.user
		const { name } = req.body
		// Validate the name input
		if (name && (typeof name !== 'string' || name.trim().length === 0)) {
			return res.status(400).json({ error: 'Name must be a non-empty string.' })
		}

		// Check if the user already has a wishlist with the default name
		if (!name || name === 'My Wishlist') {
			const existingWishlist = await Wishlist.findOne({ _user: _id, name: 'My Wishlist' })
			if (existingWishlist) {
				return res
					.status(400)
					.json({ error: 'You already have a wishlist with the default name.' })
			}
		}
		const wishlist = await Wishlist.create({
			name,
			_user: _id,
		})
		return res.status(201).json({ success: true, data: wishlist })
	} catch (error) {
        console.error(error)
		res.status(500).json({ error:error.message })
    }
}