import { getAllCategory, getCategory } from "@modules/category/controller"
import { Router } from "express"


const router = Router()


router.get('/get-category', getCategory)
router.get('/get-all-category', getAllCategory)



export const categoryRouter = router
