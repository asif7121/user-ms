import { Wishlist } from '@models/wishlist'
import { Request, Response } from 'express'


export const emptyWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const wishlist:any = await Wishlist.findOne({_user: _id})
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
        }
        if (wishlist.items.length === 0) {
            return res.status(400).json({error: 'Your wishlist is already empty.'})
        }

        wishlist.items = []
        await wishlist.save()
		return res.status(200).json({ success: true, message: 'Wishlist emptied successfully.' })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
