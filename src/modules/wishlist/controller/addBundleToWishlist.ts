
import { Bundle } from '@models/bundle'
import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const addBundleToWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { bundleId, wishlistId } = req.query
		if (!isValidObjectId(bundleId)) {
			return res.status(400).json({ error: 'Invalid bundle id.' })
		}
		if (!isValidObjectId(wishlistId)) {
			return res.status(400).json({ error: 'Invalid wishlist id.' })
		}
		const bundle = await Bundle.findById(bundleId)
		if (!bundle) {
			return res.status(404).json({ error: 'bundle not found.' })
		}
		if (bundle.isDeleted) {
			return res.status(400).json({ error: 'bundle is deleted.' })
		}
		if (bundle.isBlocked) {
			return res.status(400).json({ error: 'bundle is blocked.' })
		}
		const wishlist: any = await Wishlist.findOne({ _user: _id, _id: wishlistId })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (wishlist.isDeleted) {
			return res.status(400).json({ error: 'Wishlist is deleted.' })
		}
		// Check if the bundle is already in the wishlist
		const bundleExists = wishlist.items?._bundles?.some(
			(id) => id.toString() === bundleId
		)
		if (bundleExists) {
			return res.status(400).json({ error: 'Bundle is already in the wishlist.' })
		}

		// Add the bundle to the wishlist
		wishlist.items?._bundles.push(bundle._id)
		await wishlist.save()
		return res.status(200).json({ success: true, data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
