import { getAllBundle, getBundle } from "@modules/bundle/controller"
import { Router } from "express"



const router = Router()


router.get('/get-bundle', getBundle)
router.get('/get-all', getAllBundle)




export const bundleRouter = router
