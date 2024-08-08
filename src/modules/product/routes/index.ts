import { Router } from "express"
import { getAllProduct, getProduct } from "@modules/product/controller"






const router = Router()

router.get('/all-products', getAllProduct)
router.get('/get-detail', getProduct)




export const productRouter = router