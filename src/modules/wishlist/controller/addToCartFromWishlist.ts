import { Cart } from "@models/cart";
import { Wishlist } from "@models/wishlist";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";





export const addToCartFromWishlist = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { productId } = req.query
		if (!productId || !isValidObjectId(productId)) {
			return res.status(400).json({ error: 'Invalid product Id.' })
		}
		const wishlist: any = await Wishlist.findOne({ _user: _id })
		if (!wishlist) {
			return res.status(404).json({ error: 'Wishlist not found.' })
		}
		if (wishlist.items.length === 0) {
			return res.status(400).json({ error: 'Your wishlist is empty.' })
		}
		// Check if the product exists in the wishlist
		const productIndex = wishlist.items.findIndex(
			(item) => item.productId.toString() === productId
		)
		if (productIndex === -1) {
			return res.status(400).json({ error: 'Product not found in your wishlist.' })
		}

		// Get the product details from the wishlist
		const product = wishlist.items[productIndex]

		// Find the user's cart
		let cart: any = await Cart.findOne({ _user: _id })

		// If cart doesn't exist, create a new one
		if (!cart) {
			cart = new Cart({ _user: _id, items: [] })
		}

		// Check if the product is already in the cart
		const cartProductIndex = cart.items.findIndex(
			(item) => item.productId.toString() === productId
		)

		if (cartProductIndex) {
			return res.status(400).json({error:'Your cart already have this item..'})
		} else {
			// If product is not in the cart, add it to the cart
			cart.items.push({
				productId: product.productId,
				productName: product.productName,
				productPrice: product.productPrice,
				quantity: 1,
				totalPrice: product.productPrice,
			})
		}

		// Remove the product from the wishlist
		wishlist.items.splice(productIndex, 1)

		// Save the updated cart and wishlist
		await cart.save()
		await wishlist.save()

		return res
			.status(200)
			.json({
				success: true,
				message: 'Product moved to cart from wishlist.',
				cart: cart,
				wishlist: wishlist,
			})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}