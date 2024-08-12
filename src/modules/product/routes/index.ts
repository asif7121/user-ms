import { Router } from "express"
import { getAllProduct, getHotDeals, getProduct } from "@modules/product/controller"






const router = Router()

router.get('/all-products', getAllProduct)
router.get('/get-detail', getProduct)
router.get('/hot-deals', getHotDeals)




export const productRouter = router