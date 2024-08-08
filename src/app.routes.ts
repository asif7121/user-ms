
import { verify_token } from "@middlewares/verify-token";
import { categoryRouter } from "@modules/category/routes";
import { productRouter } from "@modules/product/routes";
import { Router } from "express";



const router = Router()

router.use(verify_token)

router.use('/products', productRouter)
router.use('/category', categoryRouter)


export default router