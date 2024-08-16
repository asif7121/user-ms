import { Router } from "express";
import {
    addProductToWishlist,
	removeProductFromWishlist,
    updateWishlist,
    getWishlist,
    emptyWishlist,
} from '@modules/wishlist/controller'




const router = Router()

router.post('/add-product', addProductToWishlist)
router.patch('/remove-product', removeProductFromWishlist)
router.patch('/update', updateWishlist)
router.get('/get-details', getWishlist)
router.patch('/empty', emptyWishlist)



export const wishlistRouter = router