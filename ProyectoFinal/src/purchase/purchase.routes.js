import {Router} from 'express'
import { validateJwt } from '../middlewares/validate.jwt.js'
import { addPurchase, createAndDowload, purchaseRecord } from './purchase.controller.js'

const api = Router()

api.post('/purchase',[validateJwt], addPurchase)
api.get('/record',[validateJwt], purchaseRecord)
api.get('/bill/:id',[validateJwt], createAndDowload);

export default api