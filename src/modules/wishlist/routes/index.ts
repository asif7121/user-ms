import { Router } from "express";
import {
	createWishlist,
	addProductToWishlist,
	addBundleToWishlist,
	removeBundleFromWishlist,
	removeProductFromWishlist,
	updateWishlist,
} from '@modules/wishlist/controller'




const router = Router()

router.post('/create', createWishlist)
router.patch('/add-product', addProductToWishlist)
router.patch('/add-bundle', addBundleToWishlist)
router.patch('/remove-bundle', removeBundleFromWishlist)
router.patch('/remove-product', removeProductFromWishlist)
router.patch('/update', updateWishlist)



export const wishlistRouter = router