import { Router } from 'express'
import {
    getActiveSale,
    getAllProduct,
    getHotDeals,
    getProduct
} from '@modules/product/controller'

const router = Router()

router.get('/all-products', getAllProduct)
router.get('/get-detail', getProduct)
router.get('/hot-deals', getHotDeals)
router.get('/get-active-sale', getActiveSale)

export const productRouter = router
