import { Router } from "express";
import { getAllOrders, getOrderDetails, orderProduct } from "@modules/order/controller";






const router = Router()

router.post('/product', orderProduct)
router.get('/get-details', getOrderDetails)
router.get('/get-all',getAllOrders)

export const orderRouter = router 