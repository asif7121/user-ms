import { Cart } from '@models/cart'
import { Request, Response } from 'express'

export const removeAllProductFromCart = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user

		// Find the user's cart
		const cart = await Cart.findOne({ _user: _id })

		// If the cart does not exist
		if (!cart || cart.items.length === 0) {
			return res.status(400).json({ error: 'Your cart is already empty' })
		}
		// Clear the cart
		cart.items = []
		cart.totalItems = 0
		cart.totalCost = 0

		// Save the cart
		await cart.save()
		// Return the cart data
		return res.status(200).json({ success: true, cart: cart })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
