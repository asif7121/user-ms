import { Wishlist } from "@models/wishlist";
import { Request, Response } from "express";





export const getWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user

		const wishlist = await Wishlist.findOne({_user: _id})
        if (!wishlist) {
            return res.status(200).json({data:{items:[]}})
        }
		return res.status(200).json({ success: true, data: wishlist })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}