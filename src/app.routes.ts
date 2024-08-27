
import { verify_token } from "@middlewares/verify-token";
import { bundleRouter } from "@modules/bundle/routes";
import { cartRouter } from "@modules/cart/routes";
import { categoryRouter } from "@modules/category/routes";
import { orderRouter } from "@modules/order/routes";
import { productRouter } from "@modules/product/routes";
import { wishlistRouter } from "@modules/wishlist/routes";
import { Router } from "express";



const router = Router()

router.use(verify_token)

router.use('/products', productRouter)
router.use('/category', categoryRouter)
router.use('/cart', cartRouter)
router.use('/bundle', bundleRouter)
router.use('/wishlist', wishlistRouter)
router.use('/order', orderRouter)


export default router