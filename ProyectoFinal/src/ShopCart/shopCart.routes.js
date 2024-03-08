import { Router } from "express"
import { addToCart, remove, update, view } from "./shopCart.controller.js"
import { validateJwt } from "../middlewares/validate.jwt.js"

const api = Router()

api.post('/add',[validateJwt], addToCart)
api.delete('/remove/:id',[validateJwt], remove)
api.put('/update/:id',[validateJwt], update)
api.get('/view',[validateJwt], view)

export default api