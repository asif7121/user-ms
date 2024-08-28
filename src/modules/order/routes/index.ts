import { Router } from "express";
import { cancelOrder, getAllOrders, getOrderDetails, orderProduct } from "@modules/order/controller";






const router = Router()

router.post('/product', orderProduct)
router.get('/get-details', getOrderDetails)
router.get('/get-all', getAllOrders)
router.patch('/cancel', cancelOrder)

export const orderRouter = router 