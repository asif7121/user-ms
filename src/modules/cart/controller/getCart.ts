import { Cart } from "@models/cart";
import { Request, Response } from "express";






export const getCart = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user

		// Find the user's cart
		const cart = await Cart.findOne({ _user: _id })

		// If the cart does not exist, return an empty array
		if (!cart) {
			return res.status(200).json({ cart:{items:[]} })
		}

		// Return the cart data
		return res.status(200).json({ success: true, cart: cart })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}