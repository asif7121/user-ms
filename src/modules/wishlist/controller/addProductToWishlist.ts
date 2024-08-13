import { Product } from "@models/product";
import { Wishlist } from "@models/wishlist";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";







export const addProductToWishlist = async (req: Request, res: Response) => {
    try {
        const { _id } = req.user
        const { productId, wishlistId } = req.query
        if (!isValidObjectId(productId)) {
            return res.status(400).json({ error: 'Invalid product id.' })
        }
        if (!isValidObjectId(wishlistId)) {
            return res.status(400).json({ error: 'Invalid wishlist id.' })
        }
        const product = await Product.findById(productId)
        if (!product) {
			return res.status(404).json({ error: 'Product not found.' })
		}
		if (product.isDeleted) {
			return res.status(400).json({ error: 'Product is deleted.' })
		}
		if (product.isBlocked) {
			return res.status(400).json({ error: 'Product is blocked.' })
		}
        const wishlist: any = await Wishlist.findOne({ _user: _id, _id: wishlistId })
        if (!wishlist) {
            return res.status(404).json({error:'Wishlist not found.'})
        }
        if (wishlist.isDeleted) {
            return res.status(400).json({ error: 'Wishlist is deleted.' })
        }
         const productExists = wishlist.items?._products.some(
				(id) => id.toString() === productId
			)
			if (productExists) {
				return res.status(400).json({ error: 'Product is already in the wishlist.' })
			}
			// Add the product to the wishlist
			wishlist.items?._products.push(product._id)
			await wishlist.save()
			return res.status(200).json({success:true, data: wishlist })
    } catch (error) {
        console.error(error)
		res.status(500).json({ error: error.message })
    }
}