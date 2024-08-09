import { Router } from "express";
import { addProductToCart, getCart, removeAllProductFromCart, removeProductFromCart, updateCart } from "@modules/cart/controller";





const router = Router()

router.post('/add-product', addProductToCart)
router.patch('/remove-product', removeProductFromCart)
router.get('/get', getCart)
router.patch('/remove-all', removeAllProductFromCart)
router.patch('/update', updateCart)







export const cartRouter = router