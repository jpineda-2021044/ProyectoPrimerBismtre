'use strict'

import express from 'express'
import { isAdmin, validateJwt } from '../middlewares/validate.jwt.js'
import { save, search, update, deleteP, get, moreSellers } from './product.controller.js'

const api = express.Router()

api.post('/save', [validateJwt, isAdmin], save,)
api.get('/search', [validateJwt] , search)
api.get('/best',[validateJwt], moreSellers)
api.put('/update/:id', [validateJwt, isAdmin] , update)
api.delete('/delete/:id', [validateJwt, isAdmin],  deleteP)
api.post('/get',[validateJwt], get)

export default api