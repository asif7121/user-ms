import { Cart } from "@models/cart"
import { Request, Response } from "express"






export const updateCart =  async (req: Request, res: Response) => {
    try {
        const {_id} = req.user
        const { productId } = req.query
        const { quantity } = req.body

        if (quantity < 1 || isNaN(quantity)) {
            return res.status(400).json({ message: 'Quantity must be at least 1' })
        }

        // Find the cart by user ID
        const cart = await Cart.findOne({ _user: _id })

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        // Find the item in the cart
        const item = cart.items.find(item => item.productId.toString() === productId)

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' })
        }

        // Update the quantity and totalPrice of the item
        item.quantity = quantity
        item.totalPrice = item.productPrice * item.quantity

        // Save the updated cart
        await cart.save()

        // Respond to the client with the updated cart
        res.status(200).json({ message: 'Cart updated successfully', cart: cart })
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message })
    }
}