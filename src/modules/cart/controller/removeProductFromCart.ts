import { Cart } from '@models/cart'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const removeProductFromCart = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { productId }: any = req.query
		if (!isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid Product Id.' })
		}
		let cart = await Cart.findOne({ _user: _id })
		if (!cart || cart.items.length === 0) {
			return res.status(400).json({ error: 'Your is already empty.' })
		}

		// Check if the product exists in the cart
		const productExists = cart.items.some((item) => item.productId.toString() === productId)
		if (!productExists) {
			return res.status(400).json({ error: 'Your cart does not contain this product.' })
		}
		cart.items = cart.items.filter((p) => p.productId.toString() !== productId)
		await cart.save()
		return res.status(200).json({ success: true, data: cart })
    } catch (error) {
        console.error(error)
		return res.status(500).json({ error: error.message })
    }
}
