import { Bundle } from "@models/bundle";
import { Cart } from "@models/cart";
import { Product } from "@models/product";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";







export const addProductToCart = async (req: Request, res: Response) => {
    try {
		const { _id } = req.user
        const { productId, bundleId }: any = req.query
        const {quantity} = req.body
        if (productId && bundleId) {
            return res.status(400).json({error:'Cannot add product and bundle at same time.'})
        }
		if (!quantity || isNaN(quantity) || quantity <= 0) {
			return res.status(400).json({ error: 'Please provide a valid quantity.' })
        }
        
		// Find the user's cart or create a new one
        let cart: any = await Cart.findOne({ _user: _id })
        if (productId) {
            if (!isValidObjectId(productId)) {
				return res.status(400).json({ error: 'Invalid product Id.' })
			}
            const product = await Product.findOne({
				_id: productId,
				isBlocked: false,
				isDeleted: false,
			})
			if (!product) {
				return res.status(404).json({ error: 'Product not found.' })
			}
            if (!cart) {
				cart = new Cart({
					_user: _id,
					items: [
						{
							productId: product._id,
							productName: product.name,
							productPrice: product.price,
							quantity: quantity,
							totalPrice: product.price * quantity,
						},
					],
				})
				await cart.save()
			} else {
				const cartItem = cart.items.find((item) => item.productId.toString() === productId)

				if (cartItem) {
					// If the product is already in the cart, update the quantity and total price
					cartItem.quantity += quantity
					cartItem.totalPrice = cartItem.quantity * product.price
				} else {
					// If the product is not in the cart, add it as a new item
					cart.items.push({
						productId: product._id,
						productName: product.name,
						productPrice: product.price,
						quantity: quantity,
						totalPrice: product.price * quantity,
					})
				}
			}

			await cart.save()
        } else if (bundleId) {
            if (!isValidObjectId(bundleId)) {
				return res.status(400).json({ error: 'Invalid bundle Id.' })
			}
            const bundle = await Bundle.findOne({
				_id: bundleId,
				isBlocked: false,
				isDeleted: false,
            })
            if (!bundle) {
                return res.status(404).json({ error: 'Bundle not found.' })
            }
            if (!cart) {
				cart = new Cart({
					_user: _id,
					items: [
						{
							productId: bundle._id,
							productName: bundle.name,
							productPrice: bundle.price,
							quantity: quantity,
							totalPrice: bundle.price * quantity,
						},
					],
				})
				await cart.save()
			} else {
				const cartItem = cart.items.find((item) => item.productId.toString() === productId)

				if (cartItem) {
					// If the product is already in the cart, update the quantity and total price
					cartItem.quantity += quantity
					cartItem.totalPrice = cartItem.quantity * bundle.price
				} else {
					// If the product is not in the cart, add it as a new item
					cart.items.push({
						productId: bundle._id,
						productName: bundle.name,
						productPrice: bundle.price,
						quantity: quantity,
						totalPrice: bundle.price * quantity,
					})
				}
			}

			await cart.save()
        }
        if (!productId && !bundleId) {
            return res.status(400).json({ error: 'Please provide product to add in the cart.' })
        }
		return res.status(200).json({ success: true, data: cart })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}