import { Router } from "express";
import {
	createWishlist,
	addProductToWishlist,
	addBundleToWishlist,
	removeBundleFromWishlist,
	removeProductFromWishlist,
    updateWishlist,
    getWishlist,
    getAllWishlist,
    deleteWishlist,
    emptyWishlist,
} from '@modules/wishlist/controller'




const router = Router()

router.post('/create', createWishlist)
router.patch('/add-product', addProductToWishlist)
router.patch('/add-bundle', addBundleToWishlist)
router.patch('/remove-bundle', removeBundleFromWishlist)
router.patch('/remove-product', removeProductFromWishlist)
router.patch('/update', updateWishlist)
router.get('/get-details', getWishlist)
router.get('/get-all', getAllWishlist)
router.patch('/delete', deleteWishlist)
router.patch('/empty', emptyWishlist)



export const wishlistRouter = router