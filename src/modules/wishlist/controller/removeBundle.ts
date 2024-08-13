import { Bundle } from '@models/bundle'
import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const removeBundleFromWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { bundleId, wishlistId } = req.query

		// Validate bundleId and wishlistId
		if (!isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid bundle id.' })
		}
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
		}
		// Check if the product exists
		const bundle = await Bundle.findById(bundleId)
		if (!bundle) {
			return res.status(404).json({ error: 'bundle not found.' })
		}
		// Find the wishlist
		const wishlist: any = await Wishlist.findOne({ _user: _id, _id: wishlistId })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (wishlist.isDeleted) {
			return res.status(400).json({ error: 'Wishlist is deleted.' })
		}
		// Check if the bundle is in the wishlist
		const bundleExists = wishlist.items?._bundles?.some(
			(id) => id.toString() === bundleId.toString()
		)
		if (!bundleExists) {
			return res.status(400).json({ error: 'Bundle is not in the wishlist.' })
		}
		// Remove the bundle from the wishlist
		wishlist.items._bundles = wishlist.items?._bundles.filter(
			(id) => id.toString() !== bundleId
		)
		await wishlist.save()
		return res
			.status(200)
			.json({ success: true, message: 'Bundle removed from wishlist.', data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
